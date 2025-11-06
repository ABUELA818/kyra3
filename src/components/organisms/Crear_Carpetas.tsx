// src/components/organisms/Crear_Carpetas.tsx (CORREGIDO)
"use client"

import { useState } from "react"

interface CrearCarpetaProps {
  onClose: () => void;
  onCrear: (nombreCarpeta: string) => void; // Prop para notificar la creación
}

export default function Crear_Carpeta({ onClose, onCrear }: CrearCarpetaProps) {
  const [nombreCarpeta, setNombreCarpeta] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombreCarpeta.trim()) {
      onCrear(nombreCarpeta);
    }
  };

  return (
    <div className="Crear_Carpeta_Contenedor" onClick={onClose}>
      <div className="Crear_Carpeta_Formulario" onClick={(e) => e.stopPropagation()}>
        <div className="Crear_Carpeta_Titulo">
          <h2>Crear Carpeta</h2>
        </div>
        <form onSubmit={handleSubmit} className="Crear_Carpeta_Contenido">
            <input 
              placeholder="Nombre de la carpeta"
              value={nombreCarpeta}
              onChange={(e) => setNombreCarpeta(e.target.value)}
              required
            />
          <div className="Subir_Archivos_Acciones">
            <button type="button" className="Btn_Cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="Btn_Subir">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
}