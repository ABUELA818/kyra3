"use client";

import { useState } from "react";
import { NuevoProyectoForm } from "@/types/Proyectos";
import { Usuario } from "@/types/Usuario";

interface Usuario {
  id: number;
  nombre: string;
}

interface CrearProyectoProps {
  usuarios: UsuarioParaFormulario[];
  onClose: () => void;
  onCrearProyecto: (proyecto: NuevoProyectoForm) => void; // Prop para enviar los datos
}

export default function Crear_Proyecto({ usuarios = [], onClose, onCrearProyecto }: CrearProyectoProps) {

  const [formData, setFormData] = useState<NuevoProyectoForm>({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_termino: "",
    miembros: [],
  });

  const [usuariosBusqueda, setUsuariosBusqueda] = useState("");
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(usuariosBusqueda.toLowerCase()) &&
      !formData.miembros.includes(usuario.id)
  );

  // --- MANEJADORES ---
  const agregarUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: [...prev.miembros, usuarioId],
    }));
    setUsuariosBusqueda("");
    setMostrarUsuarios(false);
  };

  const removerUsuario = (usuarioId: number) => {
    setFormData((prev) => ({
      ...prev,
      miembros: prev.miembros.filter((id) => id !== usuarioId),
    }));
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCrearProyecto(formData);
  };

  return (
    <div className="Crear_Proyecto_Contenedor" onClick={onClose}>
      <div className="Crear_Proyecto_Contenido" onClick={(e) => e.stopPropagation()}>
        <div className="Crear_Proyecto_Titulo">
          <h2>Crear Proyecto</h2>
        </div>

        <form className="Crear_Proyecto_Formulario" onSubmit={manejarSubmit}>
          <div className="Crear_Proyecto_Inputs">
            <input
              type="text"
              name="titulo" 
              className="Crear_Proyecto_Input_Nombre"
              placeholder="Nombre del Proyecto"
              value={formData.titulo}
              onChange={manejarCambio}
              required
            />
            <input
              type="text"
              className="Crear_Proyecto_Input_Usuarios"
              placeholder="Buscar Usuarios para asignar"
              value={usuariosBusqueda}
              onChange={(e) => {
                setUsuariosBusqueda(e.target.value);
                setMostrarUsuarios(e.target.value.length > 0);
              }}
            />
          </div>

          {mostrarUsuarios && usuariosFiltrados.length > 0 && (
            <div className="usuarios-dropdown">
              {usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="usuario-opcion" onClick={() => agregarUsuario(usuario.id)}>
                  {usuario.nombre}
                </div>
              ))}
            </div>
          )}

          {formData.miembros.length > 0 && (
            <div className="usuarios-seleccionados">
              {formData.miembros.map((usuarioId) => {
                const usuario = usuarios.find((u) => u.id === usuarioId);
                return usuario ? (
                  <div key={usuarioId} className="usuario-seleccionado">
                    <span>{usuario.nombre}</span>
                    <button type="button" onClick={() => removerUsuario(usuarioId)} className="remover-usuario">×</button>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* 7. Campo de Descripción añadido */}
          <div className="form-grupo">
            <textarea
              name="descripcion"
              placeholder="Descripción del proyecto"
              value={formData.descripcion}
              onChange={manejarCambio}
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="Crear_Proyecto_Fechas">
            <div className="Crear_Proyecto_FechaInicio">
              <label>Fecha de Inicio:</label>
              <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={manejarCambio} required/>
            </div>
            <div className="Crear_Proyecto_FechaTermino">
              <label>Fecha de Término:</label>
              <input type="date" name="fecha_termino" value={formData.fecha_termino} onChange={manejarCambio} />
            </div>
          </div>

          <div className="Crear_Proyecto_Botones">
            <button type="button" onClick={onClose} className="boton-cancelar">Cancelar</button>
            <button type="submit" className="boton-crear">Crear Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  );
}

