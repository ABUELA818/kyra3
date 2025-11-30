export interface Usuario {
  ID_Usuario: number;
  Nombre_Usuario: string;
  Correo: string;
  ID_Rol: number;
  Rol?: string; // Opcional: El nombre del rol (ej: "Admin"), útil si lo unes en el backend.
  Color: string;
  Fecha_Creacion: string; // Las fechas se reciben como strings en formato ISO desde el JSON.
} 