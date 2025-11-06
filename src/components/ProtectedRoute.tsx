"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/context/userContext"
import SideBar from "@/components/organisms/SideBar"
import Inbox from "@/components/organisms/Inbox"
import { useInbox } from "@/context/inbox-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading } = useUser()
  const { isOpen } = useInbox()

  const isLoginPage = pathname === "/login"

  useEffect(() => {
    // If on login page and authenticated, redirect to home
    if (isLoginPage && isAuthenticated) {
      router.push("/Inicio")
    }
    // If not on login page and not authenticated after loading, redirect to login
    if (!isLoginPage && !loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router, isLoginPage])

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        Cargando...
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  // Only render protected content with sidebar if authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="body" style={{ flex: 1, width: "100%", overflow: "auto" }}>
        {children}
        <Inbox initialNotifications={[]} />
      </div>
    </div>
  )
}
