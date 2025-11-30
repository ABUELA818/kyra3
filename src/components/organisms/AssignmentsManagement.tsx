"use client"

import { useState, useEffect } from "react"
import "@/styles/admin-dashboard.css"

interface Assignment {
  ID_Asignacion: number
  Titulo_Asignacion: string
  Descripción_Asignacion: string
  Prioridad: string
  Estado_Asignacion: string
  Fecha_Creacion: string
  Fecha_Entrega: string | null
  proyecto: {
    ID_Proyecto: number
    Nombre_Proyecto: string
  } | null
  creado_por: {
    ID_Usuario: number
    Nombre_Usuario: string
  }
  usuarios_asignados: Array<{
    ID_Usuario: number
    Nombre_Usuario: string
    Color: string
  }>
}

export default function AssignmentsManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    Titulo_Asignacion: "",
    Descripción_Asignacion: "",
    Prioridad: "Media",
    Estado_Asignacion: "Asignaciones",
    Fecha_Entrega: "",
    ID_Proyecto: null as number | null,
  })

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/asignaciones`)
      const data = await response.json()
      setAssignments(data)
    } catch (error) {
      console.error("Error al cargar asignaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingId(assignment.ID_Asignacion)
    setEditForm({
      Titulo_Asignacion: assignment.Titulo_Asignacion,
      Descripción_Asignacion: assignment.Descripción_Asignacion || "",
      Prioridad: assignment.Prioridad,
      Estado_Asignacion: assignment.Estado_Asignacion,
      Fecha_Entrega: assignment.Fecha_Entrega || "",
      ID_Proyecto: assignment.proyecto?.ID_Proyecto || null,
    })
  }

  const handleSave = async (id: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/asignaciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        await fetchAssignments()
        setEditingId(null)
      } else {
        const error = await response.json()
        alert(error.message || "Error al actualizar asignación")
      }
    } catch (error) {
      console.error("Error al guardar asignación:", error)
      alert("Error al guardar los cambios")
    }
  }

  const handleDelete = async (id: number, titulo: string) => {
    if (!confirm(`¿Estás seguro de eliminar la asignación "${titulo}"?`)) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/asignaciones/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ID_Usuario_solicitante: 1 }), // Admin ID
      })

      if (response.ok) {
        await fetchAssignments()
      } else {
        const error = await response.json()
        alert(error.message || "Error al eliminar asignación")
      }
    } catch (error) {
      console.error("Error al eliminar asignación:", error)
      alert("Error al eliminar la asignación")
    }
  }

  const getPriorityBadge = (prioridad: string) => {
    const priorityMap: Record<string, string> = {
      Alta: "badge-danger",
      Media: "badge-warning",
      Baja: "badge-info",
    }
    return priorityMap[prioridad] || "badge-secondary"
  }

  const getStatusBadge = (estado: string) => {
    const statusMap: Record<string, string> = {
      Asignaciones: "badge-info",
      "En Progreso": "badge-warning",
      Enviados: "badge-primary",
      Completado: "badge-success",
    }
    return statusMap[estado] || "badge-secondary"
  }

  if (loading) {
    return <div className="loading">Cargando asignaciones...</div>
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Gestión de Asignaciones</h2>
        <p className="section-subtitle">Total de asignaciones: {assignments.length}</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Proyecto</th>
              <th>Asignados</th>
              <th>Fecha Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.ID_Asignacion}>
                <td>{assignment.ID_Asignacion}</td>
                <td>
                  {editingId === assignment.ID_Asignacion ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editForm.Titulo_Asignacion}
                      onChange={(e) => setEditForm({ ...editForm, Titulo_Asignacion: e.target.value })}
                    />
                  ) : (
                    assignment.Titulo_Asignacion
                  )}
                </td>
                <td>
                  {editingId === assignment.ID_Asignacion ? (
                    <textarea
                      className="edit-textarea"
                      value={editForm.Descripción_Asignacion}
                      onChange={(e) => setEditForm({ ...editForm, Descripción_Asignacion: e.target.value })}
                    />
                  ) : (
                    <div className="text-truncate">{assignment.Descripción_Asignacion || "N/A"}</div>
                  )}
                </td>
                <td>
                  {editingId === assignment.ID_Asignacion ? (
                    <select
                      className="edit-select"
                      value={editForm.Prioridad}
                      onChange={(e) => setEditForm({ ...editForm, Prioridad: e.target.value })}
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  ) : (
                    <span className={`badge ${getPriorityBadge(assignment.Prioridad)}`}>{assignment.Prioridad}</span>
                  )}
                </td>
                <td>
                  {editingId === assignment.ID_Asignacion ? (
                    <select
                      className="edit-select"
                      value={editForm.Estado_Asignacion}
                      onChange={(e) => setEditForm({ ...editForm, Estado_Asignacion: e.target.value })}
                    >
                      <option value="Asignaciones">Asignaciones</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Enviados">Enviados</option>
                      <option value="Completado">Completado</option>
                    </select>
                  ) : (
                    <span className={`badge ${getStatusBadge(assignment.Estado_Asignacion)}`}>
                      {assignment.Estado_Asignacion}
                    </span>
                  )}
                </td>
                <td>{assignment.proyecto?.Nombre_Proyecto || "N/A"}</td>
                <td>
                  <div className="user-avatars">
                    {assignment.usuarios_asignados?.map((user) => (
                      <div
                        key={user.ID_Usuario}
                        className="user-avatar-small"
                        style={{ backgroundColor: user.Color }}
                        title={user.Nombre_Usuario}
                      >
                        {user.Nombre_Usuario.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  {editingId === assignment.ID_Asignacion ? (
                    <input
                      type="date"
                      className="edit-input"
                      value={editForm.Fecha_Entrega}
                      onChange={(e) => setEditForm({ ...editForm, Fecha_Entrega: e.target.value })}
                    />
                  ) : assignment.Fecha_Entrega ? (
                    new Date(assignment.Fecha_Entrega).toLocaleDateString()
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingId === assignment.ID_Asignacion ? (
                      <>
                        <button className="btn-save" onClick={() => handleSave(assignment.ID_Asignacion)}>
                          Guardar
                        </button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(assignment)}>
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(assignment.ID_Asignacion, assignment.Titulo_Asignacion)}
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
