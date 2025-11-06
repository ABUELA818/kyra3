"use client"

import { useState, useRef, useEffect } from "react"

// --- CAMBIO 1: Añadimos la prop onDeleteClick ---
interface BotonAccionProps {
  onRoleChange?: (role: "Miembro" | "Admin") => void;
  onDeleteClick?: () => void;
}

export default function Boton_Accion({ onRoleChange, onDeleteClick }: BotonAccionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- CAMBIO 2: Corregimos los valores que se envían ---
  const handleRoleSelect = (role: "Miembro" | "Admin") => {
    onRoleChange?.(role);
    setIsMenuOpen(false);
  };
  
  const handleDelete = () => {
    onDeleteClick?.();
    setIsMenuOpen(false);
  };

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button className="Boton_Accion" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ...
      </button>

      {isMenuOpen && (
        <div className="Menu_Rol">
          <button className="Menu_Rol_Item" onClick={() => handleRoleSelect("Miembro")}>
            Miembro
          </button>
          <button className="Menu_Rol_Item" onClick={() => handleRoleSelect("Admin")}>
            Administrador
          </button>
          {/* --- CAMBIO 3: Añadimos un separador y el botón de eliminar --- */}
          <div className="menu-separador"></div>
          <button className="Menu_Rol_Item menu-item-peligro" onClick={handleDelete}>
            Eliminar del equipo
          </button>
        </div>
      )}
    </div>
  )
}