"use client"

interface InboxSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function InboxSidebar({ isOpen, onClose }: InboxSidebarProps) {
  const notifications = [
    "Ignacio Varga te envió un documento",
    "Jose Torres te asignó nueva tarea",
    "Fernanda Perez te envió un mensaje",
  ]

  return (
    <>
      <div className={`inbox-overlay ${isOpen ? "active" : ""}`} onClick={onClose} />

      <div className={`inbox-sidebar ${isOpen ? "active" : ""}`}>
        <div className="inbox-header">
          <h2 className="inbox-title">INBOX</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="inbox-content">
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <div className="notification-dot"></div>
              <div className="notification-text">{notification}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
