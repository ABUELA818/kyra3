"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { NuevaAsignacion } from "@/types/Asignaciones"

interface CrearAsignacionProps {
  onCrearAsignacion: (asignacion: NuevaAsignacion) => void
  usuarios: Array<{ id: string; nombre: string }>
}

export default function CrearAsignacion({ onCrearAsignacion, usuarios = [] }: CrearAsignacionProps) {
  const [formData, setFormData] = useState<NuevaAsignacion>(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const defaultDate = `${year}-${month}-${day}`

    return {
      titulo: "",
      descripcion: "",
      prioridad: "Media",
      fecha_inicio: defaultDate,
      fecha_termino: "",
      asignados: [],
      archivos: [],
    }
  })

  const [usuariosBusqueda, setUsuariosBusqueda] = useState("")
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false)
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([])

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarUsuarios(false)
      }
    }

    if (mostrarUsuarios) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mostrarUsuarios])

  const usuariosFiltrados = (usuarios || []).filter(
    (usuario) =>
      usuario &&
      usuario.id &&
      usuario.nombre &&
      usuario.nombre.toLowerCase().includes(usuariosBusqueda.toLowerCase()) &&
      !formData.asignados.includes(usuario.id),
  )

  const agregarUsuario = (usuarioId: string) => {
    setFormData((prev) => ({
      ...prev,
      asignados: [...prev.asignados, usuarioId],
    }))
    setUsuariosBusqueda("")
    setMostrarUsuarios(false)
  }

  const removerUsuario = (usuarioId: string) => {
    setFormData((prev) => ({
      ...prev,
      asignados: prev.asignados.filter((id) => id !== usuarioId),
    }))
  }

  const manejarArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || [])
    setArchivosSeleccionados(archivos)
    setFormData((prev) => ({
      ...prev,
      archivos,
    }))
  }

  const removerArchivo = (index: number) => {
    const nuevosArchivos = archivosSeleccionados.filter((_, i) => i !== index)
    setArchivosSeleccionados(nuevosArchivos)
    setFormData((prev) => ({
      ...prev,
      archivos: nuevosArchivos,
    }))
  }

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo || !formData.descripcion || !formData.fecha_inicio || !formData.fecha_termino) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    if (formData.asignados.length === 0) {
      alert("Debes asignar al menos un usuario")
      return
    }

    onCrearAsignacion(formData)
    setFormData({
      titulo: "",
      descripcion: "",
      prioridad: "Media",
      fecha_inicio: "",
      fecha_termino: "",
      asignados: [],
      archivos: [],
    })
    setArchivosSeleccionados([])
  }

  const handleCancelar = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const defaultDate = `${year}-${month}-${day}`

    setFormData({
      titulo: "",
      descripcion: "",
      prioridad: "Media",
      fecha_inicio: defaultDate,
      fecha_termino: "",
      asignados: [],
      archivos: [],
    })
    setArchivosSeleccionados([])
    setUsuariosBusqueda("")
    setMostrarUsuarios(false)
  }

  const handleUsuariosInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setUsuariosBusqueda(valor)
    setMostrarUsuarios(valor.length > 0 || usuarios.length > 0)
  }

  return (
    <div className="crear-asignacion">
      <h2 className="crear-asignacion-titulo">Crear nueva asignación</h2>
      <form onSubmit={manejarEnvio} className="crear-asignacion-form">
        <div className="form-grupo">
          <div className="Titulo_Usuarios">
            <input
              type="text"
              placeholder="Nombre de la asignación"
              value={formData.titulo}
              onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
              className="form-input titulo-input"
              required
              style={{ width: "49%" }}
            />

            <input
              type="text"
              placeholder="Buscar usuarios"
              value={usuariosBusqueda}
              onChange={handleUsuariosInput}
              onFocus={() => {
                setMostrarUsuarios(true)
              }}
              className="form-input"
              style={{ width: "49%" }}
            />
          </div>
        </div>
        <div className="form-grupo">
          <div className="buscar-usuarios-container" ref={dropdownRef}>
            {mostrarUsuarios && usuariosFiltrados.length > 0 && (
              <div className="usuarios-dropdown">
                {usuariosFiltrados.map((usuario) => (
                  <div
                    key={`usuario-${usuario.id}`}
                    className="usuario-opcion"
                    onClick={() => agregarUsuario(usuario.id)}
                  >
                    {usuario.nombre}
                  </div>
                ))}
              </div>
            )}
            {mostrarUsuarios && usuariosFiltrados.length === 0 && usuariosBusqueda.length > 0 && (
              <div className="usuarios-dropdown">
                <div className="usuario-opcion" style={{ color: "#999" }}>
                  No se encontraron usuarios
                </div>
              </div>
            )}
            {mostrarUsuarios &&
              usuariosFiltrados.length === 0 &&
              usuariosBusqueda.length === 0 &&
              usuarios.length > 0 && (
                <div className="usuarios-dropdown">
                  {usuarios
                    .filter((u) => u && u.id && u.nombre)
                    .map((usuario) => (
                      <div
                        key={`usuario-${usuario.id}`}
                        className="usuario-opcion"
                        onClick={() => agregarUsuario(usuario.id)}
                      >
                        {usuario.nombre}
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>

        {formData.asignados.length > 0 && (
          <div className="usuarios-seleccionados">
            {formData.asignados.map((usuarioId) => {
              const usuario = usuarios.find((u) => u.id === usuarioId)
              return usuario ? (
                <div key={`seleccionado-${usuarioId}`} className="usuario-seleccionado">
                  <span>{usuario.nombre}</span>
                  <button type="button" onClick={() => removerUsuario(usuarioId)} className="remover-usuario">
                    ×
                  </button>
                </div>
              ) : null
            })}
          </div>
        )}

        <div className="form-grupo">
          <textarea
            placeholder="Descripción de la asignación"
            value={formData.descripcion}
            onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
            className="form-textarea"
            rows={4}
            required
          />
        </div>

        <div className="form-grupo-inline">
          <div className="form-grupo">
            <label className="form-label">Prioridad</label>
            <select
              value={formData.prioridad}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, prioridad: e.target.value as "Alta" | "Media" | "Baja" }))
              }
              className="form-select"
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div className="form-grupo">
            <label className="form-label">Fecha de entrega</label>
            <input
              type="date"
              value={formData.fecha_termino}
              onChange={(e) => setFormData((prev) => ({ ...prev, fecha_termino: e.target.value }))}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-grupo">
          <label className="form-label">Adjuntar archivos</label>
          <input type="file" multiple onChange={manejarArchivos} className="form-file" id="archivos-input" />
          <label htmlFor="archivos-input" className="file-label">
            Seleccionar archivos
          </label>
        </div>

        {archivosSeleccionados.length > 0 && (
          <div className="archivos-seleccionados">
            {archivosSeleccionados.map((archivo, index) => (
              <div key={`archivo-${index}-${archivo.name}`} className="archivo-seleccionado">
                <span>{archivo.name}</span>
                <button type="button" onClick={() => removerArchivo(index)} className="remover-archivo">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-acciones">
          <button type="button" className="btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn-asignar">
            Asignar
          </button>
        </div>
      </form>
    </div>
  )
}
