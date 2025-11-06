// src/services/usuarios.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}