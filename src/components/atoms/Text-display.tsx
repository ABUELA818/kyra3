interface TextDisplayProps {
    Texto: string;
}

export default function TextDisplay({ Texto }: TextDisplayProps) {
    return (
        <p className="text-display">
            {Texto}
        </p>
    );
}
 