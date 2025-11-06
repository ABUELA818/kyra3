"use client";
import { useEffect, useState } from "react";
import AsignacionesRecibidas from "@/components/organisms/Asignaciones_Recibidas";
import AsignacionDetalle from "@/components/organisms/Asignacion-Detalle";
import CrearAsignacion from "@/components/organisms/Crear_Asignacion";
import "@/styles/Asignados.css";

import { getAsignacionesEnviadasByCreador, createAsignacion, getHistorialDeAsignacion } from "@/services/Asignaciones.service";
import { getAllUsers } from "@/services/Usuarios.service";
import { ApiAsignacionCreada, AsignacionUI, HistorialItem } from "@/types/Asignaciones";
import { Usuario } from "@/types/Usuario";

function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "N/A";
  return new Date(fechaISO).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Asignados() {
  const [asignaciones, setAsignaciones] = useState<AsignacionUI[]>([]);
  const [usuariosDeApi, setUsuariosDeApi] = useState<Usuario[]>([]);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const idUsuarioActual = 2;

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const [dataAsignaciones, dataUsuarios] = await Promise.all([
        getAsignacionesEnviadasByCreador(idUsuarioActual),
        getAllUsers()
      ]);

      const asignacionesFormateadas: AsignacionUI[] = dataAsignaciones.map((item: ApiAsignacionCreada) => ({
        id: item.ID_Asignacion,
        titulo: item.Titulo_Asignacion,
        descripcion: item.Descripción_Asignacion,
        estado: item.Estado_Asignacion,
        fecha_inicio: formatearFecha(item.Fecha_Creacion),
        fecha_termino: formatearFecha(item.Fecha_Entrega),
        prioridad: (item.Prioridad || "baja").toLowerCase() as AsignacionUI["prioridad"],
        asignados: item.usuarios_asignados?.map(user => ({
          nombre: user.Nombre_Usuario,
          color: user.Color,
        })) || [],
        autor: { nombre: item.creado_por.Nombre_Usuario },
      }));

      setAsignaciones(asignacionesFormateadas);
      setUsuariosDeApi(dataUsuarios);

      if (asignacionesFormateadas.length > 0 && !asignacionSeleccionada) {
        setAsignacionSeleccionada(asignacionesFormateadas[0].id);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const manejarCrearAsignacion = async (nuevaAsignacion: any) => {
    try {
      const datosParaAPI = {
        Titulo_Asignacion: nuevaAsignacion.titulo,
        Descripción_Asignacion: nuevaAsignacion.descripcion,
        Prioridad: nuevaAsignacion.prioridad,
        Fecha_Creacion: nuevaAsignacion.fecha_inicio,
        Fecha_Entrega: nuevaAsignacion.fecha_termino,
        ID_Proyecto: nuevaAsignacion.id_proyecto,
        Creado_Por: idUsuarioActual,
        usuarios: nuevaAsignacion.asignados,
        archivos: [],
      };
      await createAsignacion(datosParaAPI);
      fetchDatos();
    } catch (error) {
      console.error("Error al crear la asignación:", error);
    }
  };

  const asignacionActual = asignaciones.find((a) => a.id === asignacionSeleccionada);

  if (loading) {
    return <div className="loading-container"><p>Cargando asignaciones...</p></div>;
  }

  const usuariosParaFormulario = usuariosDeApi.map(user => ({
    id: user.ID_Usuario,
    nombre: user.Nombre_Usuario
  }));

  return (
    <div className="asignados-container">
      <div className="asignados-content">
        <AsignacionesRecibidas
          asignaciones={asignaciones}
          asignacionSeleccionada={asignacionSeleccionada}
          onSeleccionarAsignacion={setAsignacionSeleccionada}
        />
        <div className="asignados-main">
          <div className="asignacion-detalle-container">
            {asignacionActual ? (
              <AsignacionDetalle asignacion={asignacionActual} estilo="grid" tamaño={95} tamaño2={95} historial={historial} loadingHistorial={loadingHistorial}/>
            ) : (
              <div className="sin-seleccion">
                <p>No hay asignaciones para mostrar.</p>
              </div>
            )}
            {/* CAMBIO 4: Pasamos los datos ya transformados al componente hijo. */}
            <CrearAsignacion 
              onCrearAsignacion={manejarCrearAsignacion} 
              usuarios={usuariosParaFormulario} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 