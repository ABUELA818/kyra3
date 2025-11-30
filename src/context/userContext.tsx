"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface Usuario {
  id: number
  email: string
  nombre?: string
  color?: string
  rol?: number
  rol_nombre?: string
}

interface UserContextType {
  usuario: Usuario | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("usuario")
    if (stored) {
      try {
        setUsuario(JSON.parse(stored))
      } catch {
        localStorage.removeItem("usuario")
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/usuarios/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          const message = errorData.message || "Error en el login"
          setError(message)
          setLoading(false)
          return false
        }

        const data = await response.json()
        const userData: Usuario = {
          id: data.id || data.usuario?.id,
          email: data.email || data.usuario?.email,
          nombre: data.nombre || data.usuario?.nombre,
          color: data.color || data.usuario?.color || "#8B5A5A",
          rol: data.rol || data.usuario?.rol || data.ID_Rol || data.usuario?.ID_Rol,
          rol_nombre: data.rol_nombre || data.usuario?.rol_nombre || data.Rol || data.usuario?.Rol,
        }

        setUsuario(userData)
        localStorage.setItem("usuario", JSON.stringify(userData))
        if (data.token) {
          localStorage.setItem("authToken", data.token)
        }

        router.push("/Inicio")
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido"
        setError(message)
        return false
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(() => {
    setUsuario(null)
    setError(null)
    localStorage.removeItem("usuario")
    localStorage.removeItem("authToken")
    router.push("/login")
  }, [router])

  const isAuthenticated = !!usuario

  return (
    <UserContext.Provider value={{ usuario, loading, error, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser debe usarse dentro de UserProvider")
  }
  return context
}
