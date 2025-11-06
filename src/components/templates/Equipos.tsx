"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from 'next/navigation';
import { ChevronLeft, Home } from "lucide-react";
import { Pencil} from "lucide-react";

// Componentes
import Barra_Busqueda from "@/components/molecules/Barra_Busqueda";
import Miembros_Equipos from "@/components/molecules/Miembros_Equipo";
import Tabla from "@/components/organisms/Tablas";
import Subir_Archivos from "@/components/organisms/Subir_Archivo";
import Crear_Carpeta from "@/components/organisms/Crear_Carpetas";
import Invitar_Miembro from "@/components/organisms/Invitar_Miembro";
import NombreIcono from "@/components/atoms/Nombre_Icono";
import Boton_Accion from "@/components/atoms/Boton_Accion";
import Barra_Acciones from "@/components/molecules/Barra_Acciones";
import "@/styles/Equipos.css";

// Servicios y Tipos
import { getMiembrosDeEquipo, updateRolMiembro, deleteMiembroDeEquipo } from "@/services/Equipos.service";
import { getContenidoCarpeta, createCarpeta, getRutaCarpeta } from "@/services/Carpetas.service";
import { searchArchivos,addFavorito, removeFavorito, updateArchivoNombre  } from "@/services/Archivos.service";
import { MiembroEquipo, ArchivoEquipo, CarpetaEquipo, RutaItem, SearchFilters } from "@/types/Equipos";

function formatearFecha(fechaISO: string): string {
  if (!fechaISO) return "N/A";
  return new Date(fechaISO).toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Equipos() {
  const idUsuarioActual = 1;

  const params = useParams();
  const idEquipo = Number(params.Equipos);

  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
  const [archivos, setArchivos] = useState<ArchivoEquipo[]>([]);
  const [carpetas, setCarpetas] = useState<CarpetaEquipo[]>([]);
  const [carpetaActualId, setCarpetaActualId] = useState<number | null>(null);
  const [rutaNavegacion, setRutaNavegacion] = useState<RutaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  const [showSubirArchivo, setShowSubirArchivo] = useState(false);
  const [showCrearCarpeta, setShowCrearCarpeta] = useState(false);
  const [showInvitarMiembro, setShowInvitarMiembro] = useState(false);

  const fetchDatos = useCallback(async (idCarpeta: number | null) => {
    if (!idEquipo) return;
    setLoading(true);
    try {
      const [dataMiembros, dataContenido, dataRuta] = await Promise.all([
        getMiembrosDeEquipo(idEquipo),
        getContenidoCarpeta(idEquipo, idCarpeta, idUsuarioActual),
        idCarpeta ? getRutaCarpeta(idCarpeta) : Promise.resolve([])
      ]);
      setMiembros(dataMiembros);
      setArchivos(dataContenido.archivos);
      setCarpetas(dataContenido.carpetas);
      setRutaNavegacion(dataRuta);
    } catch (error) { console.error("Error al cargar datos del equipo:", error); } 
    finally { setLoading(false); }
  }, [idEquipo, miembros, idUsuarioActual]);

  useEffect(() => { fetchDatos(carpetaActualId); }, [idEquipo, carpetaActualId]);

  // --- LÓGICA DE MANEJADORES DE ACCIONES (COMPLETA) ---
  const handleRoleChange = async (userId: number, newRole: "Admin" | "Miembro") => {
    try {
      await updateRolMiembro(idEquipo, userId, newRole);
      setMiembros(miembros.map(m => m.ID_Usuario === userId ? { ...m, Rol_equipo: newRole } : m));
      alert("Rol actualizado con éxito");
    } catch (error) {
      console.error("Error al cambiar el rol:", error);
      alert("No se pudo actualizar el rol.");
    }
  };
  
  const handleDeleteMember = async (userId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar a este miembro del equipo?")) {
      try {
        await deleteMiembroDeEquipo(idEquipo, userId);
        setMiembros(miembros.filter(m => m.ID_Usuario !== userId));
        alert("Miembro eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar al miembro:", error);
        alert("No se pudo eliminar al miembro.");
      }
    }
  };

  const handleCrearCarpeta = async (nombreCarpeta: string) => {
    try {
        await createCarpeta({
            Nombre_Carpeta: nombreCarpeta,
            ID_Equipo: idEquipo,
            Carpeta_Origen: carpetaActualId
        });
        setShowCrearCarpeta(false);
        await fetchDatos(carpetaActualId);
    } catch (error) {
        console.error("Error al crear la carpeta:", error);
        alert("No se pudo crear la carpeta.");
    }
  };
  
  const handleSearch = async (query: string, filtros: SearchFilters) => {
    if (!query && Object.keys(filtros).length === 0) {
        handleRefresh();
        return;
    }
    setIsSearching(true);
    setLoading(true);
    try {
      const resultados = await searchArchivos(idEquipo, { q: query, ...filtros });
      setArchivos(resultados);
      setCarpetas([]);
    } catch (error) { console.error("Error en la búsqueda:", error); } 
    finally { setLoading(false); }
  };
  
  const handleRefresh = () => {
      setIsSearching(false);
      fetchDatos(carpetaActualId);
  };

  const handleToggleFavorito = async (archivo: ArchivoEquipo) => {
    try {
      if (archivo.is_favorito) {
        // Si ya es favorito, lo eliminamos
        await removeFavorito(idUsuarioActual, archivo.ID_Archivo);
      } else {
        // Si no es favorito, lo añadimos
        await addFavorito(idUsuarioActual, archivo.ID_Archivo);
      }
      // Actualiza el estado local para que el cambio en la UI sea instantáneo
      setArchivos(archivos.map(a =>
        a.ID_Archivo === archivo.ID_Archivo ? { ...a, is_favorito: !a.is_favorito } : a
      ));
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      alert("No se pudo actualizar el estado de favorito.");
    }
  };

  const handleDownloadArchivo = (archivo: ArchivoEquipo) => {
    // 1. Construye la URL completa al archivo en el backend.
    const url = `http://localhost:4000/${archivo.StorageKey}`;
    
    // 2. Crea un elemento de enlace <a> invisible.
    const link = document.createElement('a');
    link.href = url;
    
    // 3. Establece el atributo 'download' con el nombre original del archivo.
    // Esto le dice al navegador que lo descargue en lugar de navegar a la URL.
    link.setAttribute('download', archivo.Nombre_Archivo);
    
    // 4. Añade el enlace al documento, haz clic en él y luego elimínalo.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // --- TRANSFORMACIÓN DE DATOS PARA COMPONENTES HIJOS ---
  const datosMiembros = miembros.map(miembro => [
    <NombreIcono key={miembro.ID_Usuario} nombre={miembro.Nombre_Usuario} color={miembro.Color} />,
    <Boton_Accion 
        key={`${miembro.ID_Usuario}-accion`} 
        onRoleChange={(role) => handleRoleChange(miembro.ID_Usuario, role)}
        onDeleteClick={() => handleDeleteMember(miembro.ID_Usuario)}
    />
  ]);
  
  const datosTabla = [
      ...carpetas.map(carpeta => [
        <div key={`c-${carpeta.ID_Carpeta}`} className="nombre-carpeta" onClick={() => setCarpetaActualId(carpeta.ID_Carpeta)}>
            📁 {carpeta.Nombre_Carpeta}
        </div>,
        "-", 
        "-", 
        "-", 
        "-", 
        <div className="Barra_Acciones" style={{display: "flex"}}>
          <button title="Renombrar Carpeta"><Pencil size={17}/></button>
        </div>
      ]),
      ...archivos.map(archivo => [
          archivo.Nombre_Archivo,
          <NombreIcono key={archivo.ID_Archivo + '-propietario'} nombre={archivo.propietario ?? 'Desconocido'} color={"#888"} />,
          formatearFecha(archivo.Fecha_Subida),
          `${(archivo.Tamaño_Archivo / 1024 / 1024).toFixed(2)} MB`,
          archivo.estado || 'No asignado',
          <Barra_Acciones 
              key={archivo.ID_Archivo} 
              archivo={archivo}
              Estilo="flex" 
              IconTamaño={17} 
              onEditClick={() => handleRenameArchivo(archivo)}
              onFavoriteClick={() => handleToggleFavorito(archivo)}
              onDownloadClick={() => handleDownloadArchivo(archivo)}
          />
      ])
  ];

  const carpetaPadreId = rutaNavegacion.length > 0 ? rutaNavegacion[rutaNavegacion.length - 2]?.ID_Carpeta ?? null : null;

  const handleRenameArchivo = async (archivo: ArchivoEquipo) => {
    const nuevoNombre = prompt("Ingresa el nuevo nombre para el archivo:", archivo.Nombre_Archivo);

    // Si el usuario presiona "Cancelar" o no escribe nada, no hacemos nada.
    if (nuevoNombre && nuevoNombre !== archivo.Nombre_Archivo) {
      try {
        await updateArchivoNombre(archivo.ID_Archivo, nuevoNombre);
        
        // Actualiza el estado local para que el cambio se refleje en la UI al instante
        setArchivos(archivos.map(a => 
          a.ID_Archivo === archivo.ID_Archivo ? { ...a, Nombre_Archivo: nuevoNombre } : a
        ));

        alert("Archivo renombrado con éxito.");
      } catch (error) {
        console.error("Error al renombrar:", error);
        alert("No se pudo renombrar el archivo.");
      }
    }
  };

  if (loading && miembros.length === 0) return <div className="loading-container"><p>Cargando equipo...</p></div>;

  return (
    <div className="Equipos_Contenedor">
      <nav className="Barra_Busqueda">
        <Barra_Busqueda onSearch={handleSearch} onRefresh={handleRefresh} miembros={miembros} />
      </nav>
      <div className="Equipos_Contenido">
        <div className="Equipos_Medio">
          <div className="Equipos_Chat"><h1>Chat de Equipo</h1></div>
          <div className="Equipos_Miembros">
            <div className="Equipos_Miembros_Titulo">
              <h1>Miembros</h1>
              <button className="Agregar_Miembro" onClick={() => setShowInvitarMiembro(true)}>+</button>
            </div>
            <Miembros_Equipos Miembros={datosMiembros} />
          </div>
        </div>

        {!isSearching && (
          <div className="navegacion-carpetas">
            {carpetaActualId && ( <button className="btn-navegacion" onClick={() => setCarpetaActualId(carpetaPadreId)}><ChevronLeft size={20} /> Atrás</button> )}
            <div className="breadcrumbs">
              <span className="breadcrumb-item" onClick={() => setCarpetaActualId(null)}><Home size={16} /> Raíz</span>
              {rutaNavegacion.map(ruta => (
                <span key={ruta.ID_Carpeta}>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item" onClick={() => setCarpetaActualId(ruta.ID_Carpeta)}>{ruta.Nombre_Carpeta}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="Equipos_Btns">
          <button onClick={() => setShowSubirArchivo(true)}>Subir Archivo</button>
          <button onClick={() => setShowCrearCarpeta(true)}>Crear Carpeta</button>
        </div>
        <div>
          <Tabla columnas={["Nombre", "Propietario", "Fecha", "Tamaño", "Estado", ""]} datos={datosTabla} TletraDatos={14} TletraEncabezado={20} AlturaMaxima={25} TaFila={10} />
        </div>
        
        {showSubirArchivo && <Subir_Archivos onClose={() => setShowSubirArchivo(false)} idEquipo={idEquipo} carpetaActualId={carpetaActualId} onArchivoSubido={() => fetchDatos(carpetaActualId)} />}
        {showCrearCarpeta && <Crear_Carpeta onClose={() => setShowCrearCarpeta(false)} onCrear={handleCrearCarpeta} />}
        {showInvitarMiembro && <Invitar_Miembro onClose={() => setShowInvitarMiembro(false)} miembrosActuales={miembros} idEquipo={idEquipo} onMiembroInvitado={() => fetchDatos(carpetaActualId)}/>}
      </div>
    </div>
  );
}