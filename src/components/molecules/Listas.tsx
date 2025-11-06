interface ListaProps {
    datos:  React.ReactNode[][];
    TletraDatos: number;
}

export default function Listas({datos, TletraDatos}:ListaProps) {
    return(
        <div>
            {datos.map((fila, i) => (
              <div key={i} style={{ fontSize: `${TletraDatos}px`, display: "flex"}}>
                {fila.map((dato, j) => (
                  <div key={j} style={{ paddingLeft:"10px"}}>{dato}</div>
                ))}
              </div>
            ))}
        </div>
    );
}