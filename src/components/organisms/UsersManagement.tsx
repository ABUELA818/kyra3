"use client"

import { useEffect, useState } from "react"

interface User {
  ID_Usuario: number
  Nombre_Usuario: string
  Correo: string
  ID_Rol: number
  Color: string
  Fecha_Creacion: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<User> & { Contraseña?: string }>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

        const response = await fetch(`${API_URL}/usuarios`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json-admin",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.Nombre_Usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Correo?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleName = (rolId: number) => {
    const roles: Record<number, string> = {
      1: "Admin",
      2: "Usuario",
      3: "Invitado",
    }
    return roles[rolId] || "Sin Rol"
  }

  const handleShowDetails = (user: User) => {
    setSelectedUser(user)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditedUser({
      Nombre_Usuario: user.Nombre_Usuario,
      Correo: user.Correo,
      ID_Rol: user.ID_Rol,
      Color: user.Color,
      Contraseña: "",
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!selectedUser) return

    setSaving(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

      const response = await fetch(`${API_URL}/usuarios/${selectedUser.ID_Usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(editedUser),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map((u) => (u.ID_Usuario === updatedUser.ID_Usuario ? updatedUser : u)))
        setSelectedUser(null)
        setIsEditing(false)
        alert("Usuario actualizado exitosamente")
      } else {
        alert("Error al actualizar usuario")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error al actualizar usuario")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setSelectedUser(null)
    setIsEditing(false)
    setEditedUser({})
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <span>Cargando usuarios...</span>
      </div>
    )
  }

  return (
    <div className="users-management">
      <div className="management-header">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p className="header-subtitle">{filteredUsers.length} usuarios en total</p>
        </div>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.ID_Usuario}>
                <td>
                  <div className="user-row">
                    <div className="user-avatar" style={{ backgroundColor: user.Color || "#6366f1" }}>
                      {user.Nombre_Usuario?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span>{user.Nombre_Usuario}</span>
                  </div>
                </td>
                <td>{user.Correo}</td>
                <td>
                  <span className="role-badge">{getRoleName(user.ID_Rol)}</span>
                </td>
                <td>{user.Fecha_Creacion ? new Date(user.Fecha_Creacion).toLocaleDateString() : "-"}</td>
                <td>
                  <button className="action-btn" onClick={() => handleEdit(user)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? "Editar Usuario" : "Detalles del Usuario"}</h3>
              <button className="close-btn" onClick={handleCancel}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div
                className="user-detail-avatar"
                style={{ backgroundColor: editedUser.Color || selectedUser.Color || "#6366f1" }}
              >
                {(editedUser.Nombre_Usuario || selectedUser.Nombre_Usuario)?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="edit-form">
                <div className="form-group">
                  <label className="detail-label">Nombre de Usuario:</label>
                  <input
                    type="text"
                    value={editedUser.Nombre_Usuario || ""}
                    onChange={(e) => setEditedUser({ ...editedUser, Nombre_Usuario: e.target.value })}
                    className="edit-input"
                    placeholder="Nombre de usuario"
                  />
                </div>

                <div className="form-group">
                  <label className="detail-label">Correo Electrónico:</label>
                  <input
                    type="email"
                    value={editedUser.Correo || ""}
                    onChange={(e) => setEditedUser({ ...editedUser, Correo: e.target.value })}
                    className="edit-input"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label className="detail-label">Rol:</label>
                  <select
                    value={editedUser.ID_Rol || 2}
                    onChange={(e) => setEditedUser({ ...editedUser, ID_Rol: Number.parseInt(e.target.value) })}
                    className="edit-input"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Usuario</option>
                    <option value={3}>Invitado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="detail-label">Contraseña:</label>
                  <input
                    type="password"
                    value={editedUser.Contraseña || ""}
                    onChange={(e) => setEditedUser({ ...editedUser, Contraseña: e.target.value })}
                    className="edit-input"
                    placeholder="Dejar vacío para no cambiar"
                  />
                  <small className="input-hint">Dejar vacío si no deseas cambiar la contraseña</small>
                </div>

                <div className="form-group">
                  <label className="detail-label">Color de Avatar:</label>
                  <input
                    type="color"
                    value={editedUser.Color || selectedUser.Color || "#6366f1"}
                    onChange={(e) => setEditedUser({ ...editedUser, Color: e.target.value })}
                    className="edit-input color-input"
                  />
                </div>

                <div className="detail-row">
                  <span className="detail-label">ID Usuario:</span>
                  <span className="detail-value">{selectedUser.ID_Usuario}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Fecha de Creación:</span>
                  <span className="detail-value">
                    {selectedUser.Fecha_Creacion
                      ? new Date(selectedUser.Fecha_Creacion).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={handleCancel} disabled={saving}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
