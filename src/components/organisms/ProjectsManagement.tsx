"use client"

import { useState, useEffect } from "react"
import "@/styles/admin-dashboard.css"

interface Project {
  ID_Proyecto: number
  Nombre_Proyecto: string
  Descripción_Proyecto: string
  Estado_Proyecto: string
  Fecha_Inicio: string
  Fecha_Termino: string | null
  creador_proyecto: {
    ID_Usuario: number
    Nombre_Usuario: string
  }
  equipo: {
    ID_Equipo: number
    Nombre_Equipo: string
  }
  numero_asignaciones: number
  avance: number
}

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    Nombre_Proyecto: "",
    Descripción_Proyecto: "",
    Estado_Proyecto: "Pendiente",
    Fecha_Inicio: "",
    Fecha_Termino: "",
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/proyectos`)
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error al cargar proyectos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.ID_Proyecto)
    setEditForm({
      Nombre_Proyecto: project.Nombre_Proyecto,
      Descripción_Proyecto: project.Descripción_Proyecto || "",
      Estado_Proyecto: project.Estado_Proyecto,
      Fecha_Inicio: project.Fecha_Inicio,
      Fecha_Termino: project.Fecha_Termino || "",
    })
  }

  const handleSave = async (id: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/proyectos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        await fetchProjects()
        setEditingId(null)
      } else {
        const error = await response.json()
        alert(error.message || "Error al actualizar proyecto")
      }
    } catch (error) {
      console.error("Error al guardar proyecto:", error)
      alert("Error al guardar los cambios")
    }
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el proyecto "${nombre}"?`)) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/proyectos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchProjects()
      } else {
        const error = await response.json()
        alert(error.message || "Error al eliminar proyecto")
      }
    } catch (error) {
      console.error("Error al eliminar proyecto:", error)
      alert("Error al eliminar el proyecto")
    }
  }

  const getStatusBadge = (estado: string) => {
    const statusMap: Record<string, string> = {
      Pendiente: "badge-warning",
      "En Progreso": "badge-info",
      Completado: "badge-success",
      Cancelado: "badge-danger",
    }
    return statusMap[estado] || "badge-secondary"
  }

  if (loading) {
    return <div className="loading">Cargando proyectos...</div>
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Gestión de Proyectos</h2>
        <p className="section-subtitle">Total de proyectos: {projects.length}</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Equipo</th>
              <th>Avance</th>
              <th>Fecha Inicio</th>
              <th>Fecha Término</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.ID_Proyecto}>
                <td>{project.ID_Proyecto}</td>
                <td>
                  {editingId === project.ID_Proyecto ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editForm.Nombre_Proyecto}
                      onChange={(e) => setEditForm({ ...editForm, Nombre_Proyecto: e.target.value })}
                    />
                  ) : (
                    project.Nombre_Proyecto
                  )}
                </td>
                <td>
                  {editingId === project.ID_Proyecto ? (
                    <textarea
                      className="edit-textarea"
                      value={editForm.Descripción_Proyecto}
                      onChange={(e) => setEditForm({ ...editForm, Descripción_Proyecto: e.target.value })}
                    />
                  ) : (
                    <div className="text-truncate">{project.Descripción_Proyecto || "N/A"}</div>
                  )}
                </td>
                <td>
                  {editingId === project.ID_Proyecto ? (
                    <select
                      className="edit-select"
                      value={editForm.Estado_Proyecto}
                      onChange={(e) => setEditForm({ ...editForm, Estado_Proyecto: e.target.value })}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  ) : (
                    <span className={`badge ${getStatusBadge(project.Estado_Proyecto)}`}>
                      {project.Estado_Proyecto}
                    </span>
                  )}
                </td>
                <td>{project.equipo?.Nombre_Equipo || "N/A"}</td>
                <td>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${project.avance}%` }} />
                    <span className="progress-text">{project.avance}%</span>
                  </div>
                </td>
                <td>
                  {editingId === project.ID_Proyecto ? (
                    <input
                      type="date"
                      className="edit-input"
                      value={editForm.Fecha_Inicio}
                      onChange={(e) => setEditForm({ ...editForm, Fecha_Inicio: e.target.value })}
                    />
                  ) : (
                    new Date(project.Fecha_Inicio).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editingId === project.ID_Proyecto ? (
                    <input
                      type="date"
                      className="edit-input"
                      value={editForm.Fecha_Termino}
                      onChange={(e) => setEditForm({ ...editForm, Fecha_Termino: e.target.value })}
                    />
                  ) : project.Fecha_Termino ? (
                    new Date(project.Fecha_Termino).toLocaleDateString()
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingId === project.ID_Proyecto ? (
                      <>
                        <button className="btn-save" onClick={() => handleSave(project.ID_Proyecto)}>
                          Guardar
                        </button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(project)}>
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(project.ID_Proyecto, project.Nombre_Proyecto)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
