import { Router } from "express";
import pool from "../config/db.js";
import multer from "multer";
import path from "path";

const router = Router();

// --- Configuración de Multer ---
// Esto le dice a Multer dónde y cómo guardar los archivos.
const storage = multer.diskStorage({
    // La carpeta de destino para los archivos subidos.
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    // Cómo nombrar el archivo para evitar nombres duplicados.
    filename: (req, file, cb) => {
        // Crea un nombre único: timestamp + nombre original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Inicializa Multer con la configuración de almacenamiento.
const upload = multer({ storage: storage });

//Subir/Crear Archivoa
router.post("/upload", upload.single('archivo'), async (req, res) => {

    try {
        // 1. Extraer datos del cuerpo del formulario y del archivo subido
        const { ID_Equipo, ID_Dueno, ID_Carpeta } = req.body;
        
        // Multer pone la información del archivo en `req.file`
        const { originalname, mimetype, size, filename } = req.file;
        const storageKey = req.file.path;

        // 2. Validar que los datos necesarios estén presentes
        if (!ID_Equipo || !ID_Dueno) {
            return res.status(400).json({ message: "Se requiere ID_Equipo y ID_Dueño." });
        }

        // 3. Insertar la metadata del archivo en la base de datos
        const query = `
            INSERT INTO "Archivo" (
                "ID_Equipo", "ID_Dueño", "Nombre_Archivo", "Tamaño_Archivo", 
                "Tipo_Archivo", "ID_Carpeta", "StorageKey", "Ruta"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [
            ID_Equipo, 
            ID_Dueno, 
            originalname,
            size, 
            mimetype, 
            ID_Carpeta || null,
            storageKey,
            '/'
        ]);

        res.status(201).json({ message: "Archivo subido y registrado exitosamente.", archivo: rows[0] });

    } catch (error) {
        console.error("Error al subir el archivo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Traer por equipo
router.get("/equipo/:ID_Equipo", async (req, res) => {
    try {
        const { ID_Equipo } = req.params;
        // 1. OBTENEMOS EL ID DEL USUARIO QUE REALIZA LA CONSULTA
        // Lo pasaremos desde el frontend como un query parameter (ej: ?id_usuario_actual=1)
        const { id_usuario_actual } = req.query; 

        if (!id_usuario_actual) {
            return res.status(400).json({ message: "Se requiere el ID del usuario actual." });
        }

        const query = `
            SELECT 
                arc."ID_Archivo",
                arc."Nombre_Archivo",
                arc."Tamaño_Archivo",
                arc."Fecha_Subida",
                arc."StorageKey",
                dueño."Nombre_Usuario" AS "propietario",
                asign."Estado_Asignacion" AS "estado",
                -- 2. CORRECCIÓN CLAVE: Añadimos una subconsulta que devuelve TRUE o FALSE
                EXISTS (
                    SELECT 1 FROM "Favoritos" fav 
                    WHERE fav."ID_Archivo" = arc."ID_Archivo" AND fav."ID_Usuario" = $2
                ) AS "is_favorito"
            FROM "Archivo" arc
            LEFT JOIN "Usuarios" dueño ON arc."ID_Dueño" = dueño."ID_Usuario"
            LEFT JOIN "Adjuntos" adj ON arc."ID_Archivo" = adj."ID_Archivo"
            LEFT JOIN "Asignaciones" asign ON adj."ID_Asignacion" = asign."ID_Asignacion"
            WHERE arc."ID_Equipo" = $1
            ORDER BY arc."Fecha_Subida" DESC;
        `;
        // 3. Ahora la consulta necesita dos parámetros: el ID del equipo y el ID del usuario
        const { rows } = await pool.query(query, [ID_Equipo, id_usuario_actual]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener los archivos del equipo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Modificar nombre de archivo
router.patch("/:ID_Archivo/nombre", async (req, res) => {
    try {
        const { ID_Archivo } = req.params;
        const { Nombre_Archivo } = req.body;

        if (!Nombre_Archivo) {
            return res.status(400).json({ message: "Se requiere el nuevo 'Nombre_Archivo' en el cuerpo de la solicitud." });
        }

        const query = `
            UPDATE "Archivo"
            SET "Nombre_Archivo" = $1
            WHERE "ID_Archivo" = $2
            RETURNING "ID_Archivo", "Nombre_Archivo";
        `;

        const { rows, rowCount } = await pool.query(query, [Nombre_Archivo, ID_Archivo]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "No se encontró el archivo especificado." });
        }

        res.status(200).json({
            message: "Nombre del archivo actualizado correctamente.",
            archivo: rows[0]
        });

    } catch (error) {
        console.error("Error al actualizar el nombre del archivo:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Añadir a favoritos
router.post("/favoritos", async (req, res) => {
    try {
        const { ID_Usuario, ID_Archivo } = req.body;

        if (!ID_Usuario || !ID_Archivo) {
            return res.status(400).json({ message: "Se requiere 'ID_Usuario' y 'ID_Archivo'." });
        }

        const query = `
            INSERT INTO "Favoritos" ("ID_Usuario", "ID_Archivo")
            VALUES ($1, $2)
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [ID_Usuario, ID_Archivo]);

        res.status(201).json({
            message: "Archivo añadido a favoritos.",
            favorito: rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: "Este archivo ya está en tus favoritos." });
        }
        console.error("Error al añadir a favoritos:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Quitar de favoritos
router.delete("/favoritos", async (req, res) => {
    try {
        const { ID_Usuario, ID_Archivo } = req.body;

        if (!ID_Usuario || !ID_Archivo) {
            return res.status(400).json({ message: "Se requiere 'ID_Usuario' y 'ID_Archivo'." });
        }

        const query = `
            DELETE FROM "Favoritos"
            WHERE "ID_Usuario" = $1 AND "ID_Archivo" = $2;
        `;

        const { rowCount } = await pool.query(query, [ID_Usuario, ID_Archivo]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "No se encontró este archivo en los favoritos del usuario." });
        }

        res.status(200).json({ message: "Archivo quitado de favoritos correctamente." });

    } catch (error) {
        console.error("Error al quitar de favoritos:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

//Buscar archivos
router.get("/equipo/:ID_Equipo/buscar", async (req, res) => {
    try {
        // 1. Extraer el ID del equipo (obligatorio) y los filtros opcionales
        const { ID_Equipo } = req.params;
        const { q, tipo, propietario, fecha_inicio, fecha_fin, favoritos_de_usuario } = req.query;

        // 2. Construir la consulta SQL dinámicamente
        let baseQuery = `
            SELECT 
                arc."ID_Archivo",
                arc."Nombre_Archivo",
                arc."Tamaño_Archivo",
                arc."Fecha_Subida",
                dueño."Nombre_Usuario" AS "propietario"
            FROM "Archivo" arc
            LEFT JOIN "Usuarios" dueño ON arc."ID_Dueño" = dueño."ID_Usuario"
        `;
        
        const conditions = [];
        const values = [];
        let paramIndex = 1;

        // Filtro OBLIGATORIO por equipo
        conditions.push(`arc."ID_Equipo" = $${paramIndex++}`);
        values.push(ID_Equipo);
        
        // Si se filtra por favoritos, se añade el JOIN
        if (favoritos_de_usuario) {
            baseQuery += ` INNER JOIN "Favoritos" f ON arc."ID_Archivo" = f."ID_Archivo"`;
            conditions.push(`f."ID_Usuario" = $${paramIndex++}`);
            values.push(favoritos_de_usuario);
        }

        // Filtro opcional por término de búsqueda (case-insensitive)
        if (q) {
            conditions.push(`arc."Nombre_Archivo" ILIKE $${paramIndex++}`);
            values.push(`%${q}%`);
        }

        // Filtro opcional por tipo de archivo
        if (tipo) {
            conditions.push(`arc."Tipo_Archivo" = $${paramIndex++}`);
            values.push(tipo);
        }

        // Filtro opcional por propietario
        if (propietario) {
            conditions.push(`arc."ID_Dueño" = $${paramIndex++}`);
            values.push(propietario);
        }

        // Filtro opcional por rango de fechas
        if (fecha_inicio) {
            conditions.push(`arc."Fecha_Subida" >= $${paramIndex++}`);
            values.push(fecha_inicio);
        }
        if (fecha_fin) {
            conditions.push(`arc."Fecha_Subida" <= $${paramIndex++}`);
            values.push(fecha_fin);
        }

        // 3. Unir la consulta
        const finalQuery = `
            ${baseQuery}
            WHERE ${conditions.join(' AND ')}
            ORDER BY arc."Fecha_Subida" DESC;
        `;

        // 4. Ejecutar la consulta final
        const { rows } = await pool.query(finalQuery, values);
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error en la búsqueda de archivos:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

export default router;