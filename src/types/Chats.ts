export interface Participante {
  id: string;
  nombre: string;
  avatar?: string;
  color: string;
}

export interface Conversacion {
  id: string;
  participante: Participante;
  ultimoMensaje: string;
  timestamp: string;
}
