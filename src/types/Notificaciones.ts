export interface Notificacion {
  ID_Notificacion: number;
  ID_Usuario: number;
  Tipo_Noti: string;
  Detalles: any; // 'any' is fine, or you can define a more specific type for the details JSON
  Visto: boolean;
  Fecha: string; // Dates are sent as strings in JSON
}