"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Archivo from "@/components/templates/Archivo"
import type { ArchivoEquipo } from "@/types/Equipos"

export default function PageArchivo() {
  const params = useParams()
  const archivoId = Number(params.Archivos)
  const [archivoData, setArchivoData] = useState<ArchivoEquipo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const obtenerArchivo = async () => {
      try {
        setLoading(true)
        console.log("[v0] Fetching archivo with ID:", archivoId)
        const response = await fetch(`http://localhost:4000/api/archivos/${archivoId}`)
        console.log("[v0] Response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Archivo data received:", data)
          setArchivoData(data)
          setError(null)
        } else {
          const errorData = await response.json()
          console.error("[v0] Error response:", errorData)
          setError(errorData.message || "Error al obtener archivo")
        }
      } catch (error) {
        console.error("[v0] Catch error:", error)
        setError(error instanceof Error ? error.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (archivoId) {
      obtenerArchivo()
    }
  }, [archivoId])

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando archivo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    )
  }

  return <Archivo archivoData={archivoData} />
}
 