"use client"

import { useEffect, useState } from "react"

interface Activity {
  ID_Asignacion: number
  Titulo_Asignacion: string
  Estado_Asignacion: string
  Fecha_Creacion: string
  creador_nombre: string
  creador_color: string
  Nombre_Proyecto: string
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

        const response = await fetch(`${API_URL}/admin/statistics`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setActivities(data.recentActivity || [])
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Completado: "status-completed",
      "En Progreso": "status-progress",
      Pendiente: "status-pending",
      Asignaciones: "status-assigned",
      Enviados: "status-sent",
    }
    return statusMap[status] || "status-default"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Hace menos de 1 hora"
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`
    const days = Math.floor(hours / 24)
    return `Hace ${days} día${days > 1 ? "s" : ""}`
  }

  if (loading) {
    return (
      <div className="recent-activity">
        <h2>Actividad Reciente</h2>
        <div className="loading-content">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="recent-activity">
      <h2>Actividad Reciente</h2>
      <div className="activity-list">
        {activities.length === 0 ? (
          <div className="empty-state">No hay actividad reciente</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.ID_Asignacion} className="activity-item">
              <div className="activity-avatar" style={{ backgroundColor: activity.creador_color }}>
                {activity.creador_nombre?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-title">{activity.Titulo_Asignacion}</span>
                  <span className={`activity-status ${getStatusColor(activity.Estado_Asignacion)}`}>
                    {activity.Estado_Asignacion}
                  </span>
                </div>
                <div className="activity-meta">
                  <span className="activity-user">{activity.creador_nombre}</span>
                  {activity.Nombre_Proyecto && (
                    <>
                      <span className="activity-separator">•</span>
                      <span className="activity-project">{activity.Nombre_Proyecto}</span>
                    </>
                  )}
                </div>
                <div className="activity-time">{formatDate(activity.Fecha_Creacion)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
