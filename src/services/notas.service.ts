
const API_URL = "http://localhost:4000/api";

// --- GET: Obtener las notas de un usuario ---
export const getNotasByUsuario = async (idUsuario: number) => {
  try {
    const response = await fetch(`${API_URL}/notas/${idUsuario}`);
    
    if (!response.ok) {
      console.error(`Error ${response.status}: ${response.statusText}`);
      throw new Error('Error al obtener las notas');
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// --- POST: Crear una nueva nota ---
export const createNota = async (datos: { ID_Usuario: number; Contenido_Nota: string }) => {
  const response = await fetch(`${API_URL}/notas/Notas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la nota');
  }
  return await response.json();
};

// --- DELETE: Eliminar una nota ---
export const deleteNota = async (idNota: number) => {
  const response = await fetch(`${API_URL}/notas/${idNota}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar la nota');
  }
  return await response.json();
};