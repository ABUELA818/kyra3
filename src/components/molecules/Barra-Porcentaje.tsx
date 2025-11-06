import "@/styles/BarraPorcentaje.css";

interface BarraPorcentajeProps {
    porcentaje: number;
}

export default function Barra_Porcentaje({ porcentaje }: BarraPorcentajeProps) {
    const porcentajeClamped = Math.max(0, Math.min(100, porcentaje)); 

    return (
        <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${porcentajeClamped}%` }}></div>
            </div>
            <span className="progress-text">{porcentajeClamped}%</span>
        </div>
    );
}