"use client"

import { useEffect, useState } from "react"

interface StatsData {
  totalUsers: number
  totalTeams: number
  totalProjects: number
  totalAssignments: number
  usersByRole: Record<string, number>
  projectsByStatus: Array<{ status: string; count: number }>
  assignmentsByStatus: Array<{ status: string; count: number }>
}

export default function AdminStats() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalTeams: 0,
    totalProjects: 0,
    totalAssignments: 0,
    usersByRole: {},
    projectsByStatus: [],
    assignmentsByStatus: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
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
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loading-spinner"></div>
        <span>Cargando estadísticas...</span>
      </div>
    )
  }

  return (
    <div className="admin-stats">
      <div className="stats-grid">
        <div className="stat-card stat-users">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Usuarios Totales</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card stat-teams">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Equipos</h3>
            <p className="stat-value">{stats.totalTeams}</p>
          </div>
        </div>

        <div className="stat-card stat-projects">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Proyectos</h3>
            <p className="stat-value">{stats.totalProjects}</p>
          </div>
        </div>

        <div className="stat-card stat-assignments">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>Asignaciones</h3>
            <p className="stat-value">{stats.totalAssignments}</p>
          </div>
        </div>
      </div>

      <div className="secondary-stats">
        <div className="roles-breakdown">
          <h2>Distribución por Roles</h2>
          <div className="roles-grid">
            {Object.entries(stats.usersByRole).map(([role, count]) => (
              <div key={role} className="role-item">
                <span className="role-name">{role}</span>
                <span className="role-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="status-breakdown">
          <h2>Estado de Proyectos</h2>
          <div className="status-list">
            {stats.projectsByStatus.map((item) => (
              <div key={item.status} className="status-item">
                <span className="status-label">{item.status}</span>
                <span className="status-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="status-breakdown">
          <h2>Estado de Asignaciones</h2>
          <div className="status-list">
            {stats.assignmentsByStatus.map((item) => (
              <div key={item.status} className="status-item">
                <span className="status-label">{item.status}</span>
                <span className="status-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
