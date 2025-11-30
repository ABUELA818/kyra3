"use client"

export default function AdminHeader() {
  return (
    <div className="admin-header">
      <div className="admin-header-content">
        <h1>Panel de Administración</h1>
        <p>Gestión centralizada del sistema y usuarios</p>
      </div>
      <div className="admin-header-badge">
        <span className="badge-admin">Administrador General</span>
      </div>
    </div>
  )
}
