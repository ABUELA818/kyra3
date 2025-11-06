// src/services/notificaciones.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const getNotificacionesByUsuario = async (idUsuario: number) => {
  try {
    const response = await fetch(`${API_URL}/notificaciones/${idUsuario}`);
    if (!response.ok) throw new Error('Error al obtener las notificaciones');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Marks a specific notification as read.
 */
export const marcarNotificacionComoVista = async (idNotificacion: number) => {
  const response = await fetch(`${API_URL}/notificaciones/${idNotificacion}/visto`, {
    method: 'PATCH',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al marcar la notificación como vista');
  }
  return await response.json();
};