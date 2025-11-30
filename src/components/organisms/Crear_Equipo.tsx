"use client"
import { useState, useEffect } from "react"
import type React from "react"

import type { NuevoEquipo } from "@/types/Equipos"
import { getAllUsers } from "@/services/Usuarios.service"
import type { Usuario } from "@/types/Usuario"
import { useUser } from "@/context/userContext"

interface CrearEquipoModalProps {
  onClose: () => void
  onCrearEquipos: (equipo: NuevoEquipo) => void
}

export default function CrearEquipoModal({ onClose, onCrearEquipos }: CrearEquipoModalProps) {
  const { usuario } = useUser()
  const ID_Actual = usuario?.id || 1

  const [formData, setFormData] = useState<NuevoEquipo>({
    titulo: "",
    miembros: [],
    ID_Creador: ID_Actual,
  })

  const [usuariosDeApi, setUsuariosDeApi] = useState<Usuario[]>([])
  const [usuariosBusqueda, setUsuariosBusqueda] = useState("")
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([])

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const dataUsuarios = await getAllUsers()
        setUsuariosDeApi(dataUsuarios)
      } catch (error) {
        console.error("Error cargando usuarios:", error)
      }
    }
    fetchDatos()
  }, [])

  const usuariosParaFormulario = usuariosDeApi.map((user) => ({
    id: user.ID_Usuario,
    nombre: user.Nombre_Usuario,
  }))

  useEffect(() => {
    const filteredUsers = usuariosParaFormulario.filter(
      (usuario) =>
        usuario.id !== ID_Actual &&
        usuario.nombre &&
        usuario.nombre.toLowerCase().includes(usuariosBusqueda.toLowerCase()) &&
        !formData.miembros.includes(usuario.id),
    )
    setUsuariosFiltrados(filteredUsers)
  }, [usuariosDeApi, usuariosBusqueda, formData.miembros])

  const agregarUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: [...prev.miembros, usuarioId],
    }))
    setUsuariosBusqueda("")
    setMostrarDropdown(false)
  }

  const removerUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: prev.miembros.filter((id) => id !== usuarioId),
    }))
  }

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.titulo && formData.miembros.length > 0) {
      onCrearEquipos(formData)
      onClose()
    } else {
      alert("El equipo debe tener un nombre y al menos un miembro.")
    }
  }

  return (
    <div className="Crear_Equipos_Contenedor" onClick={onClose}>
      <div className="Crear_Equipos_Formulario" onClick={(e) => e.stopPropagation()}>
        <div className="Crear_Equipos_Titulo">
          <h3>Crear Nuevo Equipo</h3>
          <button className="Crear_Equipos_Cerrar" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="Crear_Equipos_Contenido">
          <form onSubmit={manejarEnvio}>
            <div className="Formulario_Contenedor_Equipo">
              <input
                type="text"
                placeholder="Ingresa el nombre del equipo"
                value={formData.titulo}
                onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                required
                className="form-input"
              />

              <div className="buscar-usuarios-container">
                <input
                  type="text"
                  placeholder="Buscar usuarios para añadir al equipo"
                  value={usuariosBusqueda}
                  onChange={(e) => {
                    const valor = e.target.value
                    setUsuariosBusqueda(valor)
                    setMostrarDropdown(valor.length > 0)
                  }}
                  onFocus={() => {
                    if (usuariosBusqueda.length > 0) {
                      setMostrarDropdown(true)
                    }
                  }}
                  className="form-input"
                />

                {mostrarDropdown && usuariosFiltrados.length > 0 && (
                  <div className="usuarios-dropdown">
                    {usuariosFiltrados.map((usuario) => (
                      <div key={usuario.id} className="usuario-opcion" onClick={() => agregarUsuario(usuario.id)}>
                        {usuario.nombre}
                      </div>
                    ))}
                  </div>
                )}

                {mostrarDropdown && usuariosFiltrados.length === 0 && usuariosBusqueda.length > 0 && (
                  <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>No hay usuarios que coincidan</div>
                )}
              </div>
            </div>

            {formData.miembros.length > 0 && (
              <div className="usuarios-seleccionados">
                {formData.miembros.map((usuarioId) => {
                  const usuario = usuariosParaFormulario.find((u) => u.id === usuarioId)
                  return usuario ? (
                    <div key={usuarioId} className="usuario-seleccionado">
                      <span>{usuario.nombre}</span>
                      <button type="button" onClick={() => removerUsuario(usuarioId)} className="remover-usuario">
                        ×
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            )}

            <div className="Crear_Equipos_Acciones">
              <button type="button" className="Crear_Equipos_Cancelar" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="Crear_Equipos_Crear">
                Crear Equipo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
