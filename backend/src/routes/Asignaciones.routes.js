import { Router } from  "express";
import pool from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT
                a.*,
                STRING_AGG(u."Nombre_Usuario", ', ') AS "usuarios_asignados"
            FROM "Asignaciones" a
            LEFT JOIN "UsuariosAsignados" ua ON a."ID_Asignacion" = ua."ID_Asignacion"
            LEFT JOIN "Usuarios" u ON ua."ID_Usuario" = u."ID_Usuario"
            GROUP BY a."ID_Asignacion"
            ORDER BY a."Fecha_Creacion" DESC;
        `;

        const { rows } = await pool.query(query);
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener la lista simple de asignaciones:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
 
//Traer por usurio
router.get("/usuarios/:ID_Usuario", async (req, res) => {
    try {
        const { ID_Usuario } = req.params;
        
        const query = `
            SELECT
                a."ID_Asignacion",
                a."Titulo_Asignacion",
                a."Descripción_Asignacion",
                a."Prioridad",
                a."Estado_Asignacion",
                a."Fecha_Creacion",
                a."Fecha_Entrega",
                p."Nombre_Proyecto",
                e."Nombre_Equipo",
                json_build_object(
                    'ID_Usuario', creador."ID_Usuario",
                    'Nombre_Usuario', creador."Nombre_Usuario",
                    'Color', creador."Color"
                ) AS "creado_por",
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
                    INNER JOIN "UsuariosAsignados" ua_inner ON u."ID_Usuario" = ua_inner."ID_Usuario"
                    WHERE ua_inner."ID_Asignacion" = a."ID_Asignacion"
                ) AS "usuarios_asignados"
            FROM "Asignaciones" a
            INNER JOIN "UsuariosAsignados" ua_outer ON a."ID_Asignacion" = ua_outer."ID_Asignacion"
            LEFT JOIN "Proyectos" p ON a."ID_Proyecto" = p."ID_Proyecto"
            LEFT JOIN "Equipos" e ON p."ID_Equipo" = e."ID_Equipo"
            LEFT JOIN "Usuarios" creador ON a."Creado_Por" = creador."ID_Usuario"
            WHERE ua_outer."ID_Usuario" = $1
            GROUP BY 
                a."ID_Asignacion",
                creador."ID_Usuario", -- Se añade el creador al GROUP BY
                p."Nombre_Proyecto", 
                e."Nombre_Equipo"
            ORDER BY a."Fecha_Creacion" DESC;
        `;

        const result = await pool.query(query, [ID_Usuario]);



        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Error al obtener las asignaciones:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Traer por el usuario creador
router.get("/:ID_Usuario/enviadas", async (req, res) => {
    try {
        const { ID_Usuario } = req.params;

        const query = `
            SELECT
                a."ID_Asignacion",
                a."Titulo_Asignacion",
                a."Descripción_Asignacion",
                a."Prioridad",
                a."Estado_Asignacion",
                a."Fecha_Creacion",
                a."Fecha_Entrega",
                p."Nombre_Proyecto",
                e."Nombre_Equipo",
                json_build_object(
                    'ID_Usuario', creador."ID_Usuario",
                    'Nombre_Usuario', creador."Nombre_Usuario",
                    'Color', creador."Color"
                ) AS "creado_por",
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
                    INNER JOIN "UsuariosAsignados" ua_inner ON u."ID_Usuario" = ua_inner."ID_Usuario"
                    WHERE ua_inner."ID_Asignacion" = a."ID_Asignacion"
                ) AS "usuarios_asignados"
            FROM "Asignaciones" a
            LEFT JOIN "Proyectos" p ON a."ID_Proyecto" = p."ID_Proyecto"
            LEFT JOIN "Equipos" e ON p."ID_Equipo" = e."ID_Equipo"
            LEFT JOIN "Usuarios" creador ON a."Creado_Por" = creador."ID_Usuario"
            WHERE 
                a."Creado_Por" = $1 
                AND a."Estado_Asignacion" = 'Enviados'
            GROUP BY 
                a."ID_Asignacion",
                creador."ID_Usuario",
                p."Nombre_Proyecto", 
                e."Nombre_Equipo"
            ORDER BY a."Fecha_Creacion" DESC;
        `;

        const { rows } = await pool.query(query, [ID_Usuario]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener las asignaciones enviadas:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Modificar el estado
router.patch("/:ID_Asignacion/estado", async (req, res) => {
    //Obtener los datos necesarios
    const { ID_Asignacion } = req.params;
    const { ID_Usuario, nuevo_estado } = req.body;

    //Validar que la información esté completa
    if (!ID_Usuario || !nuevo_estado) {
        return res.status(400).json({ message: "Se requiere el ID del usuario y el nuevo estado." });
    }

    const client = await pool.connect();

    try {
        // Iniciar la transacción
        await client.query('BEGIN');

        // Obtener el estado actual de la asignación
        const estadoAnteriorResult = await client.query(
            'SELECT "Estado_Asignacion" FROM "Asignaciones" WHERE "ID_Asignacion" = $1',
            [ID_Asignacion]
        );

        if (estadoAnteriorResult.rows.length === 0) {
            throw new Error("Asignación no encontrada.");
        }
        const estado_anterior = estadoAnteriorResult.rows[0].Estado_Asignacion;

        // Actualizar la tabla "Asignaciones"
        const updateAsignacionResult = await client.query(
            'UPDATE "Asignaciones" SET "Estado_Asignacion" = $1 WHERE "ID_Asignacion" = $2 RETURNING *',
            [nuevo_estado, ID_Asignacion]
        );

        // Insertar el registro en la tabla "Historial_Asignacion"
        await client.query(
            'INSERT INTO "Historial_Asignacion" ("ID_Asignacion", "ID_Usuario", "Estado_Anterior", "Estado_Nuevo") VALUES ($1, $2, $3, $4)',
            [ID_Asignacion, ID_Usuario, estado_anterior, nuevo_estado]
        );

        // Si todo sale bien, se guardan los cambios
        await client.query('COMMIT');

        res.status(200).json({
            message: "Estado actualizado y cambio registrado en el historial.",
            asignacion: updateAsignacionResult.rows[0]
        });

    } catch (error) {
        // Si algo falla, se deshacen todos los cambios
        await client.query('ROLLBACK');
        console.error("Error en la transacción:", error);
        
        if (error.message === "Asignación no encontrada.") {
            return res.status(404).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        // Liberar la conexión
        client.release();
    }
});

//Traer el historial
router.get("/:ID_Asignacion/historial", async (req, res) => {
    try {
        const { ID_Asignacion } = req.params;

        const query = `
            SELECT 
                h."ID_Historial",
                h."Estado_Anterior",
                h."Estado_Nuevo",
                h."Fecha_Cambio",
                u."Nombre_Usuario" AS "usuario_que_modifico",
                u."Color" AS "usuario_color"
            FROM "Historial_Asignacion" h
            JOIN "Usuarios" u ON h."ID_Usuario" = u."ID_Usuario"
            WHERE h."ID_Asignacion" = $1
            ORDER BY h."Fecha_Cambio" ASC;
        `;

        const { rows } = await pool.query(query, [ID_Asignacion]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener el historial de la asignación:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//crear nueva
router.post("/", async (req, res) => {
    // 1. Extraer los datos del cuerpo de la solicitud
    const {
        Titulo_Asignacion,
        Descripción_Asignacion,
        Prioridad,
        Fecha_Entrega,
        ID_Proyecto,
        Creado_Por,
        usuarios,
        archivos 
    } = req.body;

    // 2. Validación actualizada según tus reglas.
    if (!Titulo_Asignacion || !Prioridad || !Fecha_Entrega || !Creado_Por || !usuarios || usuarios.length === 0) {
        return res.status(400).json({ 
            message: "Faltan datos obligatorios: Título, Prioridad, Fecha de Entrega, Creador y al menos un usuario asignado." 
        });
    }
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const insertAsignacionQuery = `
            INSERT INTO "Asignaciones" (
                "Titulo_Asignacion", "Descripción_Asignacion", "Prioridad", "Estado_Asignacion", 
                "Fecha_Entrega", "ID_Proyecto", "Creado_Por"
            ) VALUES ($1, $2, $3, 'Asignaciones', $4, $5, $6)
            RETURNING "ID_Asignacion";
        `;
        const asignacionResult = await client.query(insertAsignacionQuery, [
            Titulo_Asignacion, 
            Descripción_Asignacion, 
            Prioridad, 
            Fecha_Entrega, 
            ID_Proyecto || null,
            Creado_Por
        ]);
        const newAssignmentId = asignacionResult.rows[0].ID_Asignacion;

        const userValues = usuarios.flatMap(userId => [newAssignmentId, userId]);
        const userPlaceholders = usuarios.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(', ');
        const insertUsuariosQuery = `INSERT INTO "UsuariosAsignados" ("ID_Asignacion", "ID_Usuario") VALUES ${userPlaceholders};`;
        await client.query(insertUsuariosQuery, userValues);

        if (archivos && archivos.length > 0) {
        }

        await client.query('COMMIT');
        res.status(201).json({ 
            message: "Asignación creada exitosamente.",
            ID_Asignacion: newAssignmentId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al crear la asignación:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        client.release();
    }
});

//Traer por proyecto
router.get("/proyecto/:ID_Proyecto", async (req, res) => {
    try {
        const { ID_Proyecto } = req.params;

        // ESTA ES LA CONSULTA CORREGIDA
        const query = `
            SELECT
                a.*, -- Trae todos los campos de la asignación
                ( -- Inicia una subconsulta para construir el array de usuarios
                    SELECT json_agg(
                        json_build_object(
                            'ID_Usuario', u."ID_Usuario",
                            'Nombre_Usuario', u."Nombre_Usuario",
                            'Color', u."Color"
                        )
                    )
                    FROM "Usuarios" u
                    INNER JOIN "UsuariosAsignados" ua ON u."ID_Usuario" = ua."ID_Usuario"
                    WHERE ua."ID_Asignacion" = a."ID_Asignacion"
                ) AS "usuarios_asignados" -- Nombra el array resultante
            FROM "Asignaciones" a
            WHERE a."ID_Proyecto" = $1
            ORDER BY a."Fecha_Creacion" DESC;
        `;

        const { rows } = await pool.query(query, [ID_Proyecto]);
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener las asignaciones por proyecto:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Modificar prioridad
router.patch("/:ID_Asignacion/prioridad", async (req, res) => {
    try {
        const { ID_Asignacion } = req.params;
        const { Prioridad } = req.body;

        if (!Prioridad) {
            return res.status(400).json({ message: "Se requiere la nueva 'Prioridad'." });
        }

        const query = `
            UPDATE "Asignaciones" SET "Prioridad" = $1 
            WHERE "ID_Asignacion" = $2 RETURNING "ID_Asignacion", "Prioridad";
        `;
        const { rows, rowCount } = await pool.query(query, [Prioridad, ID_Asignacion]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Asignación no encontrada." });
        }

        res.status(200).json({ message: "Prioridad actualizada.", asignacion: rows[0] });

    } catch (error) {
        console.error("Error al actualizar la prioridad:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Modificar fecha
router.patch("/:ID_Asignacion/fecha-entrega", async (req, res) => {
    try {
        const { ID_Asignacion } = req.params;
        const { Fecha_Entrega } = req.body;

        if (!Fecha_Entrega) {
            return res.status(400).json({ message: "Se requiere la nueva 'Fecha_Entrega'." });
        }

        const query = `
            UPDATE "Asignaciones" SET "Fecha_Entrega" = $1 
            WHERE "ID_Asignacion" = $2 RETURNING "ID_Asignacion", "Fecha_Entrega";
        `;
        const { rows, rowCount } = await pool.query(query, [Fecha_Entrega, ID_Asignacion]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Asignación no encontrada." });
        }

        res.status(200).json({ message: "Fecha de entrega actualizada.", asignacion: rows[0] });

    } catch (error) {
        console.error("Error al actualizar la fecha:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Modificar usuarios
router.patch("/:ID_Asignacion/usuarios", async (req, res) => {
    const { ID_Asignacion } = req.params;
    const { usuarios_a_anadir, usuarios_a_quitar } = req.body;

    if ((!usuarios_a_anadir || usuarios_a_anadir.length === 0) && (!usuarios_a_quitar || usuarios_a_quitar.length === 0)) {
        return res.status(400).json({ message: "No se proporcionaron usuarios para añadir o quitar." });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (usuarios_a_quitar && usuarios_a_quitar.length > 0) {
            const placeholders = usuarios_a_quitar.map((_, i) => `$${i + 2}`).join(',');
            const deleteQuery = `DELETE FROM "UsuariosAsignados" WHERE "ID_Asignacion" = $1 AND "ID_Usuario" IN (${placeholders})`;
            await client.query(deleteQuery, [ID_Asignacion, ...usuarios_a_quitar]);
        }

        if (usuarios_a_anadir && usuarios_a_anadir.length > 0) {
            const values = usuarios_a_anadir.flatMap(userId => [ID_Asignacion, userId]);
            const placeholders = usuarios_a_anadir.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ');
            const insertQuery = `INSERT INTO "UsuariosAsignados" ("ID_Asignacion", "ID_Usuario") VALUES ${placeholders} ON CONFLICT DO NOTHING;`;
            await client.query(insertQuery, values);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: "Lista de usuarios actualizada correctamente." });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al modificar usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        client.release();
    }
});

//Eliminar
router.delete("/:ID_Asignacion", async (req, res) => {
    const { ID_Asignacion } = req.params;
    const { ID_Usuario_solicitante } = req.body;

    if (!ID_Usuario_solicitante) {
        return res.status(400).json({ message: "Se requiere el ID del usuario que realiza la acción." });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const asignacionQuery = 'SELECT "Creado_Por" FROM "Asignaciones" WHERE "ID_Asignacion" = $1';
        const asignacionResult = await client.query(asignacionQuery, [ID_Asignacion]);

        if (asignacionResult.rowCount === 0) {
            return res.status(404).json({ message: "La asignación no existe." });
        }
        const creadorId = asignacionResult.rows[0].Creado_Por;
        
        const rolQuery = 'SELECT r."Rol" FROM "Usuarios" u JOIN "Roles" r ON u."ID_Rol" = r."ID_Rol" WHERE u."ID_Usuario" = $1';
        const rolResult = await client.query(rolQuery, [ID_Usuario_solicitante]);
        const rolUsuario = rolResult.rowCount > 0 ? rolResult.rows[0].Rol : null;

        if (creadorId !== ID_Usuario_solicitante && rolUsuario !== 'Admin') {
            return res.status(403).json({ message: "Permiso denegado. Solo el creador o un administrador pueden eliminar la asignación." });
        }

        await client.query('DELETE FROM "Asignaciones" WHERE "ID_Asignacion" = $1', [ID_Asignacion]);

        await client.query('COMMIT');
        res.status(200).json({ message: `Asignación con ID ${ID_Asignacion} eliminada correctamente.` });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al eliminar la asignación:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    } finally {
        client.release();
    }
});

router.patch("/batch-update", async (req, res) => {
  const { taskIds, updates } = req.body // taskIds es un array [1, 2], updates es un objeto { prioridad: 'Alta' }

  if (!taskIds || !updates || taskIds.length === 0 || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Se requieren IDs de tareas y campos para actualizar." })
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Lógica para actualizar campos simples (Prioridad, Fechas)
    if (updates.prioridad || updates.fecha_inicio || updates.fecha_termino) {
      let updateQuery = 'UPDATE "Asignaciones" SET '
      const fields = []
      const values = []
      let valueIndex = 1

      if (updates.prioridad) {
        fields.push(`"Prioridad" = $${valueIndex++}`)
        values.push(updates.prioridad)
      }
      if (updates.fecha_inicio) {
        fields.push(`"Fecha_Creacion" = $${valueIndex++}`)
        values.push(updates.fecha_inicio)
      }
      if (updates.fecha_termino) {
        fields.push(`"Fecha_Entrega" = $${valueIndex++}`)
        values.push(updates.fecha_termino)
      }

      values.push(taskIds)
      updateQuery += `${fields.join(", ")} WHERE "ID_Asignacion" = ANY($${valueIndex}::integer[]) RETURNING "ID_Asignacion"`

      await client.query(updateQuery, values)
    }

    // Lógica para actualizar usuarios asignados (reemplaza los existentes)
    if (updates.asignados) {
      // 1. Borra todos los usuarios actuales de esas tareas
      await client.query('DELETE FROM "UsuariosAsignados" WHERE "ID_Asignacion" = ANY($1::integer[])', [taskIds])

      // 2. Construye la inserción múltiple para los nuevos usuarios
      const values = []
      const placeholders = []
      let i = 1
      for (const taskId of taskIds) {
        for (const userId of updates.asignados) {
          placeholders.push(`($${i++}, $${i++})`)
          values.push(taskId, userId)
        }
      }
      // Solo inserta si hay valores que insertar
      if (values.length > 0) {
        const insertQuery = `INSERT INTO "UsuariosAsignados" ("ID_Asignacion", "ID_Usuario") VALUES ${placeholders.join(", ")}`
        await client.query(insertQuery, values)
      }
    }

    await client.query("COMMIT")
    res.status(200).json({ message: "Tareas actualizadas exitosamente." })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error en la actualización por lote:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  } finally {
    client.release()
  }
})

router.delete("/batch-delete", async (req, res) => {
  const { taskIds } = req.body

  if (!taskIds || taskIds.length === 0) {
    return res.status(400).json({ message: "Se requieren IDs de tareas para eliminar." })
  }

  try {
    const query = 'DELETE FROM "Asignaciones" WHERE "ID_Asignacion" = ANY($1::integer[])'
    await pool.query(query, [taskIds])
    res.status(200).json({ message: "Asignaciones eliminadas correctamente." })
  } catch (error) {
    console.error("Error al eliminar asignaciones:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

export default router;
