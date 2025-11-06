import { ContenidoCarpeta } from "@/types/Equipos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Obtiene el contenido (archivos y carpetas) de una carpeta de un equipo.
 * Si no se provee carpetaId, obtiene el contenido de la raíz.
 */
export const getContenidoCarpeta = async (idEquipo: number, carpetaId: number | null, idUsuarioActual: number): Promise<ContenidoCarpeta> => {
  try {
    // Añadimos el id_usuario_actual a la URL
    const url = carpetaId
      ? `${API_URL}/carpetas/${idEquipo}/fs?carpeta_id=${carpetaId}&id_usuario_actual=${idUsuarioActual}`
      : `${API_URL}/carpetas/${idEquipo}/fs?id_usuario_actual=${idUsuarioActual}`;
      
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener el contenido");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { carpetas: [], archivos: [] };
  }
};

/**
 * Crea una nueva carpeta.
 */
export const createCarpeta = async (datos: { Nombre_Carpeta: string; ID_Equipo: number; Carpeta_Origen: number | null }) => {
    const response = await fetch(`${API_URL}/carpetas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la carpeta');
    }
    return await response.json();
};

// ... (tus otras funciones como getContenidoCarpeta y createCarpeta)
import { RutaItem } from "@/types/Carpetas"; // Importa el nuevo tipo

/**
 * Obtiene la ruta de navegación (breadcrumbs) para una carpeta específica.
 */
export const getRutaCarpeta = async (idCarpeta: number): Promise<RutaItem[]> => {
  try {
    const response = await fetch(`${API_URL}/carpetas/${idCarpeta}/path`);
    if (!response.ok) {
      throw new Error("Error al obtener la ruta de la carpeta");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};