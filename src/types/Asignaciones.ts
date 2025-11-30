// Interfaz para un miembro del equipo o usuario asignado
export interface Asignado {
  ID_Usuario: number
  Nombre_Usuario: string
  Correo: string
  Color: string
}

// Interfaz que coincide con la respuesta de tu API
export interface ApiAsignacion {
  ID_Asignacion: number
  Titulo_Asignacion: string
  Descripción_Asignacion: string
  Prioridad: "Alta" | "Media" | "Baja"
  Estado_Asignacion: "Asignaciones" | "En proceso" | "Enviados" | "Correcciones" | "Terminados"
  Fecha_Creacion: string
  Fecha_Entrega: string
  Nombre_Proyecto: string
  Nombre_Equipo: string
  creado_por: Asignado
  usuarios_asignados: Asignado[]
}

// Interfaz para un usuario que se puede asignar
export interface UsuarioAsignable {
  ID_Usuario: number
  Nombre_Usuario: string
}

// Interfaz para la respuesta de la API que obtiene las asignaciones creadas
export interface ApiAsignacionCreada {
  ID_Asignacion: number
  Titulo_Asignacion: string
  Descripción_Asignacion: string
  Prioridad: "Alta" | "Media" | "Baja"
  Estado_Asignacion: "Asignaciones" | "En proceso" | "Enviados" | "Correcciones" | "Terminados"
  Fecha_Creacion: string
  Fecha_Entrega: string
  creado_por: {
    ID_Usuario: number
    Nombre_Usuario: string
    Color: string
  }
  usuarios_asignados: {
    ID_Usuario: number
    Nombre_Usuario: string
    Correo: string
    Color: string
  }[]
}

// Interfaz para el formato que usan tus componentes de UI (más simple)
export interface AsignacionUI {
  id: number
  titulo: string
  descripcion: string
  estado: "Asignaciones" | "En proceso" | "Enviados" | "Correcciones" | "Terminados"
  fecha_inicio: string
  fecha_termino: string
  prioridad: "baja" | "media" | "alta"
  asignados: {
    nombre: string
    color?: string
  }[]
  autor: {
    nombre: string
    id?: number
  }
}

export interface AsignacionRecibidas {
  ID_Asignacion: number
  Titulo_Asignacion: string
  Fecha_Entrega: string
  Prioridad: "Alta" | "Media" | "Baja"
}

export interface NuevaAsignacion {
  titulo: string
  descripcion: string
  prioridad: "Alta" | "Media" | "Baja"
  fecha_inicio: string
  fecha_termino: string
  asignados: number[]
  archivos: File[]
}

export interface ArchivoAdjunto {
  ID_Archivo: number
  Nombre_Archivo: string
  Tamaño_Archivo: number
  Tipo_Archivo: string
  StorageKey: string
  Ruta: string
  Fecha_Subida: string
  subido_por: string
  tipo_adjunto: string
}

export interface HistorialItem {
  ID_Historial: number
  Estado_Anterior: string | null
  Estado_Nuevo: string
  Fecha_Cambio: string
  usuario_que_modifico: string
  usuario_color: string
}

// ... (Tus otros tipos de asignaciones)

// La interfaz para una asignación individual (para la lista de un proyecto)
export interface ApiAsignacionProyecto {
  ID_Asignacion: number
  Titulo_Asignacion: string
  Estado_Asignacion: string
  Fecha_Creacion: string
  Fecha_Entrega: string
  Prioridad: "Alta" | "Media" | "Baja"
  usuarios_asignados: {
    ID_Usuario: number
    Nombre_Usuario: string
    Color: string
  }[]
}

// La interfaz que usará tu UI en la tabla
export interface AsignacionUITable {
  id: string
  nombre: string
  usuariosAsignados: { id: string; nombre: string; color: string }[]
  fechaAsignacion: string
  fechaEntrega: string
  prioridad: "Alta" | "Media" | "Baja"
}
