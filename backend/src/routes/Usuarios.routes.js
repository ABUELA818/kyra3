import { Router } from "express"
import pool from "../config/db.js"

const router = Router()

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" })
    }

    // 1. Busca al usuario en la base de datos
    const query = `
      SELECT "ID_Usuario", "Nombre_Usuario", "Correo", "ID_Rol", "Contrasena"
      FROM "Usuarios" 
      WHERE "Correo" = $1
    `
    const { rows } = await pool.query(query, [email])

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const usuarioEncontrado = rows[0]

    // 2. Validación de contraseña
    // Comparing plain text password (for production, use bcrypt)
    const esValida = password === usuarioEncontrado.Contrasena

    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    // 3. Devuelve los datos del usuario
    //    Cambiamos el formato para que coincida con lo que el frontend espera
    const usuarioParaFrontend = {
      id: usuarioEncontrado.ID_Usuario,
      email: usuarioEncontrado.Correo,
      nombre: usuarioEncontrado.Nombre_Usuario,
      ID_Rol: usuarioEncontrado.ID_Rol,
      token: `token_real_del_backend_${Date.now()}`,
    }

    res.status(200).json(usuarioParaFrontend)
  } catch (error) {
    console.error("Error en login de backend:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

//Traer por equipo
router.get("/equipos/:ID_Equipo", async (req, res) => {
  try {
    const { ID_Equipo } = req.params

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
        `

    const { rows } = await pool.query(query, [ID_Equipo])

    res.status(200).json(rows)
  } catch (error) {
    console.error("Error al obtener los miembros del equipo:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const query = `
      SELECT 
        "ID_Usuario" as id,
        "Nombre_Usuario" as nombre,
        "Correo" as correo,
        "Color" as color,
        "ID_Rol" as rol
      FROM "Usuarios"
      WHERE "ID_Usuario" = $1
    `

    const { rows } = await pool.query(query, [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(rows[0])
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
})

router.get("/", async (req, res) => {
  try {
    const { search, exclude } = req.query

    let query = `
            SELECT "ID_Usuario", "Nombre_Usuario", "Correo", "Color", "ID_Rol", "Fecha_Creacion"
            FROM "Usuarios" 
        `
    const params = []
    const conditions = []

    if (search) {
      conditions.push(`"Nombre_Usuario" ILIKE $${params.length + 1}`)
      params.push(`%${search}%`)
    }

    if (exclude) {
      conditions.push(`"ID_Usuario" != $${params.length + 1}`)
      params.push(exclude)
    }

    if (conditions.length > 0) {
      query += `WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY "Nombre_Usuario" ASC;`

    const { rows } = await pool.query(query, params)

    // Return data in both formats to support both use cases
    if (req.headers.accept === "application/json-admin") {
      // For admin dashboard, return full format
      res.status(200).json(rows)
    } else {
      // For other uses, return mapped format
      const usuariosMapeados = rows.map((row) => ({
        id: row.ID_Usuario,
        nombre: row.Nombre_Usuario,
        color: row.Color,
        correo: row.Correo,
      }))
      res.status(200).json(usuariosMapeados)
    }
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error)
    res.status(500).json({ message: "Error interno del servidor." })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { Nombre_Usuario, Correo, ID_Rol, Contraseña, Color } = req.body

    // Build dynamic update query based on provided fields
    const updateFields = []
    const params = []
    let paramCount = 1

    if (Nombre_Usuario !== undefined) {
      updateFields.push(`"Nombre_Usuario" = $${paramCount}`)
      params.push(Nombre_Usuario)
      paramCount++
    }

    if (Correo !== undefined) {
      updateFields.push(`"Correo" = $${paramCount}`)
      params.push(Correo)
      paramCount++
    }

    if (ID_Rol !== undefined) {
      updateFields.push(`"ID_Rol" = $${paramCount}`)
      params.push(ID_Rol)
      paramCount++
    }

    if (Contraseña !== undefined && Contraseña !== "") {
      // In production, you should hash the password with bcrypt
      updateFields.push(`"Contrasena" = $${paramCount}`)
      params.push(Contraseña)
      paramCount++
    }

    if (Color !== undefined) {
      updateFields.push(`"Color" = $${paramCount}`)
      params.push(Color)
      paramCount++
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No hay campos para actualizar" })
    }

    params.push(id)

    const query = `
      UPDATE "Usuarios"
      SET ${updateFields.join(", ")}
      WHERE "ID_Usuario" = $${paramCount}
      RETURNING "ID_Usuario", "Nombre_Usuario", "Correo", "ID_Rol", "Color", "Fecha_Creacion"
    `

    const { rows } = await pool.query(query, params)

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(rows[0])
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
})

export default router
