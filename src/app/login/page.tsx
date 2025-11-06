"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/context/userContext"
import Link from "next/link"
import "@/styles/login.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, error } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  console.log("shdcbiaewluvfoaleirvcniaseucbsecfhjkjbcxesbcfaerlivbkaeruvbcleraibvcdalsiucnlidsuabvclawenclevrbchlrjncldsibcearifbvafraLIBYULVABFDLVUYCBLREVICJNKVCHBRELVBCILCBLEQRB")

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className="login-form-wrapper">
        <div className="login-form">
          <h1 className="login-title">Iniciar Sesión</h1>

          <form onSubmit={handleSubmit} className="login-form-content">
            <div className="form-group">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Confirma tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="login-footer">
              <Link href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
