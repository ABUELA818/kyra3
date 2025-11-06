import { Router } from "express";
import pool from "../config/db.js";

const router = Router();
  
//Traer por usuario
router.get("/usuario/:ID_Usuario", async (req, res) => {
    try {
        const { ID_Usuario } = req.params;

        const query = `
            SELECT
                p."ID_Proyecto",
                p."Nombre_Proyecto",
                p."Estado_Proyecto",
                p."Fecha_Inicio",
                
                json_build_object(
                    'ID_Usuario', creador."ID_Usuario",
                    'Nombre_Usuario', creador."Nombre_Usuario",
                    'Correo', creador."Correo",
                    'Color', creador."Color"
                ) AS "creador_proyecto",

                (
                    SELECT COUNT(*)
                    FROM "Asignaciones" a
                    WHERE a."ID_Proyecto" = p."ID_Proyecto"
                )::int AS "numero_asignaciones",
                
                COALESCE((
                    SELECT ROUND(
                        (COUNT(*) FILTER (WHERE a."Estado_Asignacion" = 'Completado') * 100.0) / NULLIF(COUNT(*), 0)
                    )
                    FROM "Asignaciones" a
                    WHERE a."ID_Proyecto" = p."ID_Proyecto"
                ), 0)::int AS "avance",
                
                (
                    SELECT json_agg(
                        json_build_object(
                            'ID_Usuario', u."ID_Usuario",
                            'Nombre_Usuario', u."Nombre_Usuario",
                            'Correo', u."Correo",
                            'Color', u."Color"
                        )
                    )
                    FROM "Usuarios" u
                    JOIN "MiembrosEquipos" me ON u."ID_Usuario" = me."ID_Usuario"
                    WHERE me."ID_Equipo" = p."ID_Equipo"
                ) AS "equipo"
                
            FROM "Proyectos" p
            LEFT JOIN "Usuarios" creador ON p."ID_Usuario_Creador" = creador."ID_Usuario"
            WHERE 
                p."ID_Usuario_Creador" = $1 
                OR EXISTS (
                    SELECT 1
                    FROM "MiembrosEquipos" me
                    WHERE me."ID_Equipo" = p."ID_Equipo" AND me."ID_Usuario" = $1
                )   
            GROUP BY p."ID_Proyecto", creador."ID_Usuario"
            ORDER BY p."Fecha_Inicio" DESC;
        `;

        const { rows } = await pool.query(query, [ID_Usuario]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener los proyectos del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Crear nuevo
router.post("/", async (req, res) => {
    const {
        Nombre_Proyecto,
        Descripción_Proyecto,
        Fecha_Inicio,
        Fecha_Termino,
        ID_Usuario_Creador,
        miembros
    } = req.body;

    // Validación de datos
    if (!Nombre_Proyecto || !Fecha_Inicio || !ID_Usuario_Creador || !miembros || miembros.length === 0) {
        return res.status(400).json({ 
            message: "Faltan datos. Se requiere nombre, fecha de inicio, creador y al menos un miembro." 
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // PASO 1: Crear un equipo dedicado para el proyecto
        const nombreEquipo = `Equipo para: ${Nombre_Proyecto}`;
        const insertEquipoQuery = `
            INSERT INTO "Equipos" ("Nombre_Equipo", "ID_Usuario_Creador")
            VALUES ($1, $2)
            RETURNING "ID_Equipo";
        `;
        const equipoResult = await client.query(insertEquipoQuery, [nombreEquipo, ID_Usuario_Creador]);
        const newTeamId = equipoResult.rows[0].ID_Equipo;

        // PASO 2: Asignar al creador y a los miembros a ese nuevo equipo
        // Primero, el creador con su rol
        const insertCreadorQuery = `
            INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
            VALUES ($1, $2, 'Creador');
        `;
        await client.query(insertCreadorQuery, [newTeamId, ID_Usuario_Creador]);

        // Luego, los otros miembros (excluyendo al creador para no duplicar)
        const otrosMiembros = miembros.filter(miembroId => miembroId !== ID_Usuario_Creador);
        if (otrosMiembros.length > 0) {
            const values = otrosMiembros.flatMap(userId => [newTeamId, userId, 'Miembro']);
            const placeholders = otrosMiembros.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ');
            const insertMiembrosQuery = `
                INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
                VALUES ${placeholders};
            `;
            await client.query(insertMiembrosQuery, values);
        }

        // PASO 3: Finalmente, crear el proyecto y vincularlo al nuevo equipo
        const insertProyectoQuery = `
            INSERT INTO "Proyectos" (
                "Nombre_Proyecto", "Descripción_Proyecto", "Estado_Proyecto", 
                "Fecha_Inicio", "Fecha_Termino", "ID_Equipo", "ID_Usuario_Creador"
            ) VALUES ($1, $2, 'Pendiente', $3, $4, $5, $6)
            RETURNING "ID_Proyecto";
        `;
        const proyectoResult = await client.query(insertProyectoQuery, [
            Nombre_Proyecto, Descripción_Proyecto, Fecha_Inicio, 
            Fecha_Termino, newTeamId, ID_Usuario_Creador
        ]);
        const newProjectId = proyectoResult.rows[0].ID_Proyecto;
        
        await client.query('COMMIT');

        res.status(201).json({
            message: "Proyecto y equipo creados exitosamente.",
            ID_Proyecto: newProjectId,
            ID_Equipo: newTeamId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al crear el proyecto:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        client.release();
    }
});

export default router;