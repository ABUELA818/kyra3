"use client"

import { Pencil, Download, Trash2, Heart } from "lucide-react"
import type { ArchivoEquipo } from "@/types/Equipos"

interface BarraAccionesProps {
  archivo: ArchivoEquipo
  onEditClick: () => void
  onDownloadClick: () => void
  onDeleteClick: () => void
  onFavoriteClick: () => void
  Estilo: string
  IconTamaño: number
}

export default function BarraAcciones({
  archivo,
  onEditClick,
  onDownloadClick,
  onDeleteClick,
  onFavoriteClick,
  Estilo,
  IconTamaño,
}: BarraAccionesProps) {
  return (
    <div className="Barra_Acciones" style={{ display: Estilo }}>
      <button onClick={onEditClick} title="Renombrar">
        <Pencil size={IconTamaño} />
      </button>
      <button onClick={onDownloadClick} title="Descargar">
        <Download size={IconTamaño} />
      </button>
      <button onClick={onDeleteClick} title="Eliminar archivo">
        <Trash2 size={IconTamaño} />
      </button>
      <button onClick={onFavoriteClick} title={archivo.is_favorito ? "Quitar de favoritos" : "Añadir a favoritos"}>
        <Heart
          size={IconTamaño}
          fill={archivo.is_favorito ? "red" : "none"}
          color={archivo.is_favorito ? "red" : "currentColor"}
        />
      </button>
    </div>
  )
}
