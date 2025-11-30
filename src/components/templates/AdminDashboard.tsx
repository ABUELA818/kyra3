"use client"

import { useUser } from "@/context/userContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminHeader from "../molecules/AdminHeader"
import AdminStats from "../molecules/AdminStats"
import RecentActivity from "../organisms/RecentActivity"
import RecentProjects from "../organisms/RecentProjects"
import TeamsOverview from "../organisms/TeamsOverview"
import RolesManagement from "../organisms/RolesManagement"
import UsersManagement from "../organisms/UsersManagement"
import TeamsManagement from "../organisms/TeamsManagement"
import ProjectsManagement from "../organisms/ProjectsManagement"
import AssignmentsManagement from "../organisms/AssignmentsManagement"
import "@/styles/admin-dashboard.css"

export default function AdminDashboard() {
  const { usuario } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("estadisticas")

  useEffect(() => {
    if (usuario && usuario.rol !== 1) {
      router.push("/Inicio")
    }
  }, [usuario, router])

  if (usuario?.rol !== 1) {
    return null
  }

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === "estadisticas" ? "active" : ""}`}
            onClick={() => setActiveTab("estadisticas")}
          >
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveTab("usuarios")}
          >
            Usuarios
          </button>
          <button
            className={`tab-button ${activeTab === "roles" ? "active" : ""}`}
            onClick={() => setActiveTab("roles")}
          >
            Roles
          </button>
          <button
            className={`tab-button ${activeTab === "equipos" ? "active" : ""}`}
            onClick={() => setActiveTab("equipos")}
          >
            Equipos
          </button>
          <button
            className={`tab-button ${activeTab === "proyectos" ? "active" : ""}`}
            onClick={() => setActiveTab("proyectos")}
          >
            Proyectos
          </button>
          <button
            className={`tab-button ${activeTab === "asignaciones" ? "active" : ""}`}
            onClick={() => setActiveTab("asignaciones")}
          >
            Asignaciones
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "estadisticas" && (
            <>
              <AdminStats />
              <div className="dashboard-grid">
                <RecentActivity />
                <div className="dashboard-right-col">
                  <RecentProjects />
                  <TeamsOverview />
                </div>
              </div>
            </>
          )}
          {activeTab === "usuarios" && <UsersManagement />}
          {activeTab === "roles" && <RolesManagement />}
          {activeTab === "equipos" && <TeamsManagement />}
          {activeTab === "proyectos" && <ProjectsManagement />}
          {activeTab === "asignaciones" && <AssignmentsManagement />}
        </div>
      </div>
    </div>
  )
}
