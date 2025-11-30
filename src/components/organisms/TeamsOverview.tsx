"use client"

import { useEffect, useState } from "react"

interface Team {
  ID_Equipo: number
  Nombre_Equipo: string
  Fecha_Creacion: string
  creador_nombre: string
  total_miembros: number
  total_proyectos: number
}

export default function TeamsOverview() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

        const response = await fetch(`${API_URL}/admin/teams/overview`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setTeams(data)
        }
      } catch (error) {
        console.error("Error fetching teams overview:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (loading) {
    return (
      <div className="teams-overview">
        <h2>Equipos</h2>
        <div className="loading-content">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="teams-overview">
      <h2>Equipos</h2>
      <div className="teams-grid">
        {teams.length === 0 ? (
          <div className="empty-state">No hay equipos creados</div>
        ) : (
          teams.map((team) => (
            <div key={team.ID_Equipo} className="team-card-mini">
              <div className="team-name">{team.Nombre_Equipo}</div>
              <div className="team-stats">
                <div className="team-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{team.total_miembros}</span>
                </div>
                <div className="team-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{team.total_proyectos}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
