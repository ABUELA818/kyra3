"use client"

import { useState, useEffect } from "react"
import "@/styles/admin-dashboard.css"

interface Team {
  ID_Equipo: number
  Nombre_Equipo: string
  Fecha_Creacion: string
  creador_equipo: {
    ID_Usuario: number
    Nombre_Usuario: string
  }
  numero_miembros: number
}

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    Nombre_Equipo: "",
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/equipos`)
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error("Error al cargar equipos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (team: Team) => {
    setEditingId(team.ID_Equipo)
    setEditForm({
      Nombre_Equipo: team.Nombre_Equipo,
    })
  }

  const handleSave = async (id: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/equipos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        await fetchTeams()
        setEditingId(null)
      } else {
        const error = await response.json()
        alert(error.message || "Error al actualizar equipo")
      }
    } catch (error) {
      console.error("Error al guardar equipo:", error)
      alert("Error al guardar los cambios")
    }
  }

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el equipo "${nombre}"?`)) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
      const response = await fetch(`${API_URL}/equipos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTeams()
      } else {
        const error = await response.json()
        alert(error.message || "Error al eliminar equipo")
      }
    } catch (error) {
      console.error("Error al eliminar equipo:", error)
      alert("Error al eliminar el equipo")
    }
  }

  if (loading) {
    return <div className="loading">Cargando equipos...</div>
  }

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Gestión de Equipos</h2>
        <p className="section-subtitle">Total de equipos: {teams.length}</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Equipo</th>
              <th>Creador</th>
              <th>Miembros</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.ID_Equipo}>
                <td>{team.ID_Equipo}</td>
                <td>
                  {editingId === team.ID_Equipo ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editForm.Nombre_Equipo}
                      onChange={(e) => setEditForm({ ...editForm, Nombre_Equipo: e.target.value })}
                    />
                  ) : (
                    team.Nombre_Equipo
                  )}
                </td>
                <td>{team.creador_equipo?.Nombre_Usuario || "N/A"}</td>
                <td>
                  <span className="badge badge-info">{team.numero_miembros}</span>
                </td>
                <td>{new Date(team.Fecha_Creacion).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {editingId === team.ID_Equipo ? (
                      <>
                        <button className="btn-save" onClick={() => handleSave(team.ID_Equipo)}>
                          Guardar
                        </button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-edit" onClick={() => handleEdit(team)}>
                          Editar
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(team.ID_Equipo, team.Nombre_Equipo)}>
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
