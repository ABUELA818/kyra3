"use client"
import { useState, useEffect } from "react"
import CrearEquipoModal from "../organisms/Crear_Equipo"
import { getEquiposByUsuario, createEquipo } from "@/services/Equipos.service"
import type { Equipo, NuevoEquipo } from "@/types/Equipos"
import { useUser } from "@/context/userContext"

interface EquiposDropdownProps {
  color: string
  TamañoLetra: number
}

export default function EquiposDropdown({ color, TamañoLetra }: EquiposDropdownProps) {
  const { usuario } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!usuario?.id) {
        setLoading(false)
        return
      }

      setLoading(true)
      const data = await getEquiposByUsuario(usuario.id)
      setEquipos(data)
      setLoading(false)
    }
    fetchEquipos()
  }, [usuario?.id])

  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeCreateModal = () => setShowCreateModal(false)

  const manejarCrearEquipo = async (nuevoEquipo: NuevoEquipo) => {
    if (!usuario?.id) {
      alert("No se pudo obtener el usuario actual")
      return
    }

    try {
      const datosParaAPI = {
        Nombre_Equipo: nuevoEquipo.titulo,
        ID_Usuario_Creador: usuario.id,
        miembros: nuevoEquipo.miembros,
      }

      const equipoCreado = await createEquipo(datosParaAPI)

      setEquipos((prevEquipos) => [
        ...prevEquipos,
        { ID_Equipo: equipoCreado.ID_Equipo, Nombre_Equipo: datosParaAPI.Nombre_Equipo },
      ])

      alert("¡Equipo creado con éxito!")
    } catch (error) {
      console.error("Error al crear el equipo:", error)
      alert("Hubo un error al crear el equipo.")
    }
  }

  return (
    <div className="equipos-container">
      <button
        className="equipos-toggle"
        onClick={toggleDropdown}
        style={{ color: color, fontSize: `${TamañoLetra}px` }}
      >
        <span>Mis equipos</span>
        <span className={`equipos-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="equipos-list">
          <button
            className="crear-equipo-btn"
            onClick={() => setShowCreateModal(true)}
            style={{ fontSize: "14px", color: color }}
          >
            + Crear nuevo equipo
          </button>

          {loading ? (
            <p style={{ fontSize: "14px", color: color, padding: "8px 12px" }}>Cargando...</p>
          ) : (
            equipos.map((equipo) => (
              <a
                key={equipo.ID_Equipo}
                href={`/Equipos/${equipo.ID_Equipo}`}
                className="equipo-item"
                style={{ fontSize: "14px", color: color }}
              >
                {equipo.Nombre_Equipo}
              </a>
            ))
          )}
        </div>
      )}

      {showCreateModal && <CrearEquipoModal onClose={closeCreateModal} onCrearEquipos={manejarCrearEquipo} />}
    </div>
  )
}
