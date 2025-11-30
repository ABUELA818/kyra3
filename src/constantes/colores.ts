export const coloresporEstado: Record<
  "Asignaciones" | "En proceso" | "Enviados" | "Correcciones" | "Terminados",
  { fondo1: string; titulo1: string }
> = {
  "Asignaciones": { fondo1: "rgba(121, 210, 245, 0.2)", titulo1: "rgba(121, 210, 245, 0.6)" },
  "En proceso": { fondo1: "rgba(145, 132, 232, 0.2)", titulo1: "rgba(145, 132, 232, 0.6)" },
  "Enviados": { fondo1: "rgba(237, 199, 98, 0.2)", titulo1: "rgba(237, 199, 98, 0.6)" },
  "Correcciones": { fondo1: "rgba(228, 122, 110, 0.2)", titulo1: "rgba(228, 122, 110, 0.6)" },
  "Terminados": { fondo1: "rgba(113, 212, 104, 0.2)", titulo1: "rgba(113, 212, 104, 0.6)" },
};