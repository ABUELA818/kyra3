"use client"

import { useState } from "react"
import "@/styles/Chats.css"
import ChatsRecibidos from "@/components/organisms/Chats_Recibidos"
import type { Conversacion } from "@/types/Chats"

const chatsEjemplo: Conversacion[] = [
  {
    id: "1",
    participante: {
      id: "user-1",
      nombre: "Manuel Reyes",
      avatar: undefined,
      color: "#3b82f6"
    },
    ultimoMensaje: "Perfecto, lo reviso y te comento...",
    timestamp: "2025-10-03T10:30:00Z",
  },
  {
    id: "2",
    participante: {
      id: "user-2",
      nombre: "Fernanda López",
      avatar: undefined,
      color: "#ef4444"
    },
    ultimoMensaje: "Ya están listos los diseños para el proyecto.",
    timestamp: "2025-10-03T09:15:00Z",
  },
  {
    id: "3",
    participante: {
      id: "user-3",
      nombre: "Equipo de Diseño",
      avatar: undefined,
      color: "#10b981"
    },
    ultimoMensaje: "Recuerden la reunión de hoy a las 4 PM.",
    timestamp: "2025-10-02T15:00:00Z",
  }
];

export default function ChatsPage() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(chatsEjemplo)
  const [chatSeleccionadoId, setChatSeleccionadoId] = useState<string | null>("1")
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const chatActual = conversaciones.find((c) => c.id === chatSeleccionadoId)

  const conversacionesFiltradas = conversaciones.filter(chat => 
    chat.participante.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="Chats_Contenedor">
      <div className="Chats_Contenido">
        <ChatsRecibidos
          conversaciones={conversacionesFiltradas}
          chatSeleccionadoId={chatSeleccionadoId}
          onSeleccionarConversacion={setChatSeleccionadoId}
          valorBusqueda={terminoBusqueda}
          onBusquedaChange={setTerminoBusqueda}
        />

        <div className="Chat_Principal">
          <div className="Chat_Vista_Mensajes">
            {chatActual ? (
              <div>
                <h2>Mensajes con {chatActual.participante.nombre}</h2>
                {/* Aquí iría el componente que renderiza los mensajes */}
              </div>
            ) : (
              <div className="Sin_Seleccion">
                <p>Selecciona una conversación para ver los mensajes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

