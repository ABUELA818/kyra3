// src/services/usuarios.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/usuarios`)
    if (!response.ok) throw new Error("Error al obtener usuarios")
    const data = await response.json()
    return data.map((usuario: any) => ({
      ID_Usuario: usuario.id || usuario.ID_Usuario,
      Nombre_Usuario: usuario.nombre || usuario.Nombre_Usuario,
      Correo: usuario.correo || usuario.Correo,
      Color: usuario.color || usuario.Color,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getUserById = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${userId}`)
    if (!response.ok) throw new Error("Error al obtener usuario")
    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}
