"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Home } from "lucide-react"
import { Pencil, Folder } from "lucide-react"

// Componentes
import Barra_Busqueda from "@/components/molecules/Barra_Busqueda"
import Miembros_Equipos from "@/components/molecules/Miembros_Equipo"
import Tabla from "@/components/organisms/Tablas"
import Subir_Archivos from "@/components/organisms/Subir_Archivo"
import Crear_Carpeta from "@/components/organisms/Crear_Carpetas"
import Invitar_Miembro from "@/components/organisms/Invitar_Miembro"
import NombreIcono from "@/components/atoms/Nombre_Icono"
import Boton_Accion from "@/components/atoms/Boton_Accion"
import Barra_Acciones from "@/components/molecules/Barra_Acciones"
import ChatMensajes from "@/components/organisms/Chat-Mensajes"
import "@/styles/Equipos.css"

// Servicios y Tipos
import { getMiembrosDeEquipo, updateRolMiembro, deleteMiembroDeEquipo, getEquipoById } from "@/services/Equipos.service"
import { getContenidoCarpeta, createCarpeta, getRutaCarpeta } from "@/services/Carpetas.service"
import {
  searchArchivos,
  addFavorito,
  updateArchivoNombre,
  deleteArchivo,
  downloadArchivo,
} from "@/services/Archivos.service"
import { obtenerConversacionGrupo } from "@/services/Chats.service"
import type { MiembroEquipo, ArchivoEquipo, CarpetaEquipo, RutaItem, SearchFilters } from "@/types/Equipos"
import { useUser } from "@/context/userContext"

function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "N/A"
  return new Date(fechaISO).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export default function Equipos() {
  const { usuario } = useUser()
  const idUsuarioActual = usuario?.id || 1

  const params = useParams()
  const idEquipo = Number(params.Equipos)

  const [nombreEquipo, setNombreEquipo] = useState<string>("")
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([])
  const [archivos, setArchivos] = useState<ArchivoEquipo[]>([])
  const [carpetas, setCarpetas] = useState<CarpetaEquipo[]>([])
  const [carpetaActualId, setCarpetaActualId] = useState<number | null>(null)
  const [rutaNavegacion, setRutaNavegacion] = useState<RutaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const [showSubirArchivo, setShowSubirArchivo] = useState(false)
  const [showCrearCarpeta, setShowCrearCarpeta] = useState(false)
  const [showInvitarMiembro, setShowInvitarMiembro] = useState(false)

  const [chatEquipoId, setChatEquipoId] = useState<string | null>(null)
  const [nombreChatEquipo, setNombreChatEquipo] = useState<string>("")

  const rolUsuarioActual = miembros.find((m) => m.ID_Usuario === idUsuarioActual)?.Rol_equipo || "Miembro"
  const puedeModificarRoles = rolUsuarioActual === "Creador" || rolUsuarioActual === "Admin"

  const fetchDatos = useCallback(
    async (idCarpeta: number | null) => {
      if (!idEquipo) return
      setLoading(true)
      try {
        const [dataMiembros, dataContenido, dataRuta, dataEquipo] = await Promise.all([
          getMiembrosDeEquipo(idEquipo),
          getContenidoCarpeta(idEquipo, idCarpeta, idUsuarioActual),
          idCarpeta ? getRutaCarpeta(idCarpeta) : Promise.resolve([]),
          getEquipoById(idEquipo),
        ])
        setMiembros(dataMiembros)
        setNombreEquipo(dataEquipo.Nombre_Equipo)
        const archivosConFavorito = dataContenido.archivos.map((archivo) => ({
          ...archivo,
          is_favorito: archivo.is_favorito ?? false,
        }))
        setArchivos(archivosConFavorito)
        setCarpetas(dataContenido.carpetas)
        setRutaNavegacion(dataRuta)
      } catch (error) {
        console.error("Error al cargar datos del equipo:", error)
      } finally {
        setLoading(false)
      }
    },
    [idEquipo, idUsuarioActual],
  )

  const cargarChatEquipo = useCallback(async (id: number) => {
    try {
      const chat = await obtenerConversacionGrupo(id)
      if (chat) {
        setChatEquipoId(chat.id?.toString())
        setNombreChatEquipo(chat.nombre || "Chat del Equipo")
      }
    } catch (error) {
      console.error("Error al cargar chat del equipo:", error)
    }
  }, [])

  useEffect(() => {
    if (idEquipo) {
      cargarChatEquipo(idEquipo)
    }
  }, [idEquipo, cargarChatEquipo])

  useEffect(() => {
    fetchDatos(carpetaActualId)
  }, [idEquipo, carpetaActualId, fetchDatos])

  const handleRoleChange = async (userId: number, newRole: "Admin" | "Miembro") => {
    if (!puedeModificarRoles) {
      alert("No tienes permisos para modificar roles. Solo el Creador o Administradores pueden hacerlo.")
      return
    }

    try {
      await updateRolMiembro(idEquipo, userId, newRole, idUsuarioActual)
      setMiembros(miembros.map((m) => (m.ID_Usuario === userId ? { ...m, Rol_equipo: newRole } : m)))
      alert("Rol actualizado con éxito")
    } catch (error) {
      console.error("Error al cambiar el rol:", error)
      alert(error instanceof Error ? error.message : "No se pudo actualizar el rol.")
    }
  }

  const handleDeleteMember = async (userId: number) => {
    if (!puedeModificarRoles) {
      alert("No tienes permisos para eliminar miembros. Solo el Creador o Administradores pueden hacerlo.")
      return
    }

    if (window.confirm("¿Estás seguro de que quieres eliminar a este miembro del equipo?")) {
      try {
        await deleteMiembroDeEquipo(idEquipo, userId, idUsuarioActual)
        setMiembros(miembros.filter((m) => m.ID_Usuario !== userId))
        alert("Miembro eliminado con éxito.")
      } catch (error) {
        console.error("Error al eliminar al miembro:", error)
        alert(error instanceof Error ? error.message : "No se pudo eliminar al miembro.")
      }
    }
  }

  const handleCrearCarpeta = async (nombreCarpeta: string) => {
    try {
      await createCarpeta({
        Nombre_Carpeta: nombreCarpeta,
        ID_Equipo: idEquipo,
        Carpeta_Origen: carpetaActualId,
      })
      setShowCrearCarpeta(false)
      await fetchDatos(carpetaActualId)
    } catch (error) {
      console.error("Error al crear la carpeta:", error)
      alert("No se pudo crear la carpeta.")
    }
  }

  const handleSearch = async (query: string, filtros: SearchFilters) => {
    if (!query && Object.keys(filtros).length === 0) {
      handleRefresh()
      return
    }
    setIsSearching(true)
    setLoading(true)
    try {
      const resultados = await searchArchivos(idEquipo, { q: query, ...filtros })
      setArchivos(resultados)
      setCarpetas([])
    } catch (error) {
      console.error("Error en la búsqueda:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setIsSearching(false)
    fetchDatos(carpetaActualId)
  }

  const handleToggleFavorito = async (archivo: ArchivoEquipo) => {
    try {
      setArchivos(
        archivos.map((a) => (a.ID_Archivo === archivo.ID_Archivo ? { ...a, is_favorito: !a.is_favorito } : a)),
      )
      // Luego hacemos la llamada a la API
      await addFavorito(idUsuarioActual, archivo.ID_Archivo)
    } catch (error) {
      console.error("Error al actualizar favorito:", error)
      // Si hay error, revertimos el cambio local
      setArchivos(
        archivos.map((a) => (a.ID_Archivo === archivo.ID_Archivo ? { ...a, is_favorito: !a.is_favorito } : a)),
      )
      alert("No se pudo actualizar el estado de favorito.")
    }
  }

  const handleDownloadArchivo = async (archivo: ArchivoEquipo) => {
    try {
      await downloadArchivo(archivo.ID_Archivo, archivo.Nombre_Archivo)
    } catch (error) {
      console.error("Error al descargar archivo:", error)
      alert("No se pudo descargar el archivo.")
    }
  }

  const handleDeleteArchivo = async (archivo: ArchivoEquipo) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${archivo.Nombre_Archivo}"?`)) {
      try {
        await deleteArchivo(archivo.ID_Archivo)
        setArchivos(archivos.filter((a) => a.ID_Archivo !== archivo.ID_Archivo))
        alert("Archivo eliminado con éxito.")
      } catch (error) {
        console.error("Error al eliminar archivo:", error)
        alert("No se pudo eliminar el archivo.")
      }
    }
  }

  const handleRenameArchivo = async (archivo: ArchivoEquipo) => {
    const nuevoNombre = prompt("Ingresa el nuevo nombre para el archivo:", archivo.Nombre_Archivo)

    if (nuevoNombre && nuevoNombre !== archivo.Nombre_Archivo) {
      try {
        await updateArchivoNombre(archivo.ID_Archivo, nuevoNombre)

        setArchivos(
          archivos.map((a) => (a.ID_Archivo === archivo.ID_Archivo ? { ...a, Nombre_Archivo: nuevoNombre } : a)),
        )

        alert("Archivo renombrado con éxito.")
      } catch (error) {
        console.error("Error al renombrar:", error)
        alert("No se pudo renombrar el archivo.")
      }
    }
  }

  const datosMiembros = miembros.map((miembro) => [
    <NombreIcono key={miembro.ID_Usuario} nombre={miembro.Nombre_Usuario} color={miembro.Color} />,
    miembro.Rol_equipo === "Creador" ? (
      <span key={`${miembro.ID_Usuario}-rol`} className="rol-badge creador">
        Creador
      </span>
    ) : puedeModificarRoles ? (
      <Boton_Accion
        key={`${miembro.ID_Usuario}-accion`}
        currentRole={miembro.Rol_equipo as "Admin" | "Miembro"}
        onRoleChange={(role) => handleRoleChange(miembro.ID_Usuario, role)}
        onDeleteClick={() => handleDeleteMember(miembro.ID_Usuario)}
      />
    ) : (
      <span key={`${miembro.ID_Usuario}-rol`} className="rol-badge">
        {miembro.Rol_equipo === "Admin" ? "Administrador" : "Miembro"}
      </span>
    ),
  ])

  const obtenerTipoArchivo = (nombreArchivo: string): string => {
    const extension = nombreArchivo.split(".").pop()?.toLowerCase()
    return extension ? extension.toUpperCase() : "DESCONOCIDO"
  }

  const datosTabla = [
    ...carpetas.map((carpeta) => [
      <div
        key={`c-${carpeta.ID_Carpeta}`}
        className="nombre-carpeta"
        onClick={() => setCarpetaActualId(carpeta.ID_Carpeta)}
      >
        <Folder />
        {carpeta.Nombre_Carpeta}
      </div>,
      "-",
      "-",
      "-",
      "Carpeta",
      <div className="Barra_Acciones" style={{ display: "flex" }} key={`a-${carpeta.ID_Carpeta}`}>
        <button title="Renombrar Carpeta">
          <Pencil size={17} />
        </button>
      </div>,
    ]),
    ...archivos.map((archivo) => [
      <Link
        key={`archivo-link-${archivo.ID_Archivo}`}
        href={`/Archivos/${archivo.ID_Archivo}`}
        className="archivo-link"
        title={archivo.Nombre_Archivo}
      >
        {archivo.Nombre_Archivo}
      </Link>,
      <NombreIcono
        key={archivo.ID_Archivo + "-propietario"}
        nombre={archivo.propietario ?? "Desconocido"}
        color={"#888"}
      />,
      formatearFecha(archivo.Fecha_Subida),
      `${(archivo.Tamaño_Archivo / 1024 / 1024).toFixed(2)} MB`,
      obtenerTipoArchivo(archivo.Nombre_Archivo),
      <Barra_Acciones
        key={`barra-${archivo.ID_Archivo}`}
        archivo={archivo}
        Estilo="flex"
        IconTamaño={17}
        onEditClick={() => handleRenameArchivo(archivo)}
        onFavoriteClick={() => handleToggleFavorito(archivo)}
        onDownloadClick={() => handleDownloadArchivo(archivo)}
        onDeleteClick={() => handleDeleteArchivo(archivo)}
      />,
    ]),
  ]

  const carpetaPadreId =
    rutaNavegacion.length > 0 ? (rutaNavegacion[rutaNavegacion.length - 2]?.ID_Carpeta ?? null) : null

  if (loading && miembros.length === 0)
    return (
      <div className="loading-container">
        <p>Cargando equipo...</p>
      </div>
    )

  return (
    <div className="Equipos_Contenedor">
      <div className="Barra_Busqueda">
        <Barra_Busqueda
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          miembros={miembros}
          idUsuarioActual={idUsuarioActual}
          teamName={nombreEquipo}
        />
      </div>
      <div className="Equipos_Contenido">
        <div className="Equipos_Medio">
          <div className="Equipos_Chat">
            {chatEquipoId ? (
              <ChatMensajes
                conversacionId={chatEquipoId}
                participante={{
                  id: "null",
                  nombre: nombreChatEquipo,
                  color: "#6366f1",
                }}
                usuarioActualId={idUsuarioActual?.toString() || "1"}
                usuarioActualNombre={usuario?.nombre || "Usuario"}
              />
            ) : (
              <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                <h1>Chat de Equipo</h1>
                <p>Cargando chat...</p>
              </div>
            )}
          </div>
          <div className="Equipos_Miembros">
            <div className="Equipos_Miembros_Titulo">
              <h1>Miembros</h1>
              <button
                className="Agregar_Miembro"
                onClick={() => setShowInvitarMiembro(true)}
                disabled={!puedeModificarRoles}
                title={
                  !puedeModificarRoles
                    ? "Solo el Creador o Administradores pueden invitar miembros"
                    : "Invitar nuevo miembro"
                }
              >
                +
              </button>
            </div>
            <Miembros_Equipos Miembros={datosMiembros} />
          </div>
        </div>

        <div className="Btns_rutas">
          <div className="Equipos_Btns">
            <button onClick={() => setShowSubirArchivo(true)}>Subir Archivo</button>
            <button onClick={() => setShowCrearCarpeta(true)}>Crear Carpeta</button>
          </div>
          
          {!isSearching && (
            <div className="navegacion-carpetas">
              <div className="breadcrumbs-container">
                <button
                  className="breadcrumb-home-button"
                  onClick={() => setCarpetaActualId(null)}
                  title="Ir a la raíz"
                >
                  <Home size={20} />
                </button>

                <div className="breadcrumbs">
                  {rutaNavegacion.map((ruta, index) => (
                    <div key={ruta.ID_Carpeta} className="breadcrumb-item-wrapper">
                      <span className="breadcrumb-chevron">
                       /
                      </span>
                      <button
                        className={`breadcrumb-item ${index === rutaNavegacion.length - 1 ? "active" : ""}`}
                        onClick={() => setCarpetaActualId(ruta.ID_Carpeta)}
                      >
                        {ruta.Nombre_Carpeta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          </div>

        <div>
          <Tabla
            columnas={["Nombre", "Propietario", "Fecha", "Tamaño", "Tipo", ""]}
            datos={datosTabla}
            TletraDatos={14}
            TletraEncabezado={20}
            AlturaMaxima={50}
            TaFila={10}
            AlturaMinima={40}
          />
        </div>

        {showSubirArchivo && (
          <Subir_Archivos
            onClose={() => setShowSubirArchivo(false)}
            idEquipo={idEquipo}
            carpetaActualId={carpetaActualId}
            onArchivoSubido={() => fetchDatos(carpetaActualId)}
          />
        )}
        {showCrearCarpeta && <Crear_Carpeta onClose={() => setShowCrearCarpeta(false)} onCrear={handleCrearCarpeta} />}
        {showInvitarMiembro && (
          <Invitar_Miembro
            onClose={() => setShowInvitarMiembro(false)}
            miembrosActuales={miembros}
            idEquipo={idEquipo}
            onMiembroInvitado={() => fetchDatos(carpetaActualId)}
          />
        )}
      </div>
    </div>
  )
}
