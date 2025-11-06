"use client"
import { useState } from "react"

interface UsuarioMenuItem {
  id: number
  nombre: string
}

interface MenuAsignadosProps {
  usuarios: UsuarioMenuItem[]
  seleccionado: string // CSV de IDs seleccionados
  onSelect: (usuarioId: string) => void
}

export default function MenuAsignados({ usuarios, seleccionado, onSelect }: MenuAsignadosProps) {
  const [busqueda, setBusqueda] = useState("")

  const seleccionadoSet = new Set(seleccionado.split(",").filter(Boolean))

  const filtrados = usuarios.filter((u) => u.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="menu menu-assigned">
      <input
        type="text"
        placeholder="Buscar usuario"
        className="search-input"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="user-list">
        {filtrados.map((user) => (
          <button
            key={user.id}
            type="button"
            className={`user-item ${seleccionadoSet.has(String(user.id)) ? "active" : ""}`}
            onClick={() => onSelect(String(user.id))}
          >
            <span className="user-initial">{user.nombre[0]?.toUpperCase()}</span>
            {user.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}
