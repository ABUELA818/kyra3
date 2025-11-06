"use client"

export type Prioridad = "Baja" | "Media" | "Alta" | ""

interface MenuPrioridadProps {
  prioridadActual: Prioridad
  onSelect: (prioridad: Prioridad) => void
}

export default function MenuPrioridad({ prioridadActual, onSelect }: MenuPrioridadProps) {
  const priorities: Prioridad[] = ["Baja", "Media", "Alta"]

  return (
    <div className="menu menu-priority">
      {priorities.map((prio) => (
        <button
          key={prio}
          type="button"
          className={`priority-item ${prioridadActual === prio ? "active" : ""}`}
          onClick={() => onSelect(prio)}
        >
          <span className={`priority-dot priority-${prio.toLowerCase()}`}></span>
          {prio}
        </button>
      ))}
    </div>
  )
}
