import { AsignacionUI, HistorialItem } from "@/types/Asignaciones";
import BarraPrioridad from "../atoms/Barra-prioridad";
import "@/styles/Asignacion_Detalle.css";
import { EquipoIconos } from "../molecules/Equipo-Iconos";

interface DetalleProps {
  asignacion: AsignacionUI;
  historial: HistorialItem[];
  loadingHistorial: boolean;
  estilo: string;
  tamaño: number;
  tamaño2: number;
}

const generarMensajeHistorial = (item: HistorialItem): string => {
  switch (item.Estado_Nuevo) {
    case "En_Progreso":
      return "comenzó a trabajar en la tarea.";
    case "Enviados":
      return "envió la tarea para revisión.";
    case "Aceptada": 
      return "revisó y aceptó la tarea.";
    case "Correcciones":
      return "rechazó la tarea y solicitó correcciones.";
    case "Terminados":
        return "marcó la tarea como terminada.";
    default:
      return `cambió el estado a ${item.Estado_Nuevo}.`;
  }
};

export default function AsignacionDetalle({ tamaño2, tamaño, estilo, asignacion, historial, loadingHistorial }: DetalleProps) {
  const eventoCreacion = {
    usuario_que_modifico: asignacion.autor.nombre,
    Fecha_Cambio: asignacion.fecha_inicio,
    mensaje: "asignó esta tarea.",
  };
  
  return (
    <div className="Asignaciones_detalladas" style={{display: estilo}}>

      <div className="Asignacion_Informacion" style={{width: `${tamaño}%`}}>
        <div className="Asignacion_Info">
          <h2>{asignacion.titulo}</h2>
          <div className="Asignaciones_detalle_info">
            <div className="Asignaciones_detalle_info1">
              <p>Estado: {asignacion.estado}</p>
              <p>Fechas: {asignacion.fecha_inicio} - {asignacion.fecha_termino}</p>
            </div>
            <div className="Asignaciones_detalle_info2">
              <div className="Asignaciones_detalle_infoA"><p>Asignados </p> <EquipoIconos integrantes={asignacion.asignados} /></div>
              <div className="Asignaciones_detalle_infoP"><p>Prioridad:</p><BarraPrioridad Prioridad={asignacion.prioridad} ancho={"25px"} alto={"25px"}/> {asignacion.prioridad}</div>
            </div>
          </div>
        </div>
 
        <div className="Asignaciones_detalle_descripcion">
          <h3>Descripción</h3>
          <p>{asignacion.descripcion}</p>
        </div>
      </div>

      <div className="Asignaciones_Historial" style={{width: `${tamaño2}%`}}>
        <h3>Actividad</h3>
        {loadingHistorial ? (
          <p>Cargando actividad...</p>
        ) : (
          <ul>
            {/* Mapeamos el historial real */}
            {historial.map((item) => (
              <li key={item.ID_Historial}>
                <strong>{item.usuario_que_modifico}</strong> {generarMensajeHistorial(item)}
                <span className="fecha-historial"> — {new Date(item.Fecha_Cambio).toLocaleDateString()}</span>
              </li>
            ))}
            {/* Añadimos el evento de creación al final de la lista */}
            <li>
              <strong>{eventoCreacion.usuario_que_modifico}</strong> {eventoCreacion.mensaje}
              <span className="fecha-historial"> — {eventoCreacion.Fecha_Cambio}</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
