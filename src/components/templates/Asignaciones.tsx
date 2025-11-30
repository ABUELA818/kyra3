"use client"
import { useEffect, useState } from "react"
import { useUser } from "@/context/userContext"
import { useSearchParams } from "next/navigation"
import AsignacionesApartados from "@/components/molecules/Asignaciones-Apartados"
import AsignacionDetalle from "@/components/organisms/Asignacion-Detalle"
import "@/styles/Asignaciones.css"

import { getAsignacionesByUsuario, getHistorialDeAsignacion } from "@/services/Asignaciones.service"
import type { ApiAsignacion, AsignacionUI, HistorialItem } from "@/types/Asignaciones"

function formatearFecha(fechaISO: string) {
  if (!fechaISO) return "Sin fecha"
  return new Date(fechaISO).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export default function Asignaciones() {
  const { usuario } = useUser()
  const searchParams = useSearchParams()

  const [seleccionada, setSeleccionada] = useState<AsignacionUI | null>(null)
  const [asignaciones, setAsignaciones] = useState<AsignacionUI[]>([])
  const [loading, setLoading] = useState(true)

  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loadingHistorial, setLoadingHistorial] = useState(false)

  const fetchAsignaciones = async () => {
    if (!usuario?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data: ApiAsignacion[] = await getAsignacionesByUsuario(usuario.id)

      const asignacionesFormateadas: AsignacionUI[] = data.map((item) => ({
        id: item.ID_Asignacion,
        titulo: item.Titulo_Asignacion,
        prioridad: (item.Prioridad || "baja").toLowerCase() as AsignacionUI["prioridad"],
        fecha_inicio: formatearFecha(item.Fecha_Creacion),
        fecha_termino: formatearFecha(item.Fecha_Entrega),
        estado: item.Estado_Asignacion,
        asignados: item.usuarios_asignados
          ? item.usuarios_asignados.map((user) => ({
              nombre: user.Nombre_Usuario,
              color: user.Color || "#ccc",
            }))
          : [],
        descripcion: item.Descripción_Asignacion,
        autor: { nombre: item.creado_por.Nombre_Usuario },
      }))

      setAsignaciones(asignacionesFormateadas)

      if (seleccionada) {
        const asignacionActualizada = asignacionesFormateadas.find((a) => a.id === seleccionada.id)
        if (asignacionActualizada) {
          setSeleccionada(asignacionActualizada)
        }
      }
    } catch (error) {
      console.error("Error cargando asignaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAsignaciones()
  }, [usuario?.id])

  useEffect(() => {
    const asignacionId = searchParams.get("id")
    if (asignacionId && asignaciones.length > 0) {
      const asignacion = asignaciones.find((a) => a.id === Number.parseInt(asignacionId))
      if (asignacion) {
        setSeleccionada(asignacion)
      }
    }
  }, [searchParams, asignaciones])

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!seleccionada) {
        setHistorial([])
        return
      }
      try {
        setLoadingHistorial(true)
        const dataHistorial = await getHistorialDeAsignacion(seleccionada.id)
        setHistorial(dataHistorial)
      } catch (error) {
        console.error("Error cargando el historial:", error)
      } finally {
        setLoadingHistorial(false)
      }
    }

    fetchHistorial()
  }, [seleccionada])

  const handleAsignacionActualizada = () => {
    fetchAsignaciones()
    // Trigger historial refresh by updating the state
    if (seleccionada) {
      const fetchHistorial = async () => {
        try {
          setLoadingHistorial(true)
          const dataHistorial = await getHistorialDeAsignacion(seleccionada.id)
          setHistorial(dataHistorial)
        } catch (error) {
          console.error("Error cargando el historial:", error)
        } finally {
          setLoadingHistorial(false)
        }
      }
      fetchHistorial()
    }
  }

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando asignaciones...</div>
  }

  if (!usuario) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Debes iniciar sesión para ver tus asignaciones</div>
  }

  return (
    <div className="Pantalla_Asignaciones_Contenedor">
      <div className="Asignaciones_estados">
        {["Asignaciones", "En proceso", "Enviados", "Correcciones", "Terminados"].map((estado) => {
          const asignacionesFiltradas = asignaciones.filter((a) => a.estado === estado)
          return (
            <AsignacionesApartados
              key={estado}
              Estado={estado as AsignacionUI["estado"]}
              NumAsig={asignacionesFiltradas.length}
              Asignacion={asignacionesFiltradas}
              onSelectAsignacion={setSeleccionada}
            />
          )
        })}
      </div>

      <div className="Asignaciones_detalle">
        {seleccionada ? (
          <AsignacionDetalle
            asignacion={seleccionada}
            historial={historial}
            loadingHistorial={loadingHistorial}
            estilo="flex"
            tamaño={59}
            tamaño2={38}
            onAsignacionActualizada={handleAsignacionActualizada}
            isCreador={false}
          />
        ) : (
          <div className="detalle-vacio">
            <p>Selecciona una asignación para ver el detalle</p>
          </div>
        )}
      </div>
    </div>
  )
}
