import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

//Traer por equipo
router.get("/equipos/:ID_Equipo", async (req, res) => {
    try {
        const { ID_Equipo } = req.params;

        const query = `
            SELECT 
                u."ID_Usuario",
                u."Nombre_Usuario",
                u."Correo",
                u."Color",
                me."Rol_equipo"
            FROM "Usuarios" u
            JOIN "MiembrosEquipos" me ON u."ID_Usuario" = me."ID_Usuario"
            WHERE me."ID_Equipo" = $1
            ORDER BY u."Nombre_Usuario" ASC;
        `;

        const { rows } = await pool.query(query, [ID_Equipo]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener los miembros del equipo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.get("/", async (req, res) => {
    try {
        // Seleccionamos solo los campos necesarios para evitar exponer datos sensibles.
        const query = `
            SELECT "ID_Usuario", "Nombre_Usuario", "Correo", "Color" 
            FROM "Usuarios" 
            ORDER BY "Nombre_Usuario" ASC;
        `;

        const { rows } = await pool.query(query);
        res.status(200).json(rows);

    } catch (error) {
        console.error("❌ Error al obtener todos los usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

export default router;