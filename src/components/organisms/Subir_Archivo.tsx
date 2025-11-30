"use client"

import type React from "react"

import { useState } from "react"
import DragAndDrop from "../molecules/drag&drop_Archivos"
import { uploadArchivos } from "@/services/Archivos.service"

interface SubirArchivosProps {
  onClose: () => void
  onArchivoSubido: () => void
  idEquipo: number
  carpetaActualId: number | null
}

export default function Subir_Archivos({ onClose, onArchivoSubido, idEquipo, carpetaActualId }: SubirArchivosProps) {
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState(0)

  const handleFiles = (nuevoArchivos: File[]) => {
    setArchivosSeleccionados((archivosActuales) => {
      // Combinar archivos existentes con los nuevos
      const archivosAgregados = [...archivosActuales, ...nuevoArchivos]
      // Eliminar duplicados por nombre de archivo
      const archivosUnicos = Array.from(new Map(archivosAgregados.map((archivo) => [archivo.name, archivo])).values())
      return archivosUnicos
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (archivosSeleccionados.length === 0) return

    setSubiendo(true)
    setProgreso(0)

    try {
      const formData = new FormData()

      // Agregar todos los archivos al FormData con el nombre 'archivos'
      archivosSeleccionados.forEach((archivo) => {
        formData.append("archivos", archivo)
      })

      formData.set("ID_Equipo", String(idEquipo))
      formData.set("ID_Dueno", "1")
      if (carpetaActualId) {
        formData.set("ID_Carpeta", String(carpetaActualId))
      }

      // Enviar todos los archivos en una sola llamada
      await uploadArchivos(formData)

      alert("¡Archivos subidos con éxito!")
      onArchivoSubido()
      onClose()
    } catch (error) {
      console.error("Error al subir:", error)
      alert("Hubo un fallo al subir los archivos.")
    } finally {
      setSubiendo(false)
      setProgreso(0)
    }
  }

  const removerArchivo = (index: number) => {
    setArchivosSeleccionados(archivosSeleccionados.filter((_, i) => i !== index))
  }

  return (
    <div className="Subir_Archivos_Contenedor" onClick={onClose}>
      <div className="Subir_Archivos_Formulario" onClick={(e) => e.stopPropagation()}>
        <div className="Subir_Archivos_Titulo">
          <h2>Subir archivos</h2>
        </div>
        <form onSubmit={handleSubmit} className="Subir_Archivos_Contenido">
          <DragAndDrop onFiles={handleFiles} />
          {archivosSeleccionados.length > 0 && (
            <div className="Archivos_Lista">
              <p className="Archivos_Contador">{archivosSeleccionados.length} archivo(s) seleccionado(s)</p>
              {archivosSeleccionados.map((archivo, index) => (
                <div key={index} className="Archivo_Item">
                  <span>{archivo.name}</span>
                  <button
                    type="button"
                    onClick={() => removerArchivo(index)}
                    className="Archivo_Remover"
                    disabled={subiendo}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="Subir_Archivos_Acciones">
            <button type="button" className="Btn_Cancelar" onClick={onClose} disabled={subiendo}>
              Cancelar
            </button>
            <button type="submit" className="Btn_Subir" disabled={subiendo || archivosSeleccionados.length === 0}>
              {subiendo ? "Subiendo..." : "Subir archivos"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
