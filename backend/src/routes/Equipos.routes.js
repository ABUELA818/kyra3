import { Router } from "express"
import pool from "../config/db.js"

const router = Router()

//Traer todos los equipos
router.get("/", async (req, res) => {
  try {
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
          SELECT COUNT(*)
          FROM "MiembrosEquipos" me
          WHERE me."ID_Equipo" = e."ID_Equipo"
        )::int AS "numero_miembros"
      FROM "Equipos" e
      LEFT JOIN "Usuarios" creador ON e."ID_Usuario_Creador" = creador."ID_Usuario"
      GROUP BY e."ID_Equipo", creador."ID_Usuario"
      ORDER BY e."Fecha_Creacion" DESC;
    `
    const { rows } = await pool.query(query)
    res.status(200).json(rows)
  } catch (error) {
    console.error("Error al obtener equipos:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

//Traer por usuario
router.get("/usuario/:ID_Usuario", async (req, res) => {
  try {
    const { ID_Usuario } = req.params

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
        `

    const { rows } = await pool.query(query, [ID_Usuario])

    res.status(200).json(rows)
  } catch (error) {
    console.error("Error al obtener los equipos del usuario:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

//Traer por usuario
router.get("/usuario/:ID_Usuario", async (req, res) => {
  try {
    const { ID_Usuario } = req.params

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
        `

    const { rows } = await pool.query(query, [ID_Usuario])

    res.status(200).json(rows)
  } catch (error) {
    console.error("Error al obtener los equipos del usuario:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

//Obtener miembros de un equipo
router.get("/:ID_Equipo/miembros", async (req, res) => {
  try {
    const { ID_Equipo } = req.params

    const query = `
            SELECT 
                u."ID_Usuario", u."Nombre_Usuario", u."Correo", u."Color", me."Rol_equipo"
            FROM "Usuarios" u
            JOIN "MiembrosEquipos" me ON u."ID_Usuario" = me."ID_Usuario"
            WHERE me."ID_Equipo" = $1
            ORDER BY u."Nombre_Usuario" ASC;
        `

    const { rows } = await pool.query(query, [ID_Equipo])

    if (rows.length === 0) {
      const teamExists = await pool.query('SELECT 1 FROM "Equipos" WHERE "ID_Equipo" = $1', [ID_Equipo])
      if (teamExists.rowCount === 0) {
        return res.status(404).json({ message: "El equipo no existe." })
      }
    }

    res.status(200).json(rows)
  } catch (error) {
    console.error("❌ Error al obtener los miembros del equipo:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

//Traer detalles de un equipo por ID
router.get("/:ID_Equipo", async (req, res) => {
  try {
    const { ID_Equipo } = req.params

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
          SELECT COUNT(*)
          FROM "MiembrosEquipos" me
          WHERE me."ID_Equipo" = e."ID_Equipo"
        )::int AS "numero_miembros"
      FROM "Equipos" e
      LEFT JOIN "Usuarios" creador ON e."ID_Usuario_Creador" = creador."ID_Usuario"
      WHERE e."ID_Equipo" = $1
      GROUP BY e."ID_Equipo", creador."ID_Usuario";
    `

    const { rows } = await pool.query(query, [ID_Equipo])

    if (rows.length === 0) {
      return res.status(404).json({ message: "Equipo no encontrado." })
    }

    res.status(200).json(rows[0])
  } catch (error) {
    console.error("Error al obtener detalles del equipo:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

router.put("/:ID_Equipo", async (req, res) => {
  try {
    const { ID_Equipo } = req.params
    const { Nombre_Equipo } = req.body

    if (!Nombre_Equipo) {
      return res.status(400).json({ message: "Se requiere el nombre del equipo." })
    }

    const query = `
      UPDATE "Equipos" 
      SET "Nombre_Equipo" = $1
      WHERE "ID_Equipo" = $2
      RETURNING *;
    `
    const { rows, rowCount } = await pool.query(query, [Nombre_Equipo, ID_Equipo])

    if (rowCount === 0) {
      return res.status(404).json({ message: "Equipo no encontrado." })
    }

    res.status(200).json({ message: "Equipo actualizado correctamente.", equipo: rows[0] })
  } catch (error) {
    console.error("Error al actualizar equipo:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

router.delete("/:ID_Equipo", async (req, res) => {
  const { ID_Equipo } = req.params

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Check if team has projects
    const projectsCheck = await client.query('SELECT COUNT(*) FROM "Proyectos" WHERE "ID_Equipo" = $1', [ID_Equipo])

    if (Number.parseInt(projectsCheck.rows[0].count) > 0) {
      return res.status(400).json({
        message: "No se puede eliminar el equipo porque tiene proyectos asociados.",
      })
    }

    // Delete team members first
    await client.query('DELETE FROM "MiembrosEquipos" WHERE "ID_Equipo" = $1', [ID_Equipo])

    // Delete team
    const result = await client.query('DELETE FROM "Equipos" WHERE "ID_Equipo" = $1 RETURNING *', [ID_Equipo])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Equipo no encontrado." })
    }

    await client.query("COMMIT")
    res.status(200).json({ message: "Equipo eliminado correctamente." })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error al eliminar equipo:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  } finally {
    client.release()
  }
})

//Crear nuevo
router.post("/", async (req, res) => {
  const { Nombre_Equipo, ID_Usuario_Creador, miembros } = req.body

  if (!Nombre_Equipo || !ID_Usuario_Creador || !miembros || miembros.length === 0) {
    return res.status(400).json({
      message: "Faltan datos. Se requiere nombre del equipo, ID del creador y al menos un miembro.",
    })
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Paso 1: Insertar el nuevo equipo y obtener su ID.
    const insertEquipoQuery = `
            INSERT INTO "Equipos" ("Nombre_Equipo", "ID_Usuario_Creador")
            VALUES ($1, $2)
            RETURNING "ID_Equipo";
        `
    const equipoResult = await client.query(insertEquipoQuery, [Nombre_Equipo, ID_Usuario_Creador])
    const newTeamId = equipoResult.rows[0].ID_Equipo

    // Paso 2: Insertar al creador en "MiembrosEquipos" con el rol 'Creador'.
    const insertCreadorQuery = `
            INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
            VALUES ($1, $2, 'Creador');
        `
    await client.query(insertCreadorQuery, [newTeamId, ID_Usuario_Creador])

    // Paso 3: Filtrar a los demás miembros (excluyendo al creador si ya está en la lista).
    const otrosMiembros = miembros.filter((miembroId) => miembroId !== ID_Usuario_Creador)

    // Solo se ejecuta si hay otros miembros que añadir.
    if (otrosMiembros.length > 0) {
      const values = []
      const placeholders = otrosMiembros
        .map((userId, index) => {
          const offset = index * 3
          values.push(newTeamId, userId, "Miembro")
          return `($${offset + 1}, $${offset + 2}, $${offset + 3})`
        })
        .join(", ")

      const insertMiembrosQuery = `
                INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
                VALUES ${placeholders};
            `
      await client.query(insertMiembrosQuery, values)
    }

    const todosLosMiembros = [ID_Usuario_Creador, ...otrosMiembros]
    await crearConversacionGrupo(client, Nombre_Equipo, newTeamId, todosLosMiembros)

    await client.query("COMMIT")

    res.status(201).json({
      message: "Equipo creado y roles asignados correctamente.",
      ID_Equipo: newTeamId,
    })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error al crear el equipo:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  } finally {
    client.release()
  }
})

//Modificar rol de miembros
router.patch("/:ID_Equipo/miembros/:ID_Usuario", async (req, res) => {
  try {
    const { ID_Equipo, ID_Usuario } = req.params
    const { nuevo_rol, ID_Usuario_Actual } = req.body

    if (!nuevo_rol) {
      return res.status(400).json({ message: "Se requiere el 'nuevo_rol' en el cuerpo de la solicitud." })
    }

    if (!["Admin", "Miembro"].includes(nuevo_rol)) {
      return res.status(400).json({ message: "El rol debe ser 'Admin' o 'Miembro'." })
    }

    if (ID_Usuario_Actual) {
      const permissionCheck = await pool.query(
        `SELECT "Rol_equipo" FROM "MiembrosEquipos" WHERE "ID_Equipo" = $1 AND "ID_Usuario" = $2`,
        [ID_Equipo, ID_Usuario_Actual],
      )

      if (permissionCheck.rows.length === 0) {
        return res.status(403).json({ message: "No eres miembro de este equipo." })
      }

      const rolActual = permissionCheck.rows[0].Rol_equipo
      if (rolActual !== "Creador" && rolActual !== "Admin") {
        return res.status(403).json({
          message: "No tienes permisos para modificar roles. Solo el Creador o Administradores pueden hacerlo.",
        })
      }
    }

    const creatorCheck = await pool.query(
      `SELECT e."ID_Usuario_Creador", me."Rol_equipo" 
       FROM "Equipos" e 
       JOIN "MiembrosEquipos" me ON e."ID_Equipo" = me."ID_Equipo" AND me."ID_Usuario" = $2
       WHERE e."ID_Equipo" = $1`,
      [ID_Equipo, ID_Usuario],
    )

    if (creatorCheck.rows.length > 0 && creatorCheck.rows[0].Rol_equipo === "Creador") {
      return res.status(403).json({ message: "No se puede modificar el rol del creador del equipo." })
    }

    const query = `
            UPDATE "MiembrosEquipos"
            SET "Rol_equipo" = $1
            WHERE "ID_Equipo" = $2 AND "ID_Usuario" = $3
            RETURNING *;
        `

    const { rows, rowCount } = await pool.query(query, [nuevo_rol, ID_Equipo, ID_Usuario])

    if (rowCount === 0) {
      return res.status(404).json({ message: "No se encontró al miembro en el equipo especificado." })
    }

    res.status(200).json({
      message: "Rol actualizado correctamente.",
      miembro: rows[0],
    })
  } catch (error) {
    console.error("Error al actualizar el rol del miembro:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

router.delete("/:ID_Equipo/miembros/:ID_Usuario", async (req, res) => {
  try {
    const { ID_Equipo, ID_Usuario } = req.params
    const ID_Usuario_Actual = req.query.ID_Usuario_Actual

    if (ID_Usuario_Actual) {
      const permissionCheck = await pool.query(
        `SELECT "Rol_equipo" FROM "MiembrosEquipos" WHERE "ID_Equipo" = $1 AND "ID_Usuario" = $2`,
        [ID_Equipo, ID_Usuario_Actual],
      )

      if (permissionCheck.rows.length === 0) {
        return res.status(403).json({ message: "No eres miembro de este equipo." })
      }

      const rolActual = permissionCheck.rows[0].Rol_equipo
      if (rolActual !== "Creador" && rolActual !== "Admin") {
        return res.status(403).json({
          message: "No tienes permisos para eliminar miembros. Solo el Creador o Administradores pueden hacerlo.",
        })
      }
    }

    const creatorCheck = await pool.query(
      `SELECT e."ID_Usuario_Creador", me."Rol_equipo" 
       FROM "Equipos" e 
       JOIN "MiembrosEquipos" me ON e."ID_Equipo" = me."ID_Equipo" AND me."ID_Usuario" = $2
       WHERE e."ID_Equipo" = $1`,
      [ID_Equipo, ID_Usuario],
    )

    if (creatorCheck.rows.length > 0 && creatorCheck.rows[0].Rol_equipo === "Creador") {
      return res.status(403).json({ message: "No se puede eliminar al creador del equipo." })
    }

    const query = `
            DELETE FROM "MiembrosEquipos"
            WHERE "ID_Equipo" = $1 AND "ID_Usuario" = $2;
        `

    const { rowCount } = await pool.query(query, [ID_Equipo, ID_Usuario])

    if (rowCount === 0) {
      return res.status(404).json({ message: "No se encontró al miembro en el equipo especificado para eliminar." })
    }

    res.status(200).json({ message: "✅ Miembro eliminado del equipo correctamente." })
  } catch (error) {
    console.error("❌ Error al eliminar al miembro del equipo:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

router.post("/:ID_Equipo/miembros", async (req, res) => {
  try {
    const { ID_Equipo } = req.params
    const { ID_Usuario } = req.body

    if (!ID_Usuario) {
      return res.status(400).json({ message: "Se requiere el ID del usuario a invitar." })
    }

    const query = `
            INSERT INTO "MiembrosEquipos" ("ID_Equipo", "ID_Usuario", "Rol_equipo")
            VALUES ($1, $2, 'Miembro')
            RETURNING *;
        `

    const { rows } = await pool.query(query, [ID_Equipo, ID_Usuario])

    res.status(201).json({ message: "✅ Miembro añadido al equipo.", miembro: rows[0] })
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Este usuario ya es miembro del equipo." })
    }
    console.error("❌ Error al añadir miembro:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

async function crearConversacionGrupo(client, nombreGrupo, idEquipo, miembrosIds) {
  const crearConversacionQuery = `
    INSERT INTO "Conversaciones" ("Nombre_Conversacion", "Es_Grupo", "ID_Equipo")
    VALUES ($1, true, $2)
    RETURNING "ID_Conversacion"
  `

  const resultado = await client.query(crearConversacionQuery, [nombreGrupo, idEquipo])
  const conversacionId = resultado.rows[0].ID_Conversacion

  if (miembrosIds && miembrosIds.length > 0) {
    const values = []
    const placeholders = miembrosIds
      .map((userId, index) => {
        const offset = index * 2
        values.push(conversacionId, userId)
        return `($${offset + 1}, $${offset + 2})`
      })
      .join(", ")

    const asociarUsuariosQuery = `
      INSERT INTO "Usuario_Conversacion" ("ID_Conversacion", "ID_Usuario", "LastReadAt")
      VALUES ${placeholders}
    `

    await client.query(asociarUsuariosQuery, values)
  }

  return conversacionId
}

export default router
