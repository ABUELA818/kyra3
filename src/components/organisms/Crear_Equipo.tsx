"use client"
import { useState, useEffect } from "react" // --- CAMBIO 1: Importar useEffect ---
import type { NuevoEquipo } from "@/types/Equipos"
import { getAllUsers } from "@/services/Usuarios.service";
import { Usuario } from "@/types/Usuario";

interface CrearEquipoModalProps {
  onClose: () => void
  onCrearEquipos: (equipo: NuevoEquipo) => void
}
 
export default function CrearEquipoModal({ onClose, onCrearEquipos }: CrearEquipoModalProps) {
  const ID_Actual = 1;

  const [formData, setFormData] = useState<NuevoEquipo>({
    titulo: "",
    miembros: [], // Esto ahora será un array de números
    ID_Creador: ID_Actual,
  })

  const [usuariosDeApi, setUsuariosDeApi] = useState<Usuario[]>([]);
  const [usuariosBusqueda, setUsuariosBusqueda] = useState("");
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);

  // --- CAMBIO 2: Usar useEffect para cargar los datos una vez ---
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const dataUsuarios = await getAllUsers();
        setUsuariosDeApi(dataUsuarios);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };
    fetchDatos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const usuariosParaFormulario = usuariosDeApi.map(user => ({
    id: user.ID_Usuario,
    nombre: user.Nombre_Usuario,
  }));

  const usuariosFiltrados = usuariosParaFormulario.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(usuariosBusqueda.toLowerCase()) && 
      !formData.miembros.includes(usuario.id), // La comparación ahora es number vs number
  )

  // --- CAMBIO 3: Manejar los IDs como números ---
  const agregarUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: [...prev.miembros, usuarioId],
    }));
    setUsuariosBusqueda("");
    setMostrarUsuarios(false);
  }

  const removerUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: prev.miembros.filter((id) => id !== usuarioId),
    }));
  }

  // --- CAMBIO 4: Corregir la lógica de envío ---
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.titulo && formData.miembros.length > 0) {
      // Se llama a la prop en lugar de al servicio directamente
      onCrearEquipos(formData); 
      // Opcional: El onClose() se podría llamar desde el padre después de que la API responda
      onClose(); 
    } else {
        alert("El equipo debe tener un nombre y al menos un miembro.");
    }
  }

  return (
    <div className="Crear_Equipos_Contenedor" onClick={onClose}>
      <div className="Crear_Equipos_Formulario" onClick={(e) => e.stopPropagation()}>
        <div className="Crear_Equipos_Titulo">
          <h3>Crear Nuevo Equipo</h3>
          <button className="Crear_Equipos_Cerrar" onClick={onClose}>×</button>
        </div>
        <div className="Crear_Equipos_Contenido">
          <form onSubmit={manejarEnvio}>
            <div className="Formulario_Contenedor_Equipo">
                <input 
                  type="text" 
                  placeholder="Ingresa el nombre del equipo" 
                  value={formData.titulo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value}))}
                  required
                  className="form-input"
                />

              <input
                type="text"
                placeholder="Buscar usuarios para añadir al equipo"
                value={usuariosBusqueda}
                onChange={(e) => {
                  setUsuariosBusqueda(e.target.value);
                  setMostrarUsuarios(e.target.value.length > 0);
                }}
                className="form-input"
              />
            </div>

            {/* El JSX se mantiene casi igual, pero ahora usa 'number' para los IDs */}
            <div className="buscar-usuarios-container">
              {mostrarUsuarios && usuariosFiltrados.length > 0 && (
                <div className="usuarios-dropdown">
                  {usuariosFiltrados.map((usuario) => (
                    <div key={usuario.id} className="usuario-opcion" onClick={() => agregarUsuario(usuario.id)}>
                      {usuario.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formData.miembros.length > 0 && (
              <div className="usuarios-seleccionados">
                {formData.miembros.map((usuarioId) => {
                  const usuario = usuariosParaFormulario.find((u) => u.id === usuarioId);
                  return usuario ? (
                    <div key={usuarioId} className="usuario-seleccionado">
                      <span>{usuario.nombre}</span>
                      <button type="button" onClick={() => removerUsuario(usuarioId)} className="remover-usuario">×</button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            
            {/* Se eliminó la descripción ya que no está en tu estado */}

            <div className="Crear_Equipos_Acciones">
              <button type="button" className="Crear_Equipos_Cancelar" onClick={onClose}>Cancelar</button>
              <button type="submit" className="Crear_Equipos_Crear">Crear Equipo</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}