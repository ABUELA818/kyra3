// src/types/Carpetas.ts

// Define la estructura de una carpeta, que ya usas en otros tipos
export interface Carpeta {
  ID_Carpeta: number;
  Nombre_Carpeta: string;
  ID_Equipo: number;
  Carpeta_Origen: number | null;
}

// Define la estructura de un item en la ruta de navegación (breadcrumb)
export interface RutaItem {
  ID_Carpeta: number;
  Nombre_Carpeta: string;
}