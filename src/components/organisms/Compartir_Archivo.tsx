"use client"

import { useState } from "react";
import Icono_Perfil from "@/components/atoms/Icono-Perfil";

interface Usuario {
    id: string;
    nombre: string;
}

interface ModalCompartirProps {
  usuarios: Usuario[];
  onClose: () => void;
}

export default function ModalCompartir({ usuarios, onClose }: ModalCompartirProps) {
  const [permiso, setPermiso] = useState("Lectura");

  return (
    <div className="Modal_Overlay" onClick={onClose}>
      <div className="Modal_Contenido" onClick={(e) => e.stopPropagation()}>
        <h3>Compartir documento</h3>
        <div className="Modal_InputBusqueda">
          <input type="text" placeholder="Buscar usuarios..." />
        </div>
        <div className="Modal_Acciones">
          <select value={permiso} onChange={(e) => setPermiso(e.target.value)}>
            <option value="Lectura">Lectura</option>
            <option value="Edición">Edición</option>
          </select>
          <div className="Modal_Botones">
            <button className="Boton_Cancelar" onClick={onClose}>Cancelar</button>
            <button className="Boton_Enviar">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
