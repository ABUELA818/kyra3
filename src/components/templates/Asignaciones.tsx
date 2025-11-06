"use client";
import { useEffect, useState } from "react";
import AsignacionesApartados from "@/components/molecules/Asignaciones-Apartados";
import AsignacionDetalle from "@/components/organisms/Asignacion-Detalle";
import "@/styles/Asignaciones.css";

import { getAsignacionesByUsuario, getHistorialDeAsignacion } from "@/services/Asignaciones.service";
import { ApiAsignacion, AsignacionUI, HistorialItem } from "@/types/Asignaciones";

function formatearFecha(fechaISO: string) {
  if (!fechaISO) return "Sin fecha";
  return new Date(fechaISO).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function Asignaciones() {
  const [seleccionada, setSeleccionada] = useState<AsignacionUI | null>(null);
  const [asignaciones, setAsignaciones] = useState<AsignacionUI[]>([]);
  const [loading, setLoading] = useState(true);

  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const idUsuario = 3;

  useEffect(() => {
    async function fetchAsignaciones() {
      try {
        setLoading(true);
        const data: ApiAsignacion[] = await getAsignacionesByUsuario(idUsuario);
        console.log("AQUIIIIIIIIIIIIIIIIII ",{data});

        const asignacionesFormateadas: AsignacionUI[] = data.map((item) => ({
          id: item.ID_Asignacion,
          titulo: item.Titulo_Asignacion,
          prioridad: (item.Prioridad || "baja").toLowerCase() as AsignacionUI["prioridad"],
          fecha_inicio: formatearFecha(item.Fecha_Creacion),
          fecha_termino: formatearFecha(item.Fecha_Entrega),
          estado: item.Estado_Asignacion,
          asignados: item.usuarios_asignados
            ? item.usuarios_asignados.map((user) => ({
                nombre: user.Nombre_Usuario,
                color: user.Color || "#ccc",
              }))
            : [],
          descripcion: item.Descripción_Asignacion,
          autor: { nombre: item.creado_por.Nombre_Usuario },
        }));

        setAsignaciones(asignacionesFormateadas);
      } catch (error) {
        console.error("Error cargando asignaciones:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAsignaciones();
  }, [idUsuario]);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!seleccionada) {
        setHistorial([]); // Limpia el historial si no hay nada seleccionado
        return;
      }
      try {
        setLoadingHistorial(true);
        const dataHistorial = await getHistorialDeAsignacion(seleccionada.id);
        setHistorial(dataHistorial);
      } catch (error) {
        console.error("Error cargando el historial:", error);
      } finally {
        setLoadingHistorial(false);
      }
    };

    fetchHistorial();
  }, [seleccionada]); // Se ejecuta cuando 'seleccionada' cambia

  if (loading) {
    return <p>Cargando asignaciones...</p>;
  }

  if (loading) {
    return <p>Cargando asignaciones...</p>;
  }

  return (
    <div className="Pantalla_Asignaciones_Contenedor">
      <div className="Asignaciones_estados">
        {["Asignaciones", "En proceso", "Enviados", "Correcciones", "Terminados"].map(
          (estado) => {
            const asignacionesFiltradas = asignaciones.filter(
              (a) => a.estado === estado
            );
            return (
              <AsignacionesApartados
                key={estado}
                Estado={estado as AsignacionUI["estado"]}
                NumAsig={asignacionesFiltradas.length}
                Asignacion={asignacionesFiltradas}
                onSelectAsignacion={setSeleccionada}
              />
            );
          }
        )}
      </div>

      <div className="Asignaciones_detalle">
        {seleccionada ? (
          <AsignacionDetalle 
            asignacion={seleccionada} 
            historial={historial}
            loadingHistorial={loadingHistorial}
            estilo="flex" 
            tamaño={59} 
            tamaño2={38}
          />
        ) : (
          <div className="detalle-vacio">
            <p>Selecciona una asignación para ver el detalle</p>
          </div>
        )}
      </div>
    </div>
  );
}