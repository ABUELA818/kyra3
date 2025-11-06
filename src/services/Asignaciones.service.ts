// src/services/asignaciones.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const getAsignacionesByUsuario = async (idUsuario: number) => {
  try {
    const response = await fetch(`${API_URL}/asignaciones/usuarios/${idUsuario}`);
    
    if (!response.ok) {
      // Si la respuesta no es OK, no intentes leerla como JSON.
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener las asignaciones:", error);
    return []; 
  }
}; 

import { ApiAsignacionCreada } from "@/types/Asignaciones";

export const getAsignacionesEnviadasByCreador = async (idUsuario: string | number): Promise<ApiAsignacionCreada[]> => {
  try {
    const response = await fetch(`${API_URL}/asignaciones/${idUsuario}/enviadas`);
    
    if (!response.ok) {
        throw new Error('Error al obtener las asignaciones enviadas');
    }

    // 1. Guarda el resultado de .json() en una variable
    const data = await response.json();
    console.log(data);

    // 2. Devuelve la variable, diciéndole a TypeScript que confíe en que es del tipo correcto
    return data as ApiAsignacionCreada[];

  } catch (error) {
    console.error(error);
    // Esta parte está bien, porque un array vacío [] coincide con el tipo ApiAsignacionCreada[]
    return [];
  }
};

export const createAsignacion = async (datos: any) => {
  const response = await fetch(`${API_URL}/asignaciones/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la asignación');
  }
  return await response.json();
};

import { HistorialItem } from "@/types/Asignaciones";

export const getHistorialDeAsignacion = async (idAsignacion: number): Promise<HistorialItem[]> => {
  try {
    const response = await fetch(`${API_URL}/asignaciones/${idAsignacion}/historial`);
    if (!response.ok) {
      throw new Error('Error al obtener el historial de la asignación');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

import { ApiAsignacionProyecto } from "@/types/Asignaciones";

// Tu backend ya tiene esta ruta: GET /api/asignaciones/proyecto/:ID_Proyecto
export const getAsignacionesByProyecto = async (idProyecto: number | string): Promise<ApiAsignacionProyecto[]> => {
  try {
    const response = await fetch(`${API_URL}/asignaciones/proyecto/${idProyecto}`);
    if (!response.ok) {
      throw new Error('Error al obtener las asignaciones del proyecto');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const batchUpdateAsignaciones = async (taskIds: string[], updates: any) => {
  const response = await fetch(`${API_URL}/asignaciones/batch-update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskIds, updates }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar tareas');
  }
  return await response.json();
};

/**
 * Elimina una o más asignaciones en lote.
 */
export const batchDeleteAsignaciones = async (taskIds: string[]) => {
  const response = await fetch(`${API_URL}/asignaciones/batch-delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskIds }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar tareas');
  }
  return await response.json();
};