import { Router } from "express"
import asignacionesRouter from "./Asignaciones.routes.js"
import notasRouter from "./Notas.routes.js"
import proyectosRouter from "./Proyectos.routes.js"
import notificacionesRouter from "./Notificaciones.routes.js"
import equiposRouter from "./Equipos.routes.js"
import archivosRouter from "./Archivos.routes.js"
import usuariosRouter from "./Usuarios.routes.js"
import carpetasRouter from "./Carpetas.routes.js"
import conversacionesRouter from "./Conversaciones.routes.js"
import mensajesRouter from "./Mensajes.routes.js"
import adminRouter from "./Admin.routes.js"
import rolesRouter from "./Roles.routes.js"

const router = Router()

// Define all your base paths here
router.use("/asignaciones", asignacionesRouter)
router.use("/notas", notasRouter)
router.use("/proyectos", proyectosRouter)
router.use("/notificaciones", notificacionesRouter)
router.use("/equipos", equiposRouter)
router.use("/archivos", archivosRouter)
router.use("/usuarios", usuariosRouter)
router.use("/carpetas", carpetasRouter)
router.use("/conversaciones", conversacionesRouter)
router.use("/mensajes", mensajesRouter)
router.use("/admin", adminRouter)
router.use("/roles", rolesRouter)

export default router
