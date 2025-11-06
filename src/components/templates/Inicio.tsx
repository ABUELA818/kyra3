"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/context/userContext"
import Notas from "../molecules/Notas"
import AsigRecibidas from "../molecules/Asignaciones_Recibidas"
import Tabla from "../organisms/Tablas"
import "../../styles/Inicio.css"
import Barra_Porcentaje from "../molecules/Barra-Porcentaje"
import { EquipoIconos } from "../molecules/Equipo-Iconos"
import TextLink from "../atoms/text-links"

import { getProyectosByUsuario } from "@/services/proyectos.service"
import type { Proyecto } from "@/types/Inicio"

import { getNotasByUsuario } from "@/services/notas.service"
import type { Nota } from "@/types/Notas"

import { getAsignacionesByUsuario } from "@/services/Asignaciones.service"
import type { AsignacionRecibidas } from "@/types/Asignaciones"

export default function Inicio() {
  const { usuario } = useUser()

  console.log(usuario?.id);

  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [notas, setNotas] = useState<Nota[]>([])
  const [asignaciones, setAsignaciones] = useState<AsignacionRecibidas[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!usuario?.id) return

      setLoading(true)
      try {
        const [proyectosData, notasData, asignacionesData] = await Promise.all([
          getProyectosByUsuario(usuario.id),
          getNotasByUsuario(usuario.id),
          getAsignacionesByUsuario(usuario.id),
        ])

        setProyectos(proyectosData)
        setNotas(notasData)
        setAsignaciones(asignacionesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [usuario?.id])

  if (loading) {
    return (
      <div className="Contenedor_Pagina_Inicio">
        <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>
      </div>
    )
  }

  const columnas = ["Nombre", "Asignaciones", "Avance", "Fecha de Inicio", "Equipo", "Estado"]

  const datos = proyectos.map((proyecto) => [
    <TextLink
      key={proyecto.ID_Proyecto}
      href={`/proyecto/${proyecto.ID_Proyecto}`}
      Texto={proyecto.Nombre_Proyecto}
      color="#000000ff"
      TamañoLetra={15}
    />,
    `${proyecto.numero_asignaciones} tareas`,
    <Barra_Porcentaje key={proyecto.ID_Proyecto + "-barra"} porcentaje={proyecto.avance} />,
    new Date(proyecto.Fecha_Inicio).toLocaleDateString(),
    <EquipoIconos
      key={proyecto.ID_Proyecto + "-equipo"}
      integrantes={proyecto.equipo.map((miembro) => ({
        nombre: miembro.Nombre_Usuario,
        src: `/perfil/${miembro.ID_Usuario}`,
        Imagen: "",
        color: miembro.Color,
      }))}
    />,
    proyecto.Estado_Proyecto,
  ])

  return (
    <div className="Contenedor_Pagina_Inicio">
      <div className="Seccion_Superior_Inicio">
        <div className="Contenedor_Notas_Inicio">
          <Notas initialNotes={notas} idUsuario={usuario?.id || 0} />
        </div>
        <div className="Contenedor_Asignaciones_Inicio">
          <AsigRecibidas asignaciones={asignaciones} />
        </div>
      </div>
      <div className="Seccion_Inferior_Inicio">
        <h1>Mis proyectos</h1>
        {proyectos.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>No tienes proyectos</div>
        ) : (
          <Tabla columnas={columnas} datos={datos} TletraDatos={15} TletraEncabezado={20} AlturaMaxima={30} />
        )}
      </div>
    </div>
  )
}
