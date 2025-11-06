interface TextoChicoProps {
    Texto:string;
    Tamaño:number;
}

export default function TextoChico({Texto,Tamaño}:TextoChicoProps) {
    return(
        <div style={{width:`${Tamaño}%`}} >
            <p className="Datos_lista">{Texto}</p>
        </div>
    )
}