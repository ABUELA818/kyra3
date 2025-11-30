// Para los datos del formulario de creación
export interface NuevoEquipo {
  titulo: string;
  miembros: number[]; // Array de IDs de usuario
  ID_Creador: number;
}

// Para los datos de un equipo que vienen de la API
export interface Equipo {
  ID_Equipo: number;
  Nombre_Equipo: string;
  // Puedes añadir más campos si tu API los devuelve, como 'creador_equipo', 'miembros', etc.
}

// Para un miembro del equipo
export interface MiembroEquipo {
  ID_Usuario: number;
  Nombre_Usuario: string;
  Correo: string;
  Color: string;
  Rol_equipo: 'Creador' | 'Admin' | 'Miembro';
}

// Para un archivo en la lista del equipo
export interface ArchivoEquipo {
  ID_Archivo: number;
  Nombre_Archivo: string;
  Tamaño_Archivo: number;
  Fecha_Subida: string;
  propietario: string | null;
  estado: string | null;
  StorageKey: string; // Necesario para la descarga
  is_favorito: boolean; // El nuevo campo que nos dirá si es favorito
}

// Para una carpeta en la lista del equipo
export interface CarpetaEquipo {
  ID_Carpeta: number;
  Nombre_Carpeta: string;
  Carpeta_Origen: number | null;
}

// Para la respuesta del endpoint de contenido de carpeta
export interface ContenidoCarpeta {
  carpetas: CarpetaEquipo[];
  archivos: ArchivoEquipo[];
}

export interface SearchFilters {
  q?: string;
  tipo?: string;
  propietario?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  favoritos_de_usuario?: number;
}
