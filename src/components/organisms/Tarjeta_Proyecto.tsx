"use client"

import { useState, useEffect } from "react"
import type { ProyectoUI, AsignacionUI, ApiAsignacionProyecto } from "@/types/Proyectos"
import { EquipoIconos } from "../molecules/Equipo-Iconos"
import Barra_Porcentaje from "../molecules/Barra-Porcentaje"
import Tabla from "./Tablas"
import { getAsignacionesByProyecto, createAsignacion } from "@/services/Asignaciones.service"
import ModalCrearAsignacion from "@/components/organisms/Modal_Crear_Asignacion"
import "@/styles/Proyectos.css"
import { usePermissions } from "@/hooks/usePermissions"

interface ProyectoCardProps {
  proyecto: ProyectoUI
  tareasSeleccionadas: string[]
  onSeleccionTarea: (tareaId: string) => void
  debeExpandirse?: boolean
}

function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "N/A"
  return new Date(fechaISO).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function ProyectoCard({
  proyecto,
  tareasSeleccionadas,
  onSeleccionTarea,
  debeExpandirse,
}: ProyectoCardProps) {
  const [expandido, setExpandido] = useState(false)
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false)
  const [mostrarModalCrearAsignacion, setMostrarModalCrearAsignacion] = useState(false)

  const [asignaciones, setAsignaciones] = useState<AsignacionUI[]>([])
  const [enProceso, setEnProceso] = useState<AsignacionUI[]>([])
  const [enviados, setEnviados] = useState<AsignacionUI[]>([])
  const [correcciones, setCorrecciones] = useState<AsignacionUI[]>([])
  const [terminados, setTerminados] = useState<AsignacionUI[]>([])

  const [asignacionesExpandido, setAsignacionesExpandido] = useState(false)
  const [enProcesoExpandido, setEnProcesoExpandido] = useState(false)
  const [enviadosExpandido, setEnviadosExpandido] = useState(false)
  const [correccionesExpandido, setCorreccionesExpandido] = useState(false)
  const [terminadosExpandido, setTerminadosExpandido] = useState(false)

  const { canCreateAssignment } = usePermissions()

  useEffect(() => {
    if (debeExpandirse && !expandido) {
      setExpandido(true)
    }
  }, [debeExpandirse])

  const clasificarAsignaciones = (lista: ApiAsignacionProyecto[]) => {
    const listas = { asignaciones: [], enProceso: [], enviados: [], correcciones: [], terminados: [] } as Record<
      string,
      AsignacionUI[]
    >

    lista.forEach((item) => {
      const asignacionUI: AsignacionUI = {
        id: String(item.ID_Asignacion),
        nombre: item.Titulo_Asignacion,
        usuariosAsignados: (item.usuarios_asignados || []).map((u) => ({
          id: String(u.ID_Usuario),
          nombre: u.Nombre_Usuario,
          color: u.Color,
        })),
        fechaAsignacion: formatearFecha(item.Fecha_Creacion),
        fechaEntrega: formatearFecha(item.Fecha_Entrega),
        prioridad: item.Prioridad,
      }

      switch (item.Estado_Asignacion) {
        case "Asignaciones":
          listas.asignaciones.push(asignacionUI)
          break
        case "En proceso":
          listas.enProceso.push(asignacionUI)
          break
        case "Enviados":
          listas.enviados.push(asignacionUI)
          break
        case "Correcciones":
          listas.correcciones.push(asignacionUI)
          break
        case "Terminados":
          listas.terminados.push(asignacionUI)
          break
        default:
          listas.asignaciones.push(asignacionUI)
          break
      }
    })

    setAsignaciones(listas.asignaciones)
    setEnProceso(listas.enProceso)
    setEnviados(listas.enviados)
    setCorrecciones(listas.correcciones)
    setTerminados(listas.terminados)
  }

  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (expandido && asignaciones.length === 0 && enProceso.length === 0 && enviados.length === 0) {
        setLoadingAsignaciones(true)
        const data = await getAsignacionesByProyecto(proyecto.id)
        clasificarAsignaciones(data)
        setLoadingAsignaciones(false)
      }
    }
    fetchAsignaciones()
  }, [expandido, proyecto.id])

  const handleCrearAsignacion = async (datosFormulario: any) => {
    try {
      const idUsuarioActual = 1 // Esto debería venir del contexto/props del usuario actual
      const datosParaAPI = {
        Titulo_Asignacion: datosFormulario.titulo,
        Descripción_Asignacion: datosFormulario.descripcion,
        Prioridad: datosFormulario.prioridad,
        Fecha_Creacion: datosFormulario.fecha_inicio,
        Fecha_Entrega: datosFormulario.fecha_termino,
        ID_Proyecto: datosFormulario.id_proyecto,
        Creado_Por: idUsuarioActual,
        usuarios: datosFormulario.asignados,
        archivos: [],
      }
      await createAsignacion(datosParaAPI)
      setMostrarModalCrearAsignacion(false)
      // Refresca las asignaciones del proyecto
      const data = await getAsignacionesByProyecto(proyecto.id)
      clasificarAsignaciones(data)
    } catch (error) {
      console.error("Error al crear la asignación:", error)
      alert("No se pudo crear la asignación.")
    }
  }

  const getEstadoClase = (estado: string) => {
    switch (estado) {
      case "En proceso":
        return "estado-en-proceso"
      case "Terminado":
        return "estado-terminado"
      default:
        return "estado-pendiente"
    }
  }

  const getPrioridadClase = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "prioridad-alta"
      case "Media":
        return "prioridad-media"
      default:
        return "prioridad-baja"
    }
  }

  const Columnas = ["Nombre", "Usuarios Asignados", "Fecha de Asignación", "Fecha de Entrega", "Prioridad"]

  const convertirAsignacionesATabla = (listaAsignaciones: AsignacionUI[]) => {
    return listaAsignaciones.map((asignacion) => [
      <div key={`check-${asignacion.id}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {canCreateAssignment ? (
          <input
            type="checkbox"
            checked={tareasSeleccionadas.includes(asignacion.id)}
            onChange={() => onSeleccionTarea(asignacion.id)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div style={{ width: "20px" }} />
        )}
        <span>{asignacion.nombre}</span>
      </div>,
      <EquipoIconos key={`equipo-${asignacion.id}`} integrantes={asignacion.usuariosAsignados} />,
      asignacion.fechaAsignacion,
      asignacion.fechaEntrega,
      <span key={`prioridad-${asignacion.id}`} className={getPrioridadClase(asignacion.prioridad)}>
        • {asignacion.prioridad}
      </span>,
    ])
  }

  return (
    <div className="Proyecto_Tarjeta">
      <div className="Proyecto_Tarjeta_Titulo" onClick={() => setExpandido(!expandido)}>
        <div className="Proyecto_Tarjeta_TituloIzq">
          <button className={`btn-expandir ${expandido ? "expandido" : ""}`}>▼</button>
          <h2 className="Proyecto_Nombre">{proyecto.nombre}</h2>
        </div>
        <div className="Proyecto_Tarjeta_TituloDer">
          <span className="Proyecto_Tarjeta_Info">Fecha de inicio: {proyecto.fechaInicio}</span>
          <span className="Proyecto_Tarjeta_Info">
            Estado: <span className={getEstadoClase(proyecto.estado)}>{proyecto.estado}</span>
          </span>
          <span className="Proyecto_Tarjeta_Info">Avance: {proyecto.avance}%</span>
          <Barra_Porcentaje porcentaje={proyecto.avance} />
          <div className="Proyecto_Equipo">
            <span className="Proyecto_Tarjeta_Info">Equipo:</span>
            <div className="Miembros_Proyecto">
              <EquipoIconos integrantes={proyecto.equipo} />
            </div>
          </div>
        </div>
      </div>

      {expandido && (
        <div className="Proyecto_Tarjeta_Contenido">
          {loadingAsignaciones ? (
            <p style={{ padding: "20px" }}>Cargando tareas...</p>
          ) : (
            <>
              {/* Sección Asignaciones */}
              <div className="Seccion_Estado">
                <div className="Seccion_Estado_Header" onClick={() => setAsignacionesExpandido(!asignacionesExpandido)}>
                  <button className={`Btn_Expandir_Seccion ${asignacionesExpandido ? "expandido" : ""}`}>▼</button>
                  <span className="Seccion_Titulo">Asignaciones</span>
                  <span className="Seccion_Contador">{asignaciones.length}</span>
                </div>
                {asignacionesExpandido && (
                  <div className="Tabla_Asignaciones_Container">
                    <Tabla
                      columnas={Columnas}
                      datos={convertirAsignacionesATabla(asignaciones)}
                      TaFila={40}
                      TletraDatos={14}
                      TletraEncabezado={13}
                      AlturaMaxima={50}
                    />
                  </div>
                )}
              </div>

              {/* Sección En proceso */}
              <div className="Seccion_Estado">
                <div className="Seccion_Estado_Header" onClick={() => setEnProcesoExpandido(!enProcesoExpandido)}>
                  <button className={`Btn_Expandir_Seccion ${enProcesoExpandido ? "expandido" : ""}`}>▼</button>
                  <span className="Seccion_Titulo">En proceso</span>
                  <span className="Seccion_Contador">{enProceso.length}</span>
                </div>
                {enProcesoExpandido && (
                  <div className="Tabla_Asignaciones_Container">
                    <Tabla
                      columnas={Columnas}
                      datos={convertirAsignacionesATabla(enProceso)}
                      TaFila={40}
                      TletraDatos={14}
                      TletraEncabezado={13}
                      AlturaMaxima={50}
                    />
                  </div>
                )}
              </div>

              {/* Sección Enviados */}
              <div className="Seccion_Estado">
                <div className="Seccion_Estado_Header" onClick={() => setEnviadosExpandido(!enviadosExpandido)}>
                  <button className={`Btn_Expandir_Seccion ${enviadosExpandido ? "expandido" : ""}`}>▼</button>
                  <span className="Seccion_Titulo">Enviados</span>
                  <span className="Seccion_Contador">{enviados.length}</span>
                </div>
                {enviadosExpandido && (
                  <div className="Tabla_Asignaciones_Container">
                    <Tabla
                      columnas={Columnas}
                      datos={convertirAsignacionesATabla(enviados)}
                      TaFila={40}
                      TletraDatos={14}
                      TletraEncabezado={13}
                      AlturaMaxima={50}
                    />
                  </div>
                )}
              </div>

              {/* Sección Correcciones */}
              <div className="Seccion_Estado">
                <div className="Seccion_Estado_Header" onClick={() => setCorreccionesExpandido(!correccionesExpandido)}>
                  <button className={`Btn_Expandir_Seccion ${correccionesExpandido ? "expandido" : ""}`}>▼</button>
                  <span className="Seccion_Titulo">Correcciones</span>
                  <span className="Seccion_Contador">{correcciones.length}</span>
                </div>
                {correccionesExpandido && (
                  <div className="Tabla_Asignaciones_Container">
                    <Tabla
                      columnas={Columnas}
                      datos={convertirAsignacionesATabla(correcciones)}
                      TaFila={40}
                      TletraDatos={14}
                      TletraEncabezado={13}
                      AlturaMaxima={50}
                    />
                  </div>
                )}
              </div>

              {/* Sección Terminados */}
              <div className="Seccion_Estado">
                <div className="Seccion_Estado_Header" onClick={() => setTerminadosExpandido(!terminadosExpandido)}>
                  <button className={`Btn_Expandir_Seccion ${terminadosExpandido ? "expandido" : ""}`}>▼</button>
                  <span className="Seccion_Titulo">Terminados</span>
                  <span className="Seccion_Contador">{terminados.length}</span>
                </div>
                {terminadosExpandido && (
                  <div className="Tabla_Asignaciones_Container">
                    <Tabla
                      columnas={Columnas}
                      datos={convertirAsignacionesATabla(terminados)}
                      TaFila={40}
                      TletraDatos={14}
                      TletraEncabezado={13}
                      AlturaMaxima={50}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {canCreateAssignment && (
            <button
              className="Btn_Añadir_Asignaciones"
              onClick={(e) => {
                e.stopPropagation()
                setMostrarModalCrearAsignacion(true)
              }}
            >
              + Crear Asignación
            </button>
          )}

          <ModalCrearAsignacion
            isOpen={mostrarModalCrearAsignacion}
            onClose={() => setMostrarModalCrearAsignacion(false)}
            onCrearAsignacion={handleCrearAsignacion}
            usuarios={proyecto.equipo.map((m) => ({ id: m.id, nombre: m.nombre }))}
            projectId={proyecto.id}
          />
        </div>
      )}
    </div>
  )
}
