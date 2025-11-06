import Tabla from "../organisms/Tablas"

interface MiembrosEquipoProps {
    Miembros: React.ReactNode[][];
}

export default function Miembros_Equipos({Miembros}:MiembrosEquipoProps) {
    const Columnas = ["Usuario", "Acciones"]

    return (
        <div className="Miembros_Equipos_Contenedor">
            <Tabla columnas={Columnas} datos={Miembros} TletraDatos={15} TletraEncabezado={15} AlturaMaxima={29} TaFila={10}/>
        </div>
    )
} 