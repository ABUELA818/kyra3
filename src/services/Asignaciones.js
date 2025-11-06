export async function getAsignacionesPorUsuario(idUsuario) {
  try {
    const response = await fetch(`http://localhost:4000/api/Asignaciones/usuario/${idUsuario}`);
    if (!response.ok) {
      throw new Error("Error al obtener asignaciones");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  } 
}
