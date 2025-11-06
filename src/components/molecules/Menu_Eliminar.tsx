"use client"

interface MenuEliminarProps {
  onClose: () => void
  onConfirm: () => void
}

export default function MenuEliminar({ onClose, onConfirm }: MenuEliminarProps) {
  return (
    <div className="menu menu-delete">
      <p>¿Deseas eliminar las tareas seleccionadas?</p>
      <div className="delete-buttons">
        <button type="button" className="delete-no" onClick={onClose}>
          No
        </button>
        <button type="button" className="delete-yes" onClick={onConfirm}>
          Sí
        </button>
      </div>
    </div>
  )
}
