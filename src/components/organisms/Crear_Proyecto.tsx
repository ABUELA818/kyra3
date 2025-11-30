"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { NuevoProyectoForm } from "@/types/Proyectos"
import type { Usuario } from "@/types/Usuario"
import type { Equipo } from "@/types/Equipos"
import { getEquiposByUsuario } from "@/services/Equipos.service"
import { useUser } from "@/context/userContext"

interface CrearProyectoProps {
  usuarios: Usuario[]
  onClose: () => void
  onCrearProyecto: (proyecto: NuevoProyectoForm & { equipoId?: number; crearNuevoEquipo?: boolean }) => void
}

export default function Crear_Proyecto({ usuarios = [], onClose, onCrearProyecto }: CrearProyectoProps) {
  const { usuario } = useUser()
  const [formData, setFormData] = useState<NuevoProyectoForm>({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_termino: "",
    miembros: [],
  })

  const [busqueda, setBusqueda] = useState("")
  const [mostrarDropdown, setMostrarDropdown] = useState(false)

  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<number | null>(null)

  useEffect(() => {
    const cargarEquipos = async () => {
      if (usuario?.id) {
        const equiposUsuario = await getEquiposByUsuario(usuario.id)
        setEquipos(equiposUsuario)
      }
    }
    cargarEquipos()
  }, [usuario])

  const equiposFiltrados = equipos.filter(
    (equipo) =>
      equipo &&
      equipo.ID_Equipo &&
      equipo.Nombre_Equipo &&
      equipo.Nombre_Equipo.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario &&
      usuario.id &&
      usuario.nombre &&
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      !formData.miembros.includes(usuario.id),
  )

  // --- MANEJADORES ---
  const agregarUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: [...prev.miembros, usuarioId],
    }))
    setBusqueda("")
    setMostrarDropdown(false)
    if (equipoSeleccionado) {
      setEquipoSeleccionado(null)
    }
  }

  const removerUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: prev.miembros.filter((id) => id !== usuarioId),
    }))
  }

  const seleccionarEquipo = (equipoId: number) => {
    setEquipoSeleccionado(equipoId)
    setBusqueda("")
    setMostrarDropdown(false)
    setFormData((prev) => ({
      ...prev,
      miembros: [],
    }))
  }

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (equipoSeleccionado) {
      onCrearProyecto({
        ...formData,
        equipoId: equipoSeleccionado,
        crearNuevoEquipo: false,
      })
    } else {
      onCrearProyecto({
        ...formData,
        crearNuevoEquipo: true,
      })
    }
  }

  const handleBusquedaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setBusqueda(valor)
    setMostrarDropdown(true)
  }

  return (
    <div className="Crear_Proyecto_Contenedor" onClick={onClose}>
      <div className="Crear_Proyecto_Contenido" onClick={(e) => e.stopPropagation()}>
        <div className="Crear_Proyecto_Titulo">
          <h2>Crear Proyecto</h2>
        </div>

        <form className="Crear_Proyecto_Formulario" onSubmit={manejarSubmit}>
          <div className="Crear_Proyecto_Inputs">
            <input
              type="text"
              name="titulo"
              className="Crear_Proyecto_Input_Nombre"
              placeholder="Nombre del Proyecto"
              value={formData.titulo}
              onChange={manejarCambio}
              required
            />

            <div className="input-wrapper">
              <input
                type="text"
                className="Crear_Proyecto_Input_Usuarios"
                placeholder="Buscar Equipos o Usuarios"
                value={busqueda}
                onChange={handleBusquedaInput}
                onFocus={() => setMostrarDropdown(true)}
              />
              {mostrarDropdown && (equiposFiltrados.length > 0 || usuariosFiltrados.length > 0) && (
                <div className="usuarios-dropdown">
                  {equiposFiltrados.length > 0 && (
                    <>
                      <div className="dropdown-seccion-titulo">Equipos</div>
                      {equiposFiltrados.map((equipo) => (
                        <div
                          key={`equipo-${equipo.ID_Equipo}`}
                          className="usuario-opcion equipo-opcion"
                          onClick={() => seleccionarEquipo(equipo.ID_Equipo)}
                        >
                          <span className="equipo-icono">👥</span> {equipo.Nombre_Equipo}
                        </div>
                      ))}
                    </>
                  )}
                  {usuariosFiltrados.length > 0 && (
                    <>
                      <div className="dropdown-seccion-titulo">Usuarios</div>
                      {usuariosFiltrados.map((usuario) => (
                        <div
                          key={`usuario-${usuario.id}`}
                          className="usuario-opcion"
                          onClick={() => agregarUsuario(usuario.id)}
                        >
                          <span className="usuario-icono">👤</span> {usuario.nombre}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {equipoSeleccionado ? (
            <div className="equipo-seleccionado-container">
              <div className="equipo-seleccionado">
                <span>Equipo: {equipos.find((e) => e.ID_Equipo === equipoSeleccionado)?.Nombre_Equipo}</span>
                <button type="button" onClick={() => setEquipoSeleccionado(null)} className="remover-usuario">
                  ×
                </button>
              </div>
            </div>
          ) : (
            formData.miembros.length > 0 && (
              <div className="usuarios-seleccionados">
                {formData.miembros.map((usuarioId) => {
                  const usuario = usuarios.find((u) => u.id === usuarioId)
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
            )
          )}

          <div className="Crear_Proyecto_Fechas">
            <div className="Crear_Proyecto_FechaInicio">
              <label>Fecha de Inicio:</label>
              <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={manejarCambio} required />
            </div>
            <div className="Crear_Proyecto_FechaTermino">
              <label>Fecha de Término:</label>
              <input type="date" name="fecha_termino" value={formData.fecha_termino} onChange={manejarCambio} />
            </div>
          </div>

          <div className="Crear_Proyecto_Botones">
            <button type="button" onClick={onClose} className="boton-cancelarP">
              Cancelar
            </button>
            <button type="submit" className="boton-crearP">
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
