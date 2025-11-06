import { ReactNode, ButtonHTMLAttributes } from "react";

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Texto?: string;
  Icono?: ReactNode;
}

export default function Boton({ Texto, Icono, ...props }: BotonProps) {
  return (
    <button className="boton" {...props}>
      {Icono}
      {Texto}
    </button>
  );
}
