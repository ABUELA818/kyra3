// Define la estructura de un miembro del equipo
export interface MiembroEquipo {
  ID_Usuario: number;
  Nombre_Usuario: string;
  Correo: string;
  Color: string;
}

// Define la estructura de un proyecto, tal como lo devuelve tu API
export interface Proyecto {
  ID_Proyecto: number;
  Nombre_Proyecto: string;
  Estado_Proyecto: string;
  Fecha_Inicio: string;
  numero_asignaciones: number;
  avance: number;
  equipo: MiembroEquipo[];
}