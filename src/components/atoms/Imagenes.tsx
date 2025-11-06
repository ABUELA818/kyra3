import Image from "next/image";

interface ImagenesProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function Imagenes({ src, alt, width, height }: ImagenesProps) {
    return (
        <Image src={src} alt={alt} width={width} height={height} className="ImagenLogo"/>
    );
}