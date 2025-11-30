const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export const uploadArchivos = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/archivos/upload`, {
      method: "POST",
      // ¡Importante! No se especifica 'Content-Type'. El navegador lo hará automáticamente.
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al subir los archivos")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en el servicio de subida:", error)
    throw error
  }
}

import type { ArchivoEquipo, SearchFilters } from "@/types/Equipos"

export const searchArchivos = async (idEquipo: number, filtros: SearchFilters): Promise<ArchivoEquipo[]> => {
  try {
    // URLSearchParams es la forma más segura y limpia de construir una query string
    const params = new URLSearchParams()

    // Añade cada filtro a los parámetros solo si tiene un valor
    if (filtros.q) params.append("q", filtros.q)
    if (filtros.tipo) params.append("tipo", filtros.tipo)
    if (filtros.propietario) params.append("propietario", String(filtros.propietario))
    if (filtros.fecha_inicio) params.append("fecha_inicio", filtros.fecha_inicio)
    if (filtros.fecha_fin) params.append("fecha_fin", filtros.fecha_fin)
    if (filtros.favoritos_de_usuario) params.append("favoritos_de_usuario", String(filtros.favoritos_de_usuario))

    const queryString = params.toString()
    const response = await fetch(`${API_URL}/archivos/equipo/${idEquipo}/buscar?${queryString}`)

    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error en el servicio de búsqueda:", error)
    return []
  }
}

export const addFavorito = async (idUsuario: number, idArchivo: number) => {
  try {
    const response = await fetch(`${API_URL}/archivos/favoritos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID_Usuario: idUsuario, ID_Archivo: idArchivo }),
    })
    if (response.status !== 200 && response.status !== 201) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al actualizar favoritos")
    }
    return await response.json()
  } catch (error) {
    console.error("Error al actualizar favoritos:", error)
    throw error
  }
}

export const removeFavorito = async (idUsuario: number, idArchivo: number) => {
  try {
    const response = await fetch(`${API_URL}/archivos/favoritos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID_Usuario: idUsuario, ID_Archivo: idArchivo }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al quitar de favoritos")
    }
    return await response.json()
  } catch (error) {
    console.error("Error al quitar de favoritos:", error)
    throw error
  }
}

export const updateArchivoNombre = async (idArchivo: number, nuevoNombre: string) => {
  try {
    const response = await fetch(`${API_URL}/archivos/${idArchivo}/nombre`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Nombre_Archivo: nuevoNombre }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al renombrar el archivo")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en el servicio de renombrar archivo:", error)
    throw error
  }
}

export const deleteArchivo = async (idArchivo: number) => {
  try {
    const response = await fetch(`${API_URL}/archivos/${idArchivo}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al eliminar el archivo")
    }

    return await response.json()
  } catch (error) {
    console.error("Error al eliminar archivo:", error)
    throw error
  }
}

export const downloadArchivo = async (idArchivo: number, nombreArchivo: string) => {
  try {
    const response = await fetch(`${API_URL}/archivos/${idArchivo}/download`)

    if (!response.ok) {
      throw new Error("Error al descargar el archivo")
    }

    // Crear un blob desde la respuesta
    const blob = await response.blob()

    // Crear una URL temporal para el blob
    const url = window.URL.createObjectURL(blob)

    // Crear un elemento <a> invisible para descargar
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", nombreArchivo)

    // Agregar al documento, hacer clic y limpiar
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Liberar la URL del blob
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error al descargar archivo:", error)
    throw error
  }
}

export const getArchivoById = async (idArchivo: number): Promise<ArchivoEquipo> => {
  try {
    const response = await fetch(`${API_URL}/archivos/${idArchivo}`)

    if (!response.ok) {
      throw new Error("Error al obtener el archivo")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en el servicio de obtener archivo:", error)
    throw error
  }
}
