"use client";
import { useState, useEffect } from "react";
import CrearEquipoModal from "../organisms/Crear_Equipo";
import { getEquiposByUsuario, createEquipo } from "@/services/Equipos.service"; // Importa los servicios
import { Equipo, NuevoEquipo } from "@/types/Equipos"; // Importa los tipos

interface EquiposDropdownProps {
  color: string;
  TamañoLetra: number;
}

export default function EquiposDropdown({ color, TamañoLetra }: EquiposDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [equipos, setEquipos] = useState<Equipo[]>([]); // Estado para los equipos de la API
  const [loading, setLoading] = useState(true);

  // Este ID vendrá de tu sesión de usuario en el futuro
  const idUsuarioActual = 1; 

  // --- LÓGICA 1: Cargar los equipos cuando el componente se monta ---
  useEffect(() => {
    const fetchEquipos = async () => {
      setLoading(true);
      const data = await getEquiposByUsuario(idUsuarioActual);
      setEquipos(data);
      setLoading(false);
    };
    fetchEquipos();
  }, []); // El array vacío asegura que se ejecute solo una vez

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeCreateModal = () => setShowCreateModal(false);

  // --- LÓGICA 2: Función para manejar la creación de un equipo ---
  const manejarCrearEquipo = async (nuevoEquipo: NuevoEquipo) => {
    try {
      const datosParaAPI = {
        Nombre_Equipo: nuevoEquipo.titulo,
        ID_Usuario_Creador: idUsuarioActual,
        miembros: nuevoEquipo.miembros,
      };
      
      const equipoCreado = await createEquipo(datosParaAPI);
      
      // Actualiza la lista de equipos en la UI sin recargar la página
      setEquipos(prevEquipos => [...prevEquipos, { ID_Equipo: equipoCreado.ID_Equipo, Nombre_Equipo: datosParaAPI.Nombre_Equipo }]);
      
      alert("¡Equipo creado con éxito!");
      
    } catch (error) {
      console.error("Error al crear el equipo:", error);
      alert("Hubo un error al crear el equipo.");
    }
  };

  return (
    <div className="equipos-container">
      <button
        className="equipos-toggle"
        onClick={toggleDropdown}
        style={{ color: color, fontSize: `${TamañoLetra}px` }}
      >
        <span>Mis equipos</span>
        <span className={`equipos-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="equipos-list">
          <button className="crear-equipo-btn" onClick={() => setShowCreateModal(true)} style={{ fontSize: "14px", color: color }}>
            + Crear nuevo equipo
          </button>
          
          {loading ? (
            <p style={{ fontSize: "14px", color: color, padding: "8px 12px" }}>Cargando...</p>
          ) : (
            equipos.map((equipo) => (
              <a
                key={equipo.ID_Equipo}
                href={`/Equipos/${equipo.ID_Equipo}`} // Es mejor usar el ID que el nombre en la URL
                className="equipo-item"
                style={{ fontSize: "14px", color: color }}
              >
                {equipo.Nombre_Equipo}
              </a>
            ))
          )}
        </div>
      )}

      {/* --- LÓGICA 3: Pasar las props correctamente al modal --- */}
      {showCreateModal && (
        <CrearEquipoModal 
          onClose={closeCreateModal} 
          onCrearEquipos={manejarCrearEquipo} // ¡Aquí se pasa la función que faltaba!
        />
      )}
    </div>
  );
}