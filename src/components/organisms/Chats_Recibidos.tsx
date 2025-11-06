"use client"

import type { Conversacion } from "@/types/Chats"
import Icono_Perfil from "../atoms/Icono-Perfil"


interface ChatsRecibidosProps {
  conversaciones: Conversacion[]
  chatSeleccionadoId: string | null
  onSeleccionarConversacion: (id: string) => void
  valorBusqueda: string
  onBusquedaChange: (valor: string) => void
}
 
export default function ChatsRecibidos({
  conversaciones,
  chatSeleccionadoId,
  onSeleccionarConversacion,
  valorBusqueda,
  onBusquedaChange
}: ChatsRecibidosProps) {
  
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString("es-ES", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
 
  return (
    <div className="Mensajes_Recibidos">
      <div className="Mensajes_Recibidos_Titulo">Chats</div>
      
      <div className="Input_Busqueda_Contenedor">
        <input 
          type="text"
          placeholder="Buscar o empezar una nueva conversación"
          className="Input_Busqueda"
          value={valorBusqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>

      <div className="Mensajes_Lista">
        {conversaciones.map((chat) => (
          <div
            key={chat.id}
            className={`Chat_Item ${chatSeleccionadoId === chat.id ? "seleccionada" : ""}`}
            onClick={() => onSeleccionarConversacion(chat.id)}
          >
            <div className="Mensaje_Autor">
              <Icono_Perfil Nombre={chat.participante.nombre} color={chat.participante.color}/>
              <span className="Autor_Nombre">{chat.participante.nombre}</span>
            </div>
            <div className="Mensaje_Contenido">
              <p className="Mensaje_Texto">{chat.ultimoMensaje}</p>
              <span className="Mensaje_Fecha">{formatearFecha(chat.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}