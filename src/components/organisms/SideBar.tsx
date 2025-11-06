"use client"

import Imagenes from "../atoms/Imagenes"
import TextLink from "../atoms/text-links"
import EquiposDropdown from "../molecules/Equipos_Lista"
import { useInbox } from "@/context/inbox-context"
import { useUser } from "@/context/userContext"
import { useState, useEffect } from "react"
import "@/styles/sidebar.css"

export default function SideBar() {
  const { toggleInbox } = useInbox()
  const { logout, usuario } = useUser()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = savedTheme === "dark"
    setIsDark(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add("dark-theme")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark-theme")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark-theme")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <aside className="SideBar">
      <div className="sidebar-content">
        <Imagenes src="/assets/veintidos.png" alt="Logo" width={160} height={30} />
        <TextLink href="/Inicio" Texto="Inicio" color="#FCFCF7" TamañoLetra={15} />

        <button
          onClick={toggleInbox}
          className="inbox-button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textAlign: "left",
          }}
        >
          <span style={{ color: "#FCFCF7", fontSize: "15px" }}>Inbox</span>
        </button>

        <TextLink href="/Asignaciones" Texto="Asignaciones" color="#FCFCF7" TamañoLetra={15} />
        <TextLink href="/Asignados" Texto="Asignados" color="#FCFCF7" TamañoLetra={15} />
        <TextLink href="/Chats" Texto="Chats" color="#FCFCF7" TamañoLetra={15} />
        <EquiposDropdown color="#FCFCF7" TamañoLetra={15} />
        <TextLink href="/Proyectos" Texto="Proyectos" color="#FCFCF7" TamañoLetra={15} />
        <button onClick={toggleTheme} />

        <div
          style={{
            borderTop: "1px solid rgba(252, 252, 247, 0.2)",
            marginTop: "auto",
            paddingTop: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              color: "#FCFCF7",
              fontSize: "12px",
              marginBottom: "12px",
              opacity: 0.7,
            }}
          >
            {usuario?.email}
          </div>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "rgba(239, 68, 68, 0.2)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  )
}
