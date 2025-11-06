"use client"
import { useState } from "react";
import { MiembroEquipo } from "@/types/Equipos";

// Define la estructura de los datos de los filtros
export interface FiltrosData {
  tipo?: string;
  propietario?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

interface FiltrosModalProps {
  onClose: () => void;
  onApply: (filtros: FiltrosData) => void;
  miembrosDelEquipo: MiembroEquipo[]; // Recibe la lista de miembros
}

export default function FiltrosModal({ onClose, onApply, miembrosDelEquipo }: FiltrosModalProps) {
  const [filtros, setFiltros] = useState<FiltrosData>({});

  const handleApply = () => {
    // Limpiamos los filtros vacíos antes de enviarlos
    const filtrosActivos: FiltrosData = {};
    if (filtros.tipo) filtrosActivos.tipo = filtros.tipo;
    if (filtros.propietario) filtrosActivos.propietario = filtros.propietario;
    if (filtros.fecha_inicio) filtrosActivos.fecha_inicio = filtros.fecha_inicio;
    if (filtros.fecha_fin) filtrosActivos.fecha_fin = filtros.fecha_fin;
    onApply(filtrosActivos);
  };

  return (
    <div className="filtros-modal-overlay" onClick={onClose}>
      <div className="filtros-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Filtros de Búsqueda</h2>
        
        {/* Filtro por Tipo de Archivo */}
        <div className="filtro-grupo">
          <label>Tipo de archivo</label>
          <select 
            value={filtros.tipo || ""} 
            onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
          >
            <option value="">Todos</option>
            <option value="application/pdf">PDF</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            {/* Añade más tipos de archivo según necesites */}
          </select>
        </div>

        {/* Filtro por Propietario (ahora dinámico) */}
        <div className="filtro-grupo">
          <label>Propietario</label>
          <select 
            value={filtros.propietario || ""}
            onChange={(e) => setFiltros(prev => ({ ...prev, propietario: Number(e.target.value) }))}
          >
            <option value="">Todos</option>
            {miembrosDelEquipo.map(miembro => (
              <option key={miembro.ID_Usuario} value={miembro.ID_Usuario}>
                {miembro.Nombre_Usuario}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Rango de Fechas */}
        <div className="filtro-grupo-inline">
          <div className="filtro-grupo">
            <label>Desde</label>
            <input 
              type="date" 
              value={filtros.fecha_inicio || ""}
              onChange={(e) => setFiltros(prev => ({ ...prev, fecha_inicio: e.target.value }))}
            />
          </div>
          <div className="filtro-grupo">
            <label>Hasta</label>
            <input 
              type="date" 
              value={filtros.fecha_fin || ""}
              onChange={(e) => setFiltros(prev => ({ ...prev, fecha_fin: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="filtros-acciones">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleApply}>Aplicar Filtros</button>
        </div>
      </div>
    </div>
  );
}