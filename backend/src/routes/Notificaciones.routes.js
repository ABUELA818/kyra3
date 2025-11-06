import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

//Traer por usuario
router.get("/:ID_Usuario", async (req, res) => {
    try {
        const { ID_Usuario } = req.params;

        const query = `
            SELECT
                "ID_Notificacion",
                "ID_Usuario",
                "Tipo_Noti",
                "Detalles",
                "Visto",
                "Fecha"
            FROM "Notificaciones"
            WHERE "ID_Usuario" = $1
            ORDER BY "Fecha" DESC;
        `;

        const { rows } = await pool.query(query, [ID_Usuario]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Cambiar de estado
router.patch("/:ID_Notificacion/visto", async (req, res) => {
    try {
        const { ID_Notificacion } = req.params;

        const query = `
            UPDATE "Notificaciones"
            SET "Visto" = true
            WHERE "ID_Notificacion" = $1
            RETURNING *;
        `;

        const { rows, rowCount } = await pool.query(query, [ID_Notificacion]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Notificación no encontrada." });
        }

        res.status(200).json({
            message: "Notificación marcada como vista.",
            notificacion: rows[0]
        });

    } catch (error) {
        console.error("Error al marcar la notificación como vista:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

export default router;