import React from "react";

export type Priority = "baja" | "media" | "alta";

interface BarraPrioridadProps {
  Prioridad?: Priority | string;
  prioridad?: Priority | string;
  compact?: boolean;
  ancho: string;
  alto: string;
}

export default function BarraPrioridad({
  Prioridad,
  prioridad,
  compact = false,
  ancho,  
  alto
}: BarraPrioridadProps): JSX.Element {
  const raw = (Prioridad ?? prioridad ?? "media").toString();
  const p = raw.toLowerCase() as Priority;

  const colores: Record<Priority, string> = {
    baja: "#34D399",
    media: "#f59e0b",
    alta: "#ef4444",
  };

  const color = colores[p] ?? colores.media;
  const label = p.charAt(0).toUpperCase() + p.slice(1);

  return (
    <div
      className={`barra-prioridad ${compact ? "compact" : ""}`}
      title={`Prioridad: ${label}`}
      aria-label={`Prioridad ${label}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, zIndex:"3" }}
    >
      <span
        style={{
          display: "inline-block",
          width: ancho,
          height: alto,
          borderRadius: "50px",
          backgroundColor: color,
          zIndex: "3"
        }}
      />
    </div>
  );
}
