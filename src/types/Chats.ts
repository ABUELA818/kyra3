export interface Participante {
  id: string
  nombre: string
  avatar?: string
  color: string
}

export interface Conversacion {
  id: string
  participante: Participante
  ultimoMensaje: string
  timestamp: string
  esGrupo?: boolean // Added esGrupo field to identify team chats
}

export interface Mensaje {
  id: string
  conversacionId: string
  emisorId: string
  emisorNombre: string
  receptorId: string
  contenido: string
  timestamp: string
  leido: boolean
}

export interface MessageData {
  fromUserId: string
  toUserId: string
  message: string
  timestamp: string
}

export interface TypingIndicatorData {
  userId: string
  isTyping: boolean
}
