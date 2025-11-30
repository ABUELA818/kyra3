"use client"

import { useState, useRef, useEffect } from "react"

interface BotonAccionProps {
  currentRole?: "Miembro" | "Admin"
  onRoleChange?: (role: "Miembro" | "Admin") => void
  onDeleteClick?: () => void
}

export default function Boton_Accion({ currentRole = "Miembro", onRoleChange, onDeleteClick }: BotonAccionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleRoleSelect = (role: "Miembro" | "Admin") => {
    onRoleChange?.(role)
    setIsMenuOpen(false)
  }

  const handleDelete = () => {
    onDeleteClick?.()
    setIsMenuOpen(false)
  }

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button className="Boton_Accion" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ...
      </button>

      {isMenuOpen && (
        <div className="Menu_Rol">
          <button
            className={`Menu_Rol_Item ${currentRole === "Miembro" ? "active" : ""}`}
            onClick={() => handleRoleSelect("Miembro")}
          >
            {currentRole === "Miembro" && "✓ "}Miembro
          </button>
          <button
            className={`Menu_Rol_Item ${currentRole === "Admin" ? "active" : ""}`}
            onClick={() => handleRoleSelect("Admin")}
          >
            {currentRole === "Admin" && "✓ "}Administrador
          </button>
          <div className="menu-separador"></div>
          <button className="Menu_Rol_Item menu-item-peligro" onClick={handleDelete}>
            Eliminar del equipo
          </button>
        </div>
      )}
    </div>
  )
}
