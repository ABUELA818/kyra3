import type React from "react"
import "../../styles/Tabla.css"

// Defino las propiedades que mi componente de tabla va a recibir.
interface TablaProps {
  // Un array de strings para los títulos de las columnas.
  columnas: string[]
  // Un array de arrays que puede contener cualquier elemento de React (texto, componentes, etc.).
  datos: React.ReactNode[][]
  // Props para controlar los estilos dinámicamente desde donde llame a la tabla.
  TletraDatos: number
  TletraEncabezado: number
  AlturaMaxima: number
  TaFila?: number
  AlturaMinima?: number
}

export default function Tabla({
  columnas,
  datos,
  TletraDatos,
  TletraEncabezado,
  AlturaMaxima,
  AlturaMinima = 30, // altura mínima por defecto de 30vh
}: TablaProps) {
  const estaVacia = datos.length === 0

  return (
    <div className="tabla-wrapper">
      <table className="Tabla">
        {/* La cabecera de la tabla (thead) donde van los títulos. */}
        <thead>
          <tr style={{ fontSize: `${TletraEncabezado}px` }}>
            {/* Hago un map para crear cada celda del encabezado (th). */}
            {columnas.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        {/* El cuerpo de la tabla (tbody) donde van los datos. */}
        <tbody
          style={{
            maxHeight: `${AlturaMaxima}vh`,
            minHeight: `${AlturaMinima}vh`,
          }}
        >
          {/* Hago un map sobre los datos para crear cada fila (tr). */}
          {datos.map((fila, i) => (
            <tr key={i} style={{ fontSize: `${TletraDatos}px` }}>
              {/* Hago otro map dentro de cada fila para crear las celdas (td). */}
              {fila.map((dato, j) => (
                <td key={j}>{dato}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
