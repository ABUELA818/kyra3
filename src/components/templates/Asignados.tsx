"use client"
import { useEffect, useState } from "react"
import { useUser } from "@/context/userContext"
import { useSearchParams } from "next/navigation"
import AsignacionesRecibidas from "@/components/organisms/Asignaciones_Recibidas"
import AsignacionDetalle from "@/components/organisms/Asignacion-Detalle"
import CrearAsignacion from "@/components/organisms/Crear_Asignacion"
import "@/styles/Asignados.css"

import { getAsignacionesEnviadasByCreador, createAsignacion } from "@/services/Asignaciones.service"
import { getAllUsers } from "@/services/Usuarios.service"
import type { ApiAsignacionCreada, AsignacionUI, HistorialItem } from "@/types/Asignaciones"
import type { Usuario } from "@/types/Usuario"

function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "N/A"
  return new Date(fechaISO).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function Asignados() {
  const { usuario } = useUser()
  const searchParams = useSearchParams()

  const [asignaciones, setAsignaciones] = useState<AsignacionUI[]>([])
  const [usuariosDeApi, setUsuariosDeApi] = useState<Usuario[]>([])
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loadingHistorial, setLoadingHistorial] = useState(false)

  const fetchDatos = async () => {
    if (!usuario?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [dataAsignaciones, dataUsuarios] = await Promise.all([
        getAsignacionesEnviadasByCreador(usuario.id),
        getAllUsers(),
      ])

      const asignacionesFormateadas: AsignacionUI[] = dataAsignaciones.map((item: ApiAsignacionCreada) => ({
        id: item.ID_Asignacion,
        titulo: item.Titulo_Asignacion,
        descripcion: item.Descripción_Asignacion,
        estado: item.Estado_Asignacion,
        fecha_inicio: formatearFecha(item.Fecha_Creacion),
        fecha_termino: formatearFecha(item.Fecha_Entrega),
        prioridad: (item.Prioridad || "baja").toLowerCase() as AsignacionUI["prioridad"],
        asignados:
          item.usuarios_asignados?.map((user) => ({
            nombre: user.Nombre_Usuario,
            color: user.Color,
          })) || [],
        autor: {
          nombre: item.creado_por.Nombre_Usuario,
          id: item.creado_por.ID_Usuario,
        },
      }))

      setAsignaciones(asignacionesFormateadas)
      setUsuariosDeApi(dataUsuarios)

      if (asignacionesFormateadas.length > 0 && !asignacionSeleccionada) {
        setAsignacionSeleccionada(asignacionesFormateadas[0].id)
      }
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatos()
  }, [usuario?.id])

  useEffect(() => {
    const asignacionId = searchParams.get("id")
    if (asignacionId && asignaciones.length > 0) {
      const id = Number.parseInt(asignacionId)
      const asignacion = asignaciones.find((a) => a.id === id)
      if (asignacion) {
        setAsignacionSeleccionada(id)
      }
    }
  }, [searchParams, asignaciones])

  const handleAsignacionActualizada = async () => {
    await fetchDatos()
  }

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!asignacionSeleccionada) {
        setHistorial([])
        return
      }
      try {
        setLoadingHistorial(true)
        const { getHistorialDeAsignacion } = await import("@/services/Asignaciones.service")
        const dataHistorial = await getHistorialDeAsignacion(asignacionSeleccionada)
        setHistorial(dataHistorial)
      } catch (error) {
        console.error("Error cargando el historial:", error)
      } finally {
        setLoadingHistorial(false)
      }
    }

    fetchHistorial()
  }, [asignacionSeleccionada])

  const manejarCrearAsignacion = async (nuevaAsignacion: any) => {
    if (!usuario?.id) return

    if (!nuevaAsignacion.asignados || nuevaAsignacion.asignados.length === 0) {
      console.error("Debes asignar al menos un usuario")
      alert("Debes asignar al menos un usuario a la asignación")
      return
    }

    try {
      const datosParaAPI = {
        Titulo_Asignacion: nuevaAsignacion.titulo,
        Descripción_Asignacion: nuevaAsignacion.descripcion,
        Prioridad: nuevaAsignacion.prioridad,
        Fecha_Entrega: nuevaAsignacion.fecha_termino,
        ID_Proyecto: nuevaAsignacion.id_proyecto || null,
        Creado_Por: usuario.id,
        usuarios: nuevaAsignacion.asignados,
        archivos: [],
      }
      await createAsignacion(datosParaAPI)
      fetchDatos()
    } catch (error) {
      console.error("Error al crear la asignación:", error)
      alert("Error al crear la asignación: " + (error instanceof Error ? error.message : "Error desconocido"))
    }
  }

  const asignacionActual = asignaciones.find((a) => a.id === asignacionSeleccionada)

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando asignaciones...</p>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="loading-container">
        <p>Debes iniciar sesión para ver tus asignaciones</p>
      </div>
    )
  }

  const usuariosParaFormulario = usuariosDeApi.map((user) => ({
    id: user.ID_Usuario,
    nombre: user.Nombre_Usuario,
    color: user.Color,
  }))

  return (
    <div className="asignados-container">
      <div className="asignados-content">
        <AsignacionesRecibidas
          asignaciones={asignaciones}
          asignacionSeleccionada={asignacionSeleccionada}
          onSeleccionarAsignacion={setAsignacionSeleccionada}
        />
        <div className="asignados-main-derecha">
          <div className="asignacion-detalle-container">
            {asignacionActual ? (
              <AsignacionDetalle
                asignacion={asignacionActual}
                estilo="grid"
                historial={historial}
                loadingHistorial={loadingHistorial}
                onAsignacionActualizada={handleAsignacionActualizada}
                isCreador={true}
              />
            ) : (
              <div className="sin-seleccion">
                <p>No hay asignaciones para mostrar.</p>
              </div>
            )}
            <CrearAsignacion onCrearAsignacion={manejarCrearAsignacion} usuarios={usuariosParaFormulario} />
          </div>
        </div>
      </div>
    </div>
  )
}
