"use client"

import { useEffect, useState } from "react"

interface Project {
  ID_Proyecto: number
  Nombre_Proyecto: string
  Estado_Proyecto: string
  Fecha_Inicio: string
  creador_nombre: string
  creador_color: string
  Nombre_Equipo: string
  total_asignaciones: number
  progreso: number
}

export default function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

        const response = await fetch(`${API_URL}/admin/projects/recent?limit=5`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Error fetching recent projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="recent-projects">
        <h2>Proyectos Recientes</h2>
        <div className="loading-content">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="recent-projects">
      <h2>Proyectos Recientes</h2>
      <div className="projects-list">
        {projects.length === 0 ? (
          <div className="empty-state">No hay proyectos recientes</div>
        ) : (
          projects.map((project) => (
            <div key={project.ID_Proyecto} className="project-card-mini">
              <div className="project-header-mini">
                <h3>{project.Nombre_Proyecto}</h3>
                <span className="project-status">{project.Estado_Proyecto}</span>
              </div>
              <div className="project-meta-mini">
                <span className="project-team">{project.Nombre_Equipo}</span>
                <span className="project-tasks">{project.total_asignaciones} tareas</span>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${project.progreso}%` }}></div>
                </div>
                <span className="progress-text">{project.progreso}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
