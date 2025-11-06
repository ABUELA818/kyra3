"use client"
import type React from "react"
import { useState } from "react"
import type { NuevaAsignacion } from "@/types/Asignaciones"

interface ModalCrearAsignacionProps {
  isOpen: boolean
  onClose: () => void
  onCrearAsignacion: (asignacion: NuevaAsignacion & { id_proyecto: string }) => void
  usuarios: Array<{ id: string | number; nombre: string }>
  projectId: string
}

export default function ModalCrearAsignacion({
  isOpen,
  onClose,
  onCrearAsignacion,
  usuarios,
  projectId,
}: ModalCrearAsignacionProps) {
  const [formData, setFormData] = useState<NuevaAsignacion>({
    titulo: "",
    descripcion: "",
    prioridad: "Media",
    fecha_inicio: "",
    fecha_termino: "",
    asignados: [],
    archivos: [],
  })

  const [usuariosBusqueda, setUsuariosBusqueda] = useState("")
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false)
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([])

  if (!isOpen) return null

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(usuariosBusqueda.toLowerCase()) &&
      !formData.asignados.includes(String(usuario.id)),
  )

  const agregarUsuario = (usuarioId: string | number) => {
    setFormData((prev) => ({
      ...prev,
      asignados: [...prev.asignados, String(usuarioId)],
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
    if (formData.titulo && formData.descripcion && formData.fecha_inicio && formData.fecha_termino) {
      onCrearAsignacion({
        ...formData,
        id_proyecto: projectId,
      })
      // Resetear formulario
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
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-titulo">Crear nueva asignación</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

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
                onChange={(e) => {
                  setUsuariosBusqueda(e.target.value)
                  setMostrarUsuarios(e.target.value.length > 0)
                }}
                className="form-input"
                style={{ width: "49%" }}
              />
            </div>
          </div>

          <div className="form-grupo">
            <div className="buscar-usuarios-container">
              {mostrarUsuarios && usuariosFiltrados.length > 0 && (
                <div className="usuarios-dropdown">
                  {usuariosFiltrados.map((usuario) => (
                    <div key={usuario.id} className="usuario-opcion" onClick={() => agregarUsuario(usuario.id)}>
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
                const usuario = usuarios.find((u) => String(u.id) === usuarioId)
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
              <label className="form-label">Fecha de inicio</label>
              <input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData((prev) => ({ ...prev, fecha_inicio: e.target.value }))}
                className="form-input"
                required
              />
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
                <div key={index} className="archivo-seleccionado">
                  <span>{archivo.name}</span>
                  <button type="button" onClick={() => removerArchivo(index)} className="remover-archivo">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-acciones">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-asignar">
              Asignar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
