"use client"

import type React from "react"

import { useState } from "react"
import { SlidersHorizontal, RefreshCcw } from "lucide-react"
import FiltrosModal, { type FiltrosData } from "@/components/organisms/Filtros"
import type { MiembroEquipo } from "@/types/Equipos"

interface BarraBusquedaProps {
  onSearch: (searchTerm: string, filtros: FiltrosData) => void
  onRefresh: () => void
  miembros: MiembroEquipo[]
  idUsuarioActual: number
  teamName?: string
}

export default function Barra_Busqueda({
  onSearch,
  onRefresh,
  miembros,
  idUsuarioActual,
  teamName,
}: BarraBusquedaProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtros, setFiltros] = useState<FiltrosData>({})
  const [mostrarModal, setMostrarModal] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    onSearch(newSearchTerm, filtros)
  }

  const handleAplicarFiltros = (nuevosFiltros: FiltrosData) => {
    setFiltros(nuevosFiltros)
    onSearch(searchTerm, nuevosFiltros)
    setMostrarModal(false)
  }

  return (
    <div className="Barra_Busqueda_Contenedor2">
      <div className="Barra_Busqueda_Contenedor">
        {teamName && <h2 className="team-name-header">{teamName}</h2>}
        <div className="Barra_Busqueda_Componentes">
          <input
            type="text"
            placeholder="Buscar archivos en este equipo..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="Input_Busqueda_Estilo"
          />
          <button className="Filtros" onClick={() => setMostrarModal(true)}>
            <SlidersHorizontal />
          </button>
          <button onClick={onRefresh} title="Refrescar tabla" className="Btn_Refresh">
            <RefreshCcw />
          </button>
        </div>
      </div>

      {mostrarModal && (
        <FiltrosModal
          onClose={() => setMostrarModal(false)}
          onApply={handleAplicarFiltros}
          miembrosDelEquipo={miembros}
          idUsuarioActual={idUsuarioActual}
        />
      )}
    </div>
  )
}
