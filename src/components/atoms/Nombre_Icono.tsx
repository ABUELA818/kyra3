import Icono_Perfil from "./Icono-Perfil";

interface NombreIconoProps {
    nombre: string;
    imagen?: string;
    color: string;
}

export default function NombreIcono ({nombre, imagen, color}:NombreIconoProps) {
    return(
        <div className="NombreIcono_Contenedor" style={{display: "flex", alignItems:"center", gap:"10px", justifyContent:"center"}}>
            <Icono_Perfil Imagen={imagen} Nombre={nombre} color={color}/>
            <p style={{display:"flex", alignItems:"center"}}>{nombre}</p>
        </div>
    );
}