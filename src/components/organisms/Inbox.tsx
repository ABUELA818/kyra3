"use client";

import { useState } from "react";
import { useInbox } from "@/context/inbox-context";
import "@/styles/Inbox.css";
import { Notificacion } from "@/types/Notificaciones";
import { marcarNotificacionComoVista } from "@/services/Notificaciones.service";

// Define the props the component receives
interface InboxProps {
  initialNotifications: Notificacion[];
}

export default function Inbox({ initialNotifications }: InboxProps) {
  const { isOpen, closeInbox } = useInbox();
  // Manage the notifications in the component's state
  const [notificaciones, setNotificaciones] = useState(initialNotifications);

  // Function to handle marking a notification as read
  const handleMarkAsRead = async (idNotificacion: number) => {
    try {
      // Call the API to update the status in the database
      await marcarNotificacionComoVista(idNotificacion);

      // Update the local state to reflect the change instantly in the UI
      setNotificaciones(
        notificaciones.map((noti) =>
          noti.ID_Notificacion === idNotificacion ? { ...noti, Visto: true } : noti
        )
      );
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  return (
    <>
      {isOpen && <div className="inbox-overlay" onClick={closeInbox} aria-hidden="true" />}

      <div className={`Inbox_Contenedor ${isOpen ? "inbox-open" : ""}`}>
        <div className="Inbox_Header">
          <h2 className="Inbox_Titulo">Notificaciones</h2>
          <button className="Inbox_Cerrar" onClick={closeInbox} aria-label="Cerrar inbox">×</button>
        </div>

        <div className="Inbox_Lista">
          {isOpen && notificaciones.map((noti) => (
            <div
              key={noti.ID_Notificacion}
              // Add a class for unread notifications and an onClick handler
              className={`Notificacion ${!noti.Visto ? "notificacion-no-leida" : ""}`}
              onClick={() => !noti.Visto && handleMarkAsRead(noti.ID_Notificacion)}
            >
              {/* Use the actual data from the API */}
              <h3 className="Notificacion_Titulo">{noti.Tipo_Noti}</h3>
              {/* You'll need to decide how to display the 'Detalles' JSON object */}
              <p className="Notificacion_Mensaje">{noti.Detalles?.message || 'Nueva actividad'}</p>
              <span className="Notificacion_Fecha">{new Date(noti.Fecha).toLocaleDateString()}</span>
            </div>
          ))}

          {isOpen && notificaciones.length === 0 && (
            <div className="Inbox_Vacio">
              <p>No tienes notificaciones</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}