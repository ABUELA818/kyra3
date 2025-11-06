import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

//Traer por usuario
router.get("/usuario/:ID_Usuario", async (req, res) => {
    try {
        const { ID_Usuario } = req.params;

        const query = `
            SELECT 
                e."ID_Equipo",
                e."Nombre_Equipo",
                e."Fecha_Creacion",
                json_build_object(
                    'ID_Usuario', creador."ID_Usuario",
                    'Nombre_Usuario', creador."Nombre_Usuario"
                ) AS "creador_equipo",
                (
                    SELECT json_agg(
                        json_build_object(
                            'ID_Usuario', miembro."ID_Usuario",
                            'Nombre_Usuario', miembro."Nombre_Usuario",
                            'Correo', miembro."Correo",
                            'Color', miembro."Color"
                        )
                    )
                    FROM "MiembrosEquipos" me
                    JOIN "Usuarios" miembro ON me."ID_Usuario" = miembro."ID_Usuario"
                    WHERE me."ID_Equipo" = e."ID_Equipo"
                ) AS "miembros"
            FROM "Equipos" e
            LEFT JOIN "Usuarios" creador ON e."ID_Usuario_Creador" = creador."ID_Usuario"
            WHERE
                e."ID_Usuario_Creador" = $1
                OR EXISTS (
                    SELECT 1
                    FROM "MiembrosEquipos" me
                    WHERE me."ID_Equipo" = e."ID_Equipo" AND me."ID_Usuario" = $1
                )
            GROUP BY e."ID_Equipo", creador."ID_Usuario" -- Agrupar para consolidar resultados
            ORDER BY e."Fecha_Creacion" DESC;
        `;

        const { rows } = await pool.query(query, [ID_Usuario]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener los equipos del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Crear nuevo
router.post("/", async (req, res) => {
    const {
        Nombre_Equipo,
        ID_Usuario_Creador,
        miembros
    } = req.body;

    if (!Nombre_Equipo || !ID_Usuario_Creador || !miembros || miembros.length === 0) {
        return res.status(400).json({ 
            message: "Faltan datos. Se requiere nombre del equipo, ID del creador y al menos un miembro." 
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Paso 1: Insertar el nuevo equipo y obtener su ID.
        const insertEquipoQuery = `
            INSERT INTO "Equipos" ("Nombre_Equipo", "ID_Usuario_Creador")
            VALUES ($1, $2)
            RETURNING "ID_Equipo";
        `;
        const equipoResult = await client.query(insertEquipoQuery, [Nombre_Equipo, ID_Usuario_Creador]);
        const newTeamId = equipoResult.rows[0].ID_Equipo;

        // Paso 2: Insertar al creador en "MiembrosEquipos" con el rol 'Creador'.
        const insertCreadorQuery = `
            INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
            VALUES ($1, $2, 'Creador');
        `;
        await client.query(insertCreadorQuery, [newTeamId, ID_Usuario_Creador]);

        // Paso 3: Filtrar a los demás miembros (excluyendo al creador si ya está en la lista).
        const otrosMiembros = miembros.filter(miembroId => miembroId !== ID_Usuario_Creador);

        // Solo se ejecuta si hay otros miembros que añadir.
        if (otrosMiembros.length > 0) {
            const values = [];
            const placeholders = otrosMiembros.map((userId, index) => {
                const offset = index * 3;
                values.push(newTeamId, userId, 'Miembro');
                return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
            }).join(', ');

            const insertMiembrosQuery = `
                INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
                VALUES ${placeholders};
            `;
            await client.query(insertMiembrosQuery, values);
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: "Equipo creado y roles asignados correctamente.",
            ID_Equipo: newTeamId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al crear el equipo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        client.release();
    }
});

//Modificar rol de miembros
router.patch("/:ID_Equipo/miembros/:ID_Usuario", async (req, res) => {
    try {
        const { ID_Equipo, ID_Usuario } = req.params;
        const { nuevo_rol } = req.body;

        // Validar que el nuevo rol se haya enviado
        if (!nuevo_rol) {
            return res.status(400).json({ message: "Se requiere el 'nuevo_rol' en el cuerpo de la solicitud." });
        }

        const query = `
            UPDATE "MiembrosEquipos"
            SET "Rol_equipo" = $1
            WHERE "ID_Equipo" = $2 AND "ID_Usuario" = $3
            RETURNING *; -- Devuelve la fila actualizada para confirmar el cambio
        `;

        const { rows, rowCount } = await pool.query(query, [nuevo_rol, ID_Equipo, ID_Usuario]);

        // Si rowCount es 0, significa que la combinación de equipo/usuario no existe
        if (rowCount === 0) {
            return res.status(404).json({ message: "No se encontró al miembro en el equipo especificado." });
        }

        res.status(200).json({
            message: "Rol actualizado correctamente.",
            miembro: rows[0]
        });

    } catch (error) {
        console.error("Error al actualizar el rol del miembro:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.get("/:ID_Equipo/miembros", async (req, res) => {
    try {
        const { ID_Equipo } = req.params;

        const query = `
            SELECT 
                u."ID_Usuario", u."Nombre_Usuario", u."Correo", u."Color", me."Rol_equipo"
            FROM "Usuarios" u
            JOIN "MiembrosEquipos" me ON u."ID_Usuario" = me."ID_Usuario"
            WHERE me."ID_Equipo" = $1
            ORDER BY u."Nombre_Usuario" ASC;
        `;

        const { rows } = await pool.query(query, [ID_Equipo]);

        // Es importante verificar si el equipo existe para dar un 404 claro
        if (rows.length === 0) {
            const teamExists = await pool.query('SELECT 1 FROM "Equipos" WHERE "ID_Equipo" = $1', [ID_Equipo]);
            if (teamExists.rowCount === 0) {
                return res.status(404).json({ message: "El equipo no existe." });
            }
        }
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Error al obtener los miembros del equipo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.delete("/:ID_Equipo/miembros/:ID_Usuario", async (req, res) => {
    try {
        const { ID_Equipo, ID_Usuario } = req.params;

        // Opcional pero recomendado: Lógica de seguridad para no eliminar al creador
        // const equipoResult = await pool.query('SELECT "ID_Usuario_Creador" FROM "Equipos" WHERE "ID_Equipo" = $1', [ID_Equipo]);
        // if (equipoResult.rows[0]?.ID_Usuario_Creador == ID_Usuario) {
        //     return res.status(403).json({ message: "No se puede eliminar al creador del equipo." });
        // }

        const query = `
            DELETE FROM "MiembrosEquipos"
            WHERE "ID_Equipo" = $1 AND "ID_Usuario" = $2;
        `;

        const { rowCount } = await pool.query(query, [ID_Equipo, ID_Usuario]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "No se encontró al miembro en el equipo especificado para eliminar." });
        }

        res.status(200).json({ message: "✅ Miembro eliminado del equipo correctamente." });

    } catch (error) {
        console.error("❌ Error al eliminar al miembro del equipo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.post("/:ID_Equipo/miembros", async (req, res) => {
    try {
        const { ID_Equipo } = req.params;
        const { ID_Usuario } = req.body;

        if (!ID_Usuario) {
            return res.status(400).json({ message: "Se requiere el ID del usuario a invitar." });
        }

        // Por defecto, se añade como 'Miembro'.
        const query = `
            INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
            VALUES ($1, $2, 'Miembro')
            RETURNING *;
        `;
        
        const { rows } = await pool.query(query, [ID_Equipo, ID_Usuario]);

        res.status(201).json({ message: "✅ Miembro añadido al equipo.", miembro: rows[0] });

    } catch (error) {
        // Código '23505' es para violación de 'unique constraint' (el usuario ya es miembro)
        if (error.code === '23505') {
            return res.status(409).json({ message: "Este usuario ya es miembro del equipo." });
        }
        console.error("❌ Error al añadir miembro:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

export default router;