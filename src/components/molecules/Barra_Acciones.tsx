"use client"

import { Pencil, Download, UserPlus, Heart } from "lucide-react";
import { ArchivoEquipo } from "@/types/Equipos"; // Importa el tipo

// 1. La prop 'archivo' ahora es obligatoria
interface BarraAccionesProps {
  archivo: ArchivoEquipo; 
  onEditClick: () => void;
  onDownloadClick: () => void;
  onShareClick?: () => void;
  onFavoriteClick: () => void;
  Estilo: string;
  IconTamaño: number;
}

export default function BarraAcciones({ 
  archivo, // Ahora siempre estará definido
  onEditClick, 
  onDownloadClick, 
  onShareClick, 
  onFavoriteClick,
  Estilo,
  IconTamaño
}: BarraAccionesProps) {
    return (
        <div className="Barra_Acciones" style={{display: Estilo}}>
            <button onClick={onEditClick} title="Renombrar"><Pencil size={IconTamaño}/></button>
            <button onClick={onDownloadClick} title="Descargar"><Download size={IconTamaño}/></button>
            <button onClick={onShareClick} title="Compartir (Próximamente)"><UserPlus size={IconTamaño} style={{ opacity: 0.5 }}/></button>
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