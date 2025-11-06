const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const uploadArchivos = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/archivos/upload`, {
      method: 'POST',
      // ¡Importante! No se especifica 'Content-Type'. El navegador lo hará automáticamente.
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir los archivos');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error en el servicio de subida:", error);
    throw error;
  }
};

import { ArchivoEquipo, SearchFilters } from "@/types/Equipos";

export const searchArchivos = async (idEquipo: number, filtros: SearchFilters): Promise<ArchivoEquipo[]> => {
  try {
    // URLSearchParams es la forma más segura y limpia de construir una query string
    const params = new URLSearchParams();

    // Añade cada filtro a los parámetros solo si tiene un valor
    if (filtros.q) params.append('q', filtros.q);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.propietario) params.append('propietario', String(filtros.propietario));
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros.favoritos_de_usuario) params.append('favoritos_de_usuario', String(filtros.favoritos_de_usuario));

    const queryString = params.toString();
    const response = await fetch(`${API_URL}/archivos/equipo/${idEquipo}/buscar?${queryString}`);

    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en el servicio de búsqueda:", error);
    return [];
  }
};

export const addFavorito = async (idUsuario: number, idArchivo: number) => {
  const response = await fetch(`${API_URL}/archivos/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ID_Usuario: idUsuario, ID_Archivo: idArchivo }),
  });
  if (!response.ok) throw new Error("Error al añadir a favoritos");
  return await response.json();
};

export const removeFavorito = async (idUsuario: number, idArchivo: number) => {
  const response = await fetch(`${API_URL}/archivos/favoritos`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ID_Usuario: idUsuario, ID_Archivo: idArchivo }),
  });
  if (!response.ok) throw new Error("Error al quitar de favoritos");
  return await response.json();
};

export const updateArchivoNombre = async (idArchivo: number, nuevoNombre: string) => {
  try {
    const response = await fetch(`${API_URL}/archivos/${idArchivo}/nombre`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nombre_Archivo: nuevoNombre }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al renombrar el archivo');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error en el servicio de renombrar archivo:", error);
    throw error;
  }
};