import Texto from "@/components/atoms/Texto"
import "@/styles/Asignaciones_Recibidas.css"
import Tabla from "@/components/organisms/Tablas"

import type { AsignacionRecibidas } from "@/types/Asignaciones"

interface AsignacionesRecibidasProps {
  asignaciones: AsignacionRecibidas[]
}

export default function Asignaciones_Recibidas({ asignaciones }: AsignacionesRecibidasProps) {
  const columnas = ["Tarea", "Fecha de entrega", "Prioridad"]

  const datos = asignaciones.map((asig) => [
    asig.Titulo_Asignacion,
    new Date(asig.Fecha_Entrega).toLocaleDateString(),
    asig.Prioridad,
  ])

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
          <Tabla columnas={columnas} datos={datos} TletraDatos={14} TletraEncabezado={16} AlturaMaxima={38} />
        )}
      </div>
    </div>
  )
}
