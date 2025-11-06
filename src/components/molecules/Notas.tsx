"use client"
import { useState, useRef } from "react"
import Texto from "../atoms/Texto"
import Boton from "../atoms/Boton"
import { Plus, Trash2 } from "lucide-react"
import "@/styles/Notas.css"

import { createNota, deleteNota } from "@/services/notas.service"
import type { Nota } from "@/types/Notas"

interface NotasProps {
  initialNotes: Nota[]
  idUsuario: number
}

export default function Notas({ initialNotes, idUsuario }: NotasProps) {
  const [notas, setNotas] = useState(initialNotes)
  const [notaNueva, setNotaNueva] = useState("")
  const [mostrandoInput, setMostrandoInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleShowInput = () => {
    setMostrandoInput(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleSaveNota = async () => {
    if (notaNueva.trim() === "") {
      setMostrandoInput(false)
      return
    }
    try {
      const nuevaNotaCreada = await createNota({
        ID_Usuario: idUsuario,
        Contenido_Nota: notaNueva,
      })
      setNotas([nuevaNotaCreada.nota, ...notas])
      setNotaNueva("")
      setMostrandoInput(false)
    } catch (error) {
      console.error("Error al guardar la nota:", error)
    }
  }

  const handleDeleteNota = async (idNota: number) => {
    try {
      await deleteNota(idNota)
      setNotas(notas.filter((nota) => nota.ID_Nota !== idNota))
    } catch (error) {
      console.error("Error al eliminar la nota:", error)
    }
  }

  return (
    <div className="notas-contenedor">
      <div className="Notas-titulo">
        <Texto Texto="NOTAS" />
        <Boton Texto="" Icono={<Plus size={20} />} onClick={handleShowInput} />
      </div>

      <div className="notas-notas">
        {mostrandoInput && (
          <input
            ref={inputRef}
            className="nota-input"
            value={notaNueva}
            onChange={(e) => setNotaNueva(e.target.value)}
            onBlur={handleSaveNota}
            onKeyDown={(e) => e.key === "Enter" && handleSaveNota()}
            placeholder="Escribe tu nota..."
          />
        )}

        {notas.length === 0 && !mostrandoInput && (
          <div style={{ padding: "1rem", textAlign: "center", color: "#666", fontSize: "14px" }}>No tienes notas</div>
        )}

        {notas.map((nota) => (
          <div key={nota.ID_Nota} className="nota-item">
            <p className="nota-texto">{nota.Contenido_Nota}</p>
            <button className="nota-delete-btn" onClick={() => handleDeleteNota(nota.ID_Nota)}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
