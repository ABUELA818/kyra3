import Icono_Perfil from "../atoms/Icono-Perfil";

interface Integrante {
  Imagen?: string;
  nombre: string;
  src: string;
  color: string;
}

export function EquipoIconos({ integrantes }: { integrantes: Integrante[] }) {
  const maxVisibles = 4;
  const visibles = integrantes.slice(0, maxVisibles);
  const restantes = integrantes.length - maxVisibles;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "-4px", justifyContent: "center" }}>
      {visibles.map((int, i) => (
        <Icono_Perfil key={i} Imagen={int.Imagen} Nombre={int.nombre} color={int.color} />
      ))}
      {restantes > 0 && (
        <div
          style={{
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            backgroundColor: "#ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "-6px",
          }}
        >
          +{restantes}
        </div>
      )}
    </div>
  );
}
  