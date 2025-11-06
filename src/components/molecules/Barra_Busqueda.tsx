"use client"

import { useState } from "react";
import { SlidersHorizontal, RefreshCcw } from "lucide-react";
import FiltrosModal, { FiltrosData } from "@/components/organisms/Filtros";
import { MiembroEquipo } from "@/types/Equipos"; // Importa el tipo

// 1. AÑADE 'miembros' A LA INTERFAZ DE PROPS
interface BarraBusquedaProps {
  onSearch: (searchTerm: string, filtros: FiltrosData) => void;
  onRefresh: () => void;
  miembros: MiembroEquipo[]; // Prop para pasar los miembros
}

// 2. RECIBE 'miembros' EN LAS PROPS
export default function Barra_Busqueda({ onSearch, onRefresh, miembros }: BarraBusquedaProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filtros, setFiltros] = useState<FiltrosData>({});
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        onSearch(newSearchTerm, filtros);
    };
    
    const handleAplicarFiltros = (nuevosFiltros: FiltrosData) => {
        setFiltros(nuevosFiltros);
        onSearch(searchTerm, nuevosFiltros);
        setMostrarModal(false);
    };

    return (
        <div className="Barra_Busqueda_Contenedor2">
            <div className="Barra_Busqueda_Contenedor">
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
                    <button onClick={onRefresh}>
                        <RefreshCcw />
                    </button>
                </div>
            </div>

            {/* 3. PASA 'miembros' AL MODAL CON LA PROP CORRECTA */}
            {mostrarModal && (
                <FiltrosModal
                    onClose={() => setMostrarModal(false)}
                    onApply={handleAplicarFiltros}
                    miembrosDelEquipo={miembros} // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN!
                />
            )}
        </div>
    );
}