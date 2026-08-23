import React from "react"
// Asegúrate de importar desde la ruta correcta
import SideBar from "@/components/organisms/SideBar" 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="layout h-screen w-full overflow-hidden">
      <aside className="sidebar hidden h-full w-64 shrink-0 border-r md:block">
        <SideBar />
      </aside>

      <main style={{ marginLeft: '200px' }}>
        {children}
      </main>
      
    </div>
  )
}
