"use client"

import { useState } from "react"
import "../../styles/Archivo.css"
import BarraAcciones from "../../components/molecules/Barra_Acciones"
import { EquipoIconos } from "../molecules/Equipo-Iconos"
import ModalCompartir from "../organisms/Compartir_Archivo"


const archivo = {
  nombre: "Guion programa a borrador 1.docx",
  autor: "Manuel Reyes",
  estado: "Enviado",
  tamaño: "330 KB",
  fecha: "20 Mayo 2025",
  compartidoCon: [
    { id: "1", nombre: "Juan Rodríguez", color: "#3b82f6" },
    { id: "2", nombre: "Ana Ramos", color: "#ef4444" },
  ],
}

const usuariosParaCompartir = [
    { id: "3", nombre: "Pedro Hernández" },
    { id: "4", nombre: "Luisa Martínez" },
]


export default function Archivo() {
  const [mostrarModal, setMostrarModal] = useState(false)

  return (
    <div className="Archivo_Contenedor">
      <div className="Archivo_ColumnaIzquierda">
        <div className="Archivo_Contenedor_Informacion">
          <div className="Barra_Botones">
            <BarraAcciones onShareClick={() => setMostrarModal(true)} Estilo="grid" IconTamaño={20}/>
          </div>
          <div className="Archivo_InfoContenedor">
            <div className="Archivo_InfoTitulo">
              <h1>{archivo.nombre}</h1>
              <span>{archivo.tamaño}</span>
            </div>
            <div className="Archivo_InfoAutor">
              <p>
                {archivo.autor}
              </p>
  
              <span className="Estado_Badge">{archivo.estado}</span>
            </div>
            <p className="Archivo_InfoFecha">{archivo.fecha}</p>
            <div className="Archivo_CompartidoCon">
              <span>Compartido con:</span>
              <EquipoIconos integrantes={archivo.compartidoCon} />
            </div>
          </div>
        </div>
      </div>

      <div className="Archivo_ColumnaDerecha">
        <div className="Archivo_VistaPrevia">
          <p className="Placeholder_Documento">
            Aquí se renderizaría el contenido del documento          
          </p>
        </div>
      </div>
      
      {mostrarModal && (
        <ModalCompartir 
          usuarios={usuariosParaCompartir} 
          onClose={() => setMostrarModal(false)} 
        />
      )}
    </div>
  )
}
