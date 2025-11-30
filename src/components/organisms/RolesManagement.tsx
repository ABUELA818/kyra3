"use client"

import { useEffect, useState } from "react"

interface Role {
  ID_Rol: number
  Rol: string
  Nivel: number
}

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRole, setEditingRole] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ Rol: "", Nivel: 0 })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

      const response = await fetch(`${API_URL}/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleDescription = (roleName: string, nivel: number) => {
    const descriptions: Record<string, string> = {
      Admin: "Control total del sistema, gestión de usuarios y configuración",
      Usuario: "Acceso estándar a proyectos y asignaciones",
      Invitado: "Acceso limitado solo a visualización",
    }
    return descriptions[roleName] || `Rol de nivel ${nivel} en el sistema`
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role.ID_Rol)
    setEditForm({ Rol: role.Rol, Nivel: role.Nivel })
  }

  const handleSave = async (roleId: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

      const response = await fetch(`${API_URL}/roles/${roleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setEditingRole(null)
        fetchRoles()
      }
    } catch (error) {
      console.error("Error updating role:", error)
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <span>Cargando roles...</span>
      </div>
    )
  }

  return (
    <div className="roles-management">
      <div className="management-header">
        <div>
          <h2>Gestión de Roles del Sistema</h2>
          <p className="header-subtitle">Configuración de permisos y niveles de acceso</p>
        </div>
      </div>

      <div className="roles-grid">
        {roles.map((role) => (
          <div key={role.ID_Rol} className="role-card">
            {editingRole === role.ID_Rol ? (
              <>
                <div className="role-header">
                  <input
                    type="text"
                    value={editForm.Rol}
                    onChange={(e) => setEditForm({ ...editForm, Rol: e.target.value })}
                    className="role-edit-input"
                  />
                  <input
                    type="number"
                    value={editForm.Nivel}
                    onChange={(e) => setEditForm({ ...editForm, Nivel: Number.parseInt(e.target.value) })}
                    className="level-edit-input"
                    min="0"
                  />
                </div>
                <p className="role-description">{getRoleDescription(editForm.Rol, editForm.Nivel)}</p>
                <div className="role-footer role-footer-edit">
                  <button className="btn-edit" onClick={() => handleSave(role.ID_Rol)}>
                    Guardar
                  </button>
                  <button className="btn-cancel" onClick={() => setEditingRole(null)}>
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="role-header">
                  <h3>{role.Rol}</h3>
                  <span className="level-badge">Nivel {role.Nivel}</span>
                </div>
                <p className="role-description">{getRoleDescription(role.Rol, role.Nivel)}</p>
                <div className="role-footer">
                  <button className="btn-edit" onClick={() => handleEdit(role)}>
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
