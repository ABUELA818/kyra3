import Link from "next/link";

interface TextLinkProps {
  href: string;
  Texto: string;
  color: string;
  TamañoLetra: number;
}

export default function TextLink({ href, Texto, color, TamañoLetra }: TextLinkProps) {
    return (
        <Link href={href} className="links" style={{ color: color, textDecoration: 'none', fontSize: `${TamañoLetra}px` }}>
            {Texto}
        </Link>
    );
} 