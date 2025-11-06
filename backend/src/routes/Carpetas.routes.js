import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

//Traer carpetas
router.get("/:ID_Equipo/fs", async (req, res) => {
    try {
        const { ID_Equipo } = req.params;
        const { carpeta_id } = req.query;

        // --- CORRECCIÓN AQUÍ ---
        // Construimos la base de las consultas y añadimos la condición dinámicamente
        let carpetasQuery = 'SELECT * FROM "Carpetas" WHERE "ID_Equipo" = $1';
        let archivosQuery = 'SELECT "ID_Archivo", "Nombre_Archivo", "Tamaño_Archivo", "Tipo_Archivo", "Fecha_Subida" FROM "Archivo" WHERE "ID_Equipo" = $1';
        const queryParams = [ID_Equipo];

        if (carpeta_id) {
            // Si hay un carpeta_id, lo añadimos como segundo parámetro
            carpetasQuery += ' AND "Carpeta_Origen" = $2';
            archivosQuery += ' AND "ID_Carpeta" = $2';
            queryParams.push(carpeta_id);
        } else {
            // Si no, buscamos en la raíz (donde el origen es NULL)
            carpetasQuery += ' AND "Carpeta_Origen" IS NULL';
            archivosQuery += ' AND "ID_Carpeta" IS NULL';
        }

        carpetasQuery += ' ORDER BY "Nombre_Carpeta" ASC;';
        archivosQuery += ' ORDER BY "Nombre_Archivo" ASC;';

        const [carpetasResult, archivosResult] = await Promise.all([
            pool.query(carpetasQuery, queryParams),
            pool.query(archivosQuery, queryParams)
        ]);

        res.status(200).json({
            carpetas: carpetasResult.rows,
            archivos: archivosResult.rows
        });

    } catch (error) {
        console.error("❌ Error al listar contenido del equipo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Obtener ruta de carpeta
router.get("/:ID_Carpeta/path", async (req, res) => {
    try {
        const { ID_Carpeta } = req.params;

        // Consulta recursiva para construir la ruta hacia arriba
        const query = `
            WITH RECURSIVE folder_path AS (
                SELECT "ID_Carpeta", "Nombre_Carpeta", "Carpeta_Origen"
                FROM "Carpetas"
                WHERE "ID_Carpeta" = $1
                UNION ALL
                SELECT p."ID_Carpeta", p."Nombre_Carpeta", p."Carpeta_Origen"
                FROM "Carpetas" p
                JOIN folder_path fp ON p."ID_Carpeta" = fp."Carpeta_Origen"
            )
            SELECT "ID_Carpeta", "Nombre_Carpeta" FROM folder_path;
        `;

        const { rows } = await pool.query(query, [ID_Carpeta]);

        // La consulta devuelve la ruta desde la carpeta actual hacia la raíz.
        // El frontend deberá invertir el array para mostrarlo correctamente.
        res.status(200).json(rows.reverse());

    } catch (error) {
        console.error("Error al obtener la ruta de la carpeta:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Crear carpeta
router.post("/", async (req, res) => {
    try {
        const { Nombre_Carpeta, ID_Equipo, Carpeta_Origen } = req.body;

        if (!Nombre_Carpeta || !ID_Equipo) {
            return res.status(400).json({ message: "Se requiere Nombre_Carpeta y ID_Equipo." });
        }

        const query = `
            INSERT INTO "Carpetas" ("Nombre_Carpeta", "ID_Equipo", "Carpeta_Origen")
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        
        // Si Carpeta_Origen no se envía, se pasa como NULL.
        const { rows } = await pool.query(query, [Nombre_Carpeta, ID_Equipo, Carpeta_Origen || null]);

        res.status(201).json({ message: "Carpeta creada exitosamente.", carpeta: rows[0] });

    } catch (error) {
        console.error("Error al crear la carpeta:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

export default router;