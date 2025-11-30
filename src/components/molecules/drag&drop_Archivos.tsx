"use client"

import type React from "react"

import { useState } from "react"

interface DragAndDropProps {
  onFiles: (files: File[]) => void
}

export default function DragAndDrop({ onFiles }: DragAndDropProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragover") setDragActive(true)
    if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      onFiles(files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onFiles(files)
    }
  }

  return (
    <div className="Drag_Contenedor">
      <input type="file" id="input-file-upload" multiple hidden onChange={handleChange} />
      <label
        htmlFor="input-file-upload"
        className={`Drop_Area ${dragActive ? "active" : ""}`}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <p>Arrastra los archivos aquí</p>
        <span>ó</span>
        <button type="button" className="Btn_Seleccionar">
          Selecciona archivos
        </button>
      </label>
    </div>
  )
}
