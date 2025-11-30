import Texto from "@/components/atoms/Texto"
import "@/styles/Asignaciones_Recibidas.css"
import Tabla from "@/components/organisms/Tablas"

import type { AsignacionRecibidas } from "@/types/Asignaciones"

interface AsignacionesRecibidasProps {
  asignaciones: AsignacionRecibidas[]
}

export default function Asignaciones_Recibidas({ asignaciones }: AsignacionesRecibidasProps) {
  const columnas = ["Tarea", "Fecha de entrega", "Prioridad"]

  const formatearFecha = (fechaISO: string): string => {
    if (!fechaISO) return "N/A"
    const date = new Date(fechaISO)
    // Check if date is valid
    if (isNaN(date.getTime())) return "N/A"
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const datos = asignaciones.map((asig) => [asig.Titulo_Asignacion, formatearFecha(asig.Fecha_Entrega), asig.Prioridad])

  return (
    <div className="Asignaciones_Recibidas_Inicio">
      <div className="Asignaciones_Recibidas_Titulo">
        <Texto Texto="ASIGNACIONES RECIBIDAS" />
      </div>
      <div className="Asignaciones_Recibidas_Contenido">
        {asignaciones.length === 0 ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666", fontSize: "14px" }}>
            No hay nuevas asignaciones
          </div>
        ) : (
          <Tabla columnas={columnas} datos={datos} TletraDatos={14} TletraEncabezado={16} AlturaMaxima={45} />
        )}
      </div>
    </div>
  )
}
