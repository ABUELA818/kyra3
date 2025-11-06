import { Equipo } from "@/types/Equipos";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Obtiene todos los equipos en los que un usuario es miembro o creador.
 */
export const getEquiposByUsuario = async (idUsuario: number): Promise<Equipo[]> => {
  try {
    const response = await fetch(`${API_URL}/equipos/usuario/${idUsuario}`);
    if (!response.ok) {
      throw new Error("Error al obtener los equipos del usuario");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Crea un nuevo equipo.
 */
export const createEquipo = async (datos: { Nombre_Equipo: string; ID_Usuario_Creador: number; miembros: number[] }) => {
  const response = await fetch(`${API_URL}/equipos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el equipo');
  }
  return await response.json();
};


import { MiembroEquipo, NuevoEquipo } from "@/types/Equipos";

/**
 * Obtiene la lista de todos los miembros de un equipo específico.
 */
export const getMiembrosDeEquipo = async (idEquipo: number): Promise<MiembroEquipo[]> => {
  try {
    const response = await fetch(`${API_URL}/equipos/${idEquipo}/miembros`);
    if (!response.ok) {
      throw new Error(`Error al obtener los miembros: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Actualiza el rol de un miembro en un equipo.
 */
export const updateRolMiembro = async (idEquipo: number, idUsuario: number, nuevo_rol: string) => {
  const response = await fetch(`${API_URL}/equipos/${idEquipo}/miembros/${idUsuario}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nuevo_rol }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar el rol');
  }
  return await response.json();
};

export const deleteMiembroDeEquipo = async (idEquipo: number, idUsuario: number) => {
  const response = await fetch(`${API_URL}/equipos/${idEquipo}/miembros/${idUsuario}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar al miembro');
  }
  return await response.json();
};

export const addMiembroToEquipo = async (idEquipo: number, idUsuario: number) => {
  try {
    const response = await fetch(`${API_URL}/equipos/${idEquipo}/miembros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ID_Usuario: idUsuario }), // El backend espera recibir { ID_Usuario } en el body
    });

    if (!response.ok) {
      // Si la API devuelve un error (ej: el usuario ya es miembro), lo capturamos aquí.
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al añadir al miembro');
    }

    return await response.json();
  } catch (error) {
    console.error("Error en el servicio addMiembroToEquipo:", error);
    throw error; // Relanzamos el error para que el componente que lo llama pueda manejarlo.
  }
};