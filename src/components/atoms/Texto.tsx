interface TextoProps {
    Texto: string;
}

export default function Texto({ Texto }: TextoProps) {
    return (
        <p className="texto">
            {Texto}
        </p>
    );
}