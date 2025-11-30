"use client"

import { useState, useEffect } from "react"
import "@/styles/Chats.css"
import ChatsRecibidos from "@/components/organisms/Chats_Recibidos"
import ChatMensajes from "@/components/organisms/Chat-Mensajes"
import type { Conversacion, Participante } from "@/types/Chats"
import { useUser } from "@/context/userContext"
import { obtenerConversaciones, crearConversacion } from "@/services/Chats.service"

export default function ChatsPage() {
  const { usuario } = useUser()
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([])
  const [chatSeleccionadoId, setChatSeleccionadoId] = useState<string | null>(null)
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChats = async () => {
      if (!usuario?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await obtenerConversaciones(usuario.id)
        setConversaciones(data)
        setChatSeleccionadoId(null)
      } catch (error) {
        console.error("Error al cargar chats:", error)
        setConversaciones([])
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [usuario?.id])

  const chatActual = conversaciones.find((c) => c.id === chatSeleccionadoId)

  const conversacionesFiltradas = conversaciones.filter((chat) => {
    if (!chat?.participante?.nombre) return false
    return chat.participante.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  })

  const handleNuevaConversacion = async (participante: Participante) => {
    if (!usuario?.id) return

    try {
      const nuevaConversacion = await crearConversacion(usuario.id, participante.id)

      const conversacionNueva: Conversacion = {
        id: nuevaConversacion.id,
        participante: participante,
        ultimoMensaje: "Conversación iniciada",
        timestamp: new Date().toISOString(),
      }

      setConversaciones([conversacionNueva, ...conversaciones])
      setChatSeleccionadoId(nuevaConversacion.id)
      setTerminoBusqueda("")
    } catch (error) {
      console.error("Error al crear conversación:", error)
    }
  }

  const handleMensajeEnviado = (conversacionId: string, nuevoMensaje: string, timestamp: string) => {
    setConversaciones((prev) => {
      const chatIndex = prev.findIndex((c) => c.id === conversacionId)
      if (chatIndex === -1) return prev

      const chat = prev[chatIndex]
      const chatActualizado: Conversacion = {
        ...chat,
        ultimoMensaje: nuevoMensaje,
        timestamp: timestamp,
      }

      // Remove the chat from its current position and add it to the top
      const nuevasConversaciones = prev.filter((_, i) => i !== chatIndex)
      return [chatActualizado, ...nuevasConversaciones]
    })
  }

  if (loading) {
    return (
      <div className="Chats_Contenedor">
        <div className="Chats_Contenido">
          <div className="Mensajes_Recibidos">
            <div className="Mensajes_Recibidos_Titulo">Chats</div>
            <p style={{ padding: "20px", textAlign: "center", color: "#666" }}>Cargando chats...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="Chats_Contenedor">
      <div className="Chats_Contenido">
        <ChatsRecibidos
          conversaciones={conversacionesFiltradas}
          chatSeleccionadoId={chatSeleccionadoId}
          onSeleccionarConversacion={setChatSeleccionadoId}
          valorBusqueda={terminoBusqueda}
          onBusquedaChange={setTerminoBusqueda}
          usuarioActualId={usuario?.id || ""}
          onNuevaConversacion={handleNuevaConversacion}
        />

        <div className="Chat_Principal">
          <div className="Chat_Vista_Mensajes">
            {chatActual && usuario ? (
              <ChatMensajes
                conversacionId={chatActual.id}
                participante={chatActual.participante}
                usuarioActualId={usuario.id}
                usuarioActualNombre={usuario.nombre}
                onMensajeEnviado={handleMensajeEnviado}
              />
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
