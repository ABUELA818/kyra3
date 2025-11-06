"use client"

import type { Asignacion } from "@/types/Asignaciones"
import Icono_Perfil from "../atoms/Icono-Perfil"

interface AsignacionesRecibidasProps {
  asignaciones: Asignacion[]
  asignacionSeleccionada: string | null
  onSeleccionarAsignacion: (id: string) => void
}

export default function AsignacionesRecibidas({
  asignaciones,
  asignacionSeleccionada,
  onSeleccionarAsignacion,
}: AsignacionesRecibidasProps) {
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })
  }
 
  return (
    <div className="asignaciones-recibidas">
      <div className="asignaciones-recibidas-titulo">Asignaciones recibidas</div>
      <div className="asignaciones-lista">
        {asignaciones.map((asignacion) => (
          <div
            key={asignacion.id}
            className={`asignacion-item ${asignacionSeleccionada === asignacion.id ? "seleccionada" : ""}`}
            onClick={() => onSeleccionarAsignacion(asignacion.id)}
          >
            <div className="asignacion-autor">
              <Icono_Perfil Nombre={asignacion.autor.nombre} color="#678933"/>
              <span className="autor-nombre">{asignacion.autor.nombre}</span>
            </div>
            <div className="asignacion-contenido">
              <h3 className="asignacion-titulo">{asignacion.titulo}</h3>
              <span className="asignacion-fecha">{formatearFecha(asignacion.fecha_creacion)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
