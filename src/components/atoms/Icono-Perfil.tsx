import "@/styles/Icono-Perfil.css"; 
import Link from "next/link";

interface IconPerfilProps {
  Imagen?: string;
  Nombre: string;
  color: string;
}

export default function Icono_Perfil({ Imagen, Nombre, color }: IconPerfilProps) {
  const Inicial = Nombre.charAt(0).toUpperCase();

  return (
    <Link
      href={`/app/Usuarios/${Nombre}`}
      className="icono-perfil-contenedor"
      style={{
        backgroundColor: Imagen ? "transparent" : color
      }}
      title={Nombre}
    >
      {Imagen ? (
        <img
          src={Imagen}
          alt={Nombre}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        Inicial
      )}
    </Link>
  );
}
