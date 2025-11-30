"use client"

import Imagenes from "../atoms/Imagenes"
import TextLink from "../atoms/text-links"
import EquiposDropdown from "../molecules/Equipos_Lista"
import { useInbox } from "@/context/inbox-context"
import { useUserMenu } from "@/context/user-menu-context"
import { useUser } from "@/context/userContext"
import { useState, useEffect } from "react"
import "@/styles/sidebar.css"

export default function SideBar() {
  const { isOpen: isInboxOpen, toggleInbox, closeInbox } = useInbox()
  const { isOpen: isUserMenuOpen, openUserMenu, closeUserMenu } = useUserMenu()
  const { usuario } = useUser()
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

  const handleUserMenuToggle = () => {
    if (isInboxOpen) {
      closeInbox()
    }
    openUserMenu()
  }

  const handleInboxToggle = () => {
    if (isUserMenuOpen) {
      closeUserMenu()
    }
    toggleInbox()
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="SideBar">
      <div className="sidebar-content">
        <Imagenes src="/assets/veintidos.png" alt="Logo" width={140} height={25} />
        <TextLink href="/Inicio" Texto="Inicio" color="#FCFCF7" TamañoLetra={15} />
        <button
          onClick={handleInboxToggle}
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

        {usuario?.rol === 1 && (
          <TextLink href="/Administracion" Texto="Administración" color="#FCFCF7" TamañoLetra={15} />
        )}

        <div
          style={{
            borderTop: "1px solid rgba(252, 252, 247, 0.2)",
            marginTop: "auto",
            paddingTop: "16px",
            marginBottom: "16px",
          }}
        >
          <button onClick={handleUserMenuToggle} className="boton_usuario_side">
            <div className="usuario_icono_side" style={{ backgroundColor: usuario?.color || "#8B5A5A" }}>
              {getInitials(usuario?.nombre)}
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: "#FCFCF7", fontSize: "14px", fontWeight: "500" }}>
                {usuario?.nombre || "Usuario"}
              </div>
              <div style={{ color: "#FCFCF7", fontSize: "12px", opacity: 0.7 }}>{usuario?.email}</div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  )
}
