// src/types/Proyectos.ts

// Tipo para un miembro del equipo devuelto por la API
export interface ApiMiembroEquipo {
  ID_Usuario: number;
  Nombre_Usuario: string;
  Correo: string;
  Color: string;
}

// Tipo para el resumen del proyecto devuelto por la API
export interface ApiProyecto {
  ID_Proyecto: number;
  Nombre_Proyecto: string;
  Estado_Proyecto: "En proceso" | "Terminado" | "Pendiente";
  Fecha_Inicio: string;
  creador_proyecto: ApiMiembroEquipo;
  numero_asignaciones: number;
  avance: number;
  equipo: ApiMiembroEquipo[];
}

// Tipo para una asignación individual devuelta por la API
export interface ApiAsignacionProyecto {
  ID_Asignacion: number;
  Titulo_Asignacion: string;
  Estado_Asignacion: 'Asignaciones' | 'En proceso' | 'Enviados' | 'Correcciones' | 'Terminados';
  Fecha_Creacion: string;
  Fecha_Entrega: string;
  Prioridad: "Alta" | "Media" | "Baja";
  usuarios_asignados: {
      ID_Usuario: number;
      Nombre_Usuario: string;
      Color: string;
  }[];
}

// Tipo para una asignación formateada para la UI
export interface AsignacionUI {
  id: string;
  nombre: string;
  usuariosAsignados: { id: string; nombre: string; color: string }[];
  fechaAsignacion: string;
  fechaEntrega: string;
  prioridad: "Alta" | "Media" | "Baja";
}

// Tipo para un proyecto formateado para la UI
export interface ProyectoUI {
  id: string;
  nombre: string;
  fechaInicio: string;
  estado: "En proceso" | "Terminado" | "Pendiente";
  avance: number;
  equipo: { id: string; nombre: string; color: string }[];
}

export interface NuevoProyectoForm {
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_termino: string;
  miembros: number[]; // Array de IDs de usuario (números)
}