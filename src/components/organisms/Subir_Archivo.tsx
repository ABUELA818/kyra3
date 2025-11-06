"use client"

import { useState } from "react"
import DragAndDrop from "../molecules/drag&drop_Archivos"
import { uploadArchivos } from "@/services/Archivos.service"

interface SubirArchivosProps {
  onClose: () => void;
  onArchivoSubido: () => void; // La función callback
  idEquipo: number;
  carpetaActualId: number | null;
}

export default function Subir_Archivos({ onClose, onArchivoSubido, idEquipo, carpetaActualId }: SubirArchivosProps) {
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([]);
  const [subiendo, setSubiendo] = useState(false);

  // 2. Creamos la lógica para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (archivosSeleccionados.length === 0) return;

    setSubiendo(true);

    try {
      // Usamos FormData para enviar archivos y texto juntos
      const formData = new FormData();
      
      // El backend espera un solo archivo llamado 'archivo', así que lo enviamos uno por uno
      // (Si tu backend soportara múltiples, podrías hacerlo en una sola llamada)
      for (const archivo of archivosSeleccionados) {
        formData.set('archivo', archivo); // Usamos set para reemplazar en cada iteración
        formData.set('ID_Equipo', String(idEquipo));
        formData.set('ID_Dueno', "1"); // Reemplaza "1" con el ID del usuario actual
        if (carpetaActualId) {
          formData.set('ID_Carpeta', String(carpetaActualId));
        }
        await uploadArchivos(formData);
      }
      
      alert("¡Archivos subidos con éxito!");
      
      // 3. Llamamos a la función callback para avisar al padre
      onArchivoSubido();
      onClose();

    } catch (error) {
      console.error("Error al subir:", error);
      alert("Hubo un fallo al subir los archivos.");
    } finally {
      setSubiendo(false);
    }
  };

  const removerArchivo = (index: number) => {
    setArchivosSeleccionados(archivosSeleccionados.filter((_, i) => i !== index));
  };

  return (
    <div className="Subir_Archivos_Contenedor" onClick={onClose}>
      <div className="Subir_Archivos_Formulario" onClick={(e) => e.stopPropagation()}>
        <div className="Subir_Archivos_Titulo">
          <h2>Subir archivo</h2>
        </div>
        <form onSubmit={handleSubmit} className="Subir_Archivos_Contenido">
          <DragAndDrop onFiles={setArchivosSeleccionados} />
          {archivosSeleccionados.length > 0 && (
            <div className="Archivos_Lista">
              {archivosSeleccionados.map((archivo, index) => (
                <div key={index} className="Archivo_Item">
                  <span>{archivo.name}</span>
                  <button type="button" onClick={() => removerArchivo(index)} className="Archivo_Remover">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="Subir_Archivos_Acciones">
            <button type="button" className="Btn_Cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="Btn_Subir" disabled={subiendo}>
              {subiendo ? 'Subiendo...' : 'Subir archivos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}