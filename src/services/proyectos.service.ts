// src/services/proyectos.service.ts

// URL base de tu API. Es mejor ponerla en una variable de entorno (.env.local)
const API_URL = "http://localhost:4000/api";

// --- GET: Obtener los proyectos de un usuario ---
export const getProyectosByUsuario = async (idUsuario: number) => {
  try {
    const response = await fetch(`${API_URL}/proyectos/usuario/${idUsuario}`);
    if (!response.ok) {
      throw new Error('Error al obtener los proyectos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Podríamos retornar un array vacío o relanzar el error para que el componente lo maneje
    return [];
  }
};

// --- POST: Crear un nuevo proyecto ---
export const createProyecto = async (datosDelProyecto: any) => { // Reemplaza 'any' con un tipo más específico después
  try {
    const response = await fetch(`${API_URL}/proyectos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosDelProyecto),
    });

    if (!response.ok) {
      // Si el servidor devuelve un error, lo capturamos
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el proyecto');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Relanzamos el error para que el formulario pueda mostrar un mensaje al usuario
  }
}; 