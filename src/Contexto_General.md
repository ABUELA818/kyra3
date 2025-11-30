# CONTEXTO GENERAL - DOCUMENTACIÓN COMPLETA DEL PROYECTO

## Resumen Ejecutivo

Este es un sistema colaborativo empresarial completo diseñado para gestionar equipos, proyectos, tareas, archivos y comunicación en tiempo real. La aplicación permite a las organizaciones centralizar su trabajo y mejorar la colaboración entre equipos.

**Estado del Proyecto**: En desarrollo activo con funcionalidades principales implementadas
**Última actualización**: Noviembre 2025

---

# PARTE 1: FRONTEND

## 1.1 Tecnología y Stack

### Core Framework
- **Framework**: Next.js 16.0.0 con App Router
- **Lenguaje**: TypeScript + React 19.2.0
- **Styling**: Tailwind CSS v4 + Shadcn UI Components
- **Comunicación Real-Time**: Socket.io Client 4.8.1

### Librerías Principales
- **Formularios**: React Hook Form + Zod (validación)
- **UI Components**: Radix UI (base de Shadcn)
- **Iconos**: Lucide React
- **Notificaciones**: Sonner (toasts)
- **Fechas**: Date-fns + React Day Picker
- **Gráficos**: Recharts
- **Gestión de temas**: Next-themes
- **Archivos**: Multer (upload en cliente)

---

## 1.2 Arquitectura de Componentes Frontend

### Estructura de Carpetas
\`\`\`
src/
├── components/
│   ├── atoms/              # Componentes básicos (botones, inputs, etc.)
│   ├── molecules/          # Componentes compuestos (barras, menús, etc.)
│   ├── organisms/          # Componentes complejos (modales, formularios, etc.)
│   ├── templates/          # Páginas completas
│   └── ProtectedRoute.tsx  # HOC para rutas protegidas
├── services/               # Servicios API (fetch calls)
├── types/                  # Tipos TypeScript
└── hooks/                  # Custom hooks (no en carpeta compartida)
\`\`\`

### Patrón de Componentes (Atomic Design)

**Atoms** (Componentes más simples):
- `Boton.tsx` - Botón estándar
- `Input.tsx` - Input de texto
- `Texto.tsx` - Componentes de texto
- `Icono-Perfil.tsx` - Avatar de usuario
- `ThemeToggle.tsx` - Toggle tema claro/oscuro

**Molecules** (Combinaciones de atoms):
- `Barra_Busqueda.tsx` - Barra con input + filtros
- `Barra_Acciones.tsx` - Botones de acción agrupados
- `Miembros_Equipo.tsx` - Lista de miembros con avatares
- `Notas.tsx` - Widget de notas
- `Calendario.tsx` - Widget calendario
- `Equipo-Iconos.tsx` - Iconos de miembros del equipo

**Organisms** (Componentes complejos):
- `Crear_Equipo.tsx` - Modal para crear equipos
- `Crear_Proyecto.tsx` - Modal para crear proyectos
- `Chat-Mensajes.tsx` - Widget de chat
- `Chats_Recibidos.tsx` - Lista de conversaciones
- `Tablas.tsx` - Tabla de datos con acciones
- `SideBar.tsx` - Menú lateral de navegación
- `UserMenu.tsx` - Menú del usuario

**Templates** (Páginas completas):
- `Inicio.tsx` - Dashboard principal
- `Equipos.tsx` - Página de gestión de equipos
- `Proyectos.tsx` - Página de gestión de proyectos
- `Asignaciones.tsx` - Página de asignaciones
- `Chat.tsx` - Página de chats
- `Archivo.tsx` - Página de gestión de archivos

---

## 1.3 Servicios API (Frontend)

### Ubicación
`src/services/` - Contiene servicios para todas las entidades

### Servicios Principales

**Usuarios.service.ts**
\`\`\`typescript
- getAllUsuarios(): Promise<Usuario[]>  // Obtener todos los usuarios
\`\`\`

**Equipos.service.ts**
\`\`\`typescript
- crearEquipo(datos): Promise<Equipo>           // Crear nuevo equipo
- obtenerEquipos(): Promise<Equipo[]>           // Listar equipos
- obtenerEquipoDetalle(id): Promise<Equipo>    // Detalles de equipo
- actualizarEquipo(id, datos): Promise<Equipo> // Actualizar equipo
- eliminarEquipo(id): Promise<void>            // Eliminar equipo
\`\`\`

**Archivos.service.ts**
\`\`\`typescript
- subirArchivo(file, idEquipo, idProyecto): Promise<Archivo>
- obtenerArchivos(idEquipo, idProyecto): Promise<Archivo[]>
- searchArchivos(idEquipo, filtros): Promise<Archivo[]>  // Búsqueda con filtros
- marcarFavorito(idArchivo, idUsuario): Promise<void>
- desmarcarFavorito(idArchivo, idUsuario): Promise<void>
\`\`\`

**Chats.service.ts**
\`\`\`typescript
- obtenerConversaciones(idUsuario): Promise<Conversacion[]>
- obtenerMensajes(idConversacion): Promise<Mensaje[]>
- obtenerConversacionGrupo(idEquipo): Promise<Conversacion>
- crearMensaje(data): Promise<Mensaje>
\`\`\`

**Asignaciones.service.ts**
\`\`\`typescript
- crearAsignacion(datos): Promise<Asignacion>
- obtenerAsignaciones(filtros): Promise<Asignacion[]>
- actualizarAsignacion(id, datos): Promise<Asignacion>
\`\`\`

**Notificaciones.service.ts**
\`\`\`typescript
- obtenerNotificaciones(idUsuario): Promise<Notificacion[]>
- marcarComoLeido(idNotificacion): Promise<void>
\`\`\`

---

## 1.4 Tipos TypeScript

### Ubicación
`src/types/` - Contiene interfaces TypeScript

**Usuarios.ts**
\`\`\`typescript
interface Usuario {
  ID_Usuario: number
  Nombre_Usuario: string
  Correo: string
  Contraseña?: string
  ... otros campos
}
\`\`\`

**Equipos.ts**
\`\`\`typescript
interface Equipo {
  ID_Equipo: number
  Nombre_Equipo: string
  Descripcion?: string
  ID_CreadorEquipo: number
  Fecha_Creacion: Date
  is_favorito: boolean
}

interface SearchFilters {
  busqueda?: string
  tipo_archivo?: string
  rango_fecha?: [Date, Date]
  favoritos_de_usuario?: number  // ID del usuario
  ordenar_por?: 'fecha' | 'nombre' | 'tamano'
}
\`\`\`

**Chats.ts**
\`\`\`typescript
interface Conversacion {
  ID_Conversacion: number
  Nombre_Conversacion: string
  Es_Grupo: boolean
  ID_Equipo?: number
}

interface Mensaje {
  ID_Mensaje: number
  ID_Conversacion: number
  Enviado_A: number
  Mensaje: string
  Fecha_Envio: Date
}
\`\`\`

---

## 1.5 Flujos Principales del Frontend

### Flujo de Creación de Equipo
\`\`\`
Usuario abre modal "Crear Equipo"
  ↓
Componente carga lista de usuarios disponibles
  ↓
Usuario busca y selecciona miembros
  ↓
Usuario ingresa nombre y descripción
  ↓
Envía POST a /api/equipos
  ↓
Backend crea equipo + chat de grupo
  ↓
Frontend redirecciona a pantalla de Equipos
  ↓
Se renderiza equipo nuevo con chat integrado
\`\`\`

### Flujo de Búsqueda y Filtro de Archivos
\`\`\`
Usuario abre modal de Filtros
  ↓
Selecciona: búsqueda, tipo, fecha, favoritos
  ↓
Envía parámetros a searchArchivos()
  ↓
Backend filtra en BD y retorna resultados
  ↓
Tabla de archivos se actualiza
  ↓
Si usuario presiona Refresh → se limpian filtros y recarga todo
\`\`\`

### Flujo de Chat en Tiempo Real
\`\`\`
Usuario abre conversación
  ↓
Socket.io se conecta: socket.emit('user:join', userId)
  ↓
Se cargan mensajes previos vía HTTP GET
  ↓
Usuario escribe mensaje
  ↓
Socket.io envía: socket.emit('message:send', data)
  ↓
Backend emite evento a receptor en tiempo real
  ↓
Receptor recibe mensaje sin recargar página
\`\`\`

---

## 1.6 Configuración Importante

### Variables de Entorno (Frontend)
\`\`\`
NEXT_PUBLIC_API_URL = http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL = http://localhost:4000
\`\`\`

### Componentes Personalizados Clave
- **NotificationsWrapper.tsx** - Provider de notificaciones global
- **ProtectedRoute.tsx** - HOC que valida autenticación

---

# PARTE 2: BACKEND

## 2.1 Tecnología y Stack

### Core
- **Runtime**: Node.js con Express 5.1.0
- **Lenguaje**: JavaScript (ES6+)
- **Base de Datos**: PostgreSQL 8.16.3
- **ORM**: Sequelize 6.37.7
- **Comunicación Real-Time**: Socket.io 4.8.1
- **Upload de Archivos**: Multer 2.0.2

### Configuración
- **Puerto**: 4000 (configurable vía .env)
- **CORS**: Habilitado para frontend en localhost:3000
- **Carga de Archivos**: Carpeta `/backend/uploads`

---

## 2.2 Estructura de Carpetas Backend

\`\`\`
backend/
├── src/
│   ├── app.js                    # Configuración Express
│   ├── server.js                 # Servidor HTTP + Socket.io
│   ├── config/
│   │   └── db.js                 # Configuración PostgreSQL
│   ├── models/                   # Modelos Sequelize
│   │   ├── Usuarios.js
│   │   ├── Equipos.js
│   │   ├── Proyectos.js
│   │   ├── Archivos.js
│   │   ├── Conversaciones.js
│   │   ├── Mensajes.js
│   │   ├── Asignaciones.js
│   │   ├── MiembrosEquipos.js
│   │   └── ... más modelos
│   ├── routes/                   # Rutas API
│   │   ├── Usuarios.routes.js
│   │   ├── Equipos.routes.js
│   │   ├── Archivos.routes.js
│   │   ├── Conversaciones.routes.js
│   │   ├── Mensajes.routes.js
│   │   └── index.js              # Registro de rutas
│   └── db/
│       └── dbconnection.js        # Inicialización BD
└── package.json
\`\`\`

---

## 2.3 Base de Datos - Modelos

### Tabla: Usuarios
\`\`\`sql
CREATE TABLE "Usuarios" (
  "ID_Usuario" SERIAL PRIMARY KEY,
  "Nombre_Usuario" VARCHAR(255) NOT NULL,
  "Correo" VARCHAR(255) UNIQUE NOT NULL,
  "Contraseña" VARCHAR(255) NOT NULL,
  "Foto_Perfil" TEXT,
  "Rol" VARCHAR(50) DEFAULT 'user',
  "Fecha_Creacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Relaciones**:
- 1 Usuario → N Equipos (crea equipos)
- 1 Usuario → N Conversaciones (participa en chats)
- 1 Usuario → N Mensajes (envía mensajes)
- 1 Usuario → N Asignaciones (recibe tareas)

### Tabla: Equipos
\`\`\`sql
CREATE TABLE "Equipos" (
  "ID_Equipo" SERIAL PRIMARY KEY,
  "Nombre_Equipo" VARCHAR(255) NOT NULL,
  "Descripcion" TEXT,
  "ID_CreadorEquipo" INTEGER REFERENCES "Usuarios"("ID_Usuario"),
  "Fecha_Creacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "is_favorito" BOOLEAN DEFAULT FALSE
);
\`\`\`

### Tabla: MiembrosEquipos
\`\`\`sql
CREATE TABLE "MiembrosEquipos" (
  "ID_Equipo" INTEGER REFERENCES "Equipos"("ID_Equipo"),
  "ID_Usuario" INTEGER REFERENCES "Usuarios"("ID_Usuario"),
  PRIMARY KEY ("ID_Equipo", "ID_Usuario")
);
\`\`\`

### Tabla: Conversaciones
\`\`\`sql
CREATE TABLE "Conversaciones" (
  "ID_Conversacion" SERIAL PRIMARY KEY,
  "Nombre_Conversacion" VARCHAR(150),
  "Es_Grupo" BOOLEAN DEFAULT FALSE,
  "ID_Equipo" INTEGER REFERENCES "Equipos"("ID_Equipo")
);
\`\`\`

**Nota**: Chats 1-a-1 tienen `Es_Grupo = false` e `ID_Equipo = NULL`  
Chats de grupo tienen `Es_Grupo = true` e `ID_Equipo` asignado

### Tabla: Mensajes
\`\`\`sql
CREATE TABLE "Mensajes" (
  "ID_Mensaje" SERIAL PRIMARY KEY,
  "ID_Conversacion" INTEGER REFERENCES "Conversaciones"("ID_Conversacion"),
  "Enviado_A" INTEGER REFERENCES "Usuarios"("ID_Usuario"),
  "Mensaje" TEXT NOT NULL,
  "Fecha_Envio" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabla: Usuario_Conversacion
\`\`\`sql
CREATE TABLE "Usuario_Conversacion" (
  "ID_Conversation" INTEGER REFERENCES "Conversaciones"("ID_Conversacion"),
  "ID_Usuario" INTEGER REFERENCES "Usuarios"("ID_Usuario"),
  "LastReadAt" TIMESTAMP,
  PRIMARY KEY ("ID_Conversation", "ID_Usuario")
);
\`\`\`

**Propósito**: Rastrear qué usuarios están en cada conversación

### Tabla: Archivos
\`\`\`sql
CREATE TABLE "Archivos" (
  "ID_Archivo" SERIAL PRIMARY KEY,
  "Nombre_Archivo" VARCHAR(255),
  "Ruta" TEXT,
  "Tipo_Archivo" VARCHAR(50),
  "Tamano" INTEGER,
  "ID_Equipo" INTEGER REFERENCES "Equipos"("ID_Equipo"),
  "ID_Usuario_Subidor" INTEGER REFERENCES "Usuarios"("ID_Usuario"),
  "Fecha_Subida" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabla: Favoritos
\`\`\`sql
CREATE TABLE "Favoritos" (
  "ID_Usuario" INTEGER REFERENCES "Usuarios"("ID_Usuario"),
  "ID_Archivo" INTEGER REFERENCES "Archivos"("ID_Archivo"),
  "Fecha_Agregado" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("ID_Usuario", "ID_Archivo")
);
\`\`\`

### Tabla: Asignaciones
\`\`\`sql
CREATE TABLE "Asignaciones" (
  "ID_Asignacion" SERIAL PRIMARY KEY,
  "Titulo" VARCHAR(255),
  "Descripcion" TEXT,
  "ID_Proyecto" INTEGER REFERENCES "Proyectos"("ID_Proyecto"),
  "ID_Usuario_Asignado" INTEGER REFERENCES "Usuarios"("ID_Usuario"),
  "Prioridad" VARCHAR(50),
  "Estado" VARCHAR(50) DEFAULT 'pendiente',
  "Fecha_Vencimiento" DATE,
  "Fecha_Creacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## 2.4 API Endpoints

### Autenticación (Usuarios)
\`\`\`
POST   /api/usuarios/login        - Login
POST   /api/usuarios/registro     - Registrar usuario
GET    /api/usuarios              - Obtener todos los usuarios
GET    /api/usuarios/:id          - Obtener usuario por ID
PUT    /api/usuarios/:id          - Actualizar usuario
DELETE /api/usuarios/:id          - Eliminar usuario
\`\`\`

### Equipos
\`\`\`
POST   /api/equipos               - Crear equipo (+ crea chat de grupo)
GET    /api/equipos               - Listar equipos del usuario
GET    /api/equipos/:id           - Detalles del equipo
PUT    /api/equipos/:id           - Actualizar equipo
DELETE /api/equipos/:id           - Eliminar equipo
POST   /api/equipos/:id/miembros  - Agregar miembro al equipo
GET    /api/equipos/:id/miembros  - Listar miembros del equipo
\`\`\`

### Archivos
\`\`\`
POST   /api/archivos/subir        - Subir archivo (Multer)
GET    /api/archivos/equipo/:id   - Obtener archivos de equipo
POST   /api/archivos/buscar       - Buscar/filtrar archivos
POST   /api/archivos/:id/favorito - Marcar como favorito
DELETE /api/archivos/:id/favorito - Desmarcar como favorito
DELETE /api/archivos/:id          - Eliminar archivo
\`\`\`

**Filtros disponibles en búsqueda**:
- `busqueda`: búsqueda por nombre
- `tipo_archivo`: filtrar por extensión (.pdf, .img, etc.)
- `rango_fecha`: filtrar por rango de fechas
- `favoritos_de_usuario`: filtrar solo favoritos del usuario
- `ordenar_por`: ordenar por 'fecha', 'nombre', 'tamano'

### Conversaciones / Chats
\`\`\`
GET    /api/conversaciones/usuario/:id      - Listar conversaciones del usuario
GET    /api/conversaciones/grupo/equipo/:id - Obtener chat de grupo de equipo
POST   /api/conversaciones                  - Crear conversación
POST   /api/conversaciones/:id/miembros     - Agregar miembro a grupo
\`\`\`

### Mensajes
\`\`\`
GET    /api/mensajes/:conversacionId       - Obtener mensajes de conversación
POST   /api/mensajes                       - Enviar mensaje
GET    /api/mensajes/:conversacionId/noLeidos - Contar no leídos
\`\`\`

### Asignaciones
\`\`\`
POST   /api/asignaciones          - Crear asignación
GET    /api/asignaciones          - Listar asignaciones
GET    /api/asignaciones/:id      - Detalles de asignación
PUT    /api/asignaciones/:id      - Actualizar asignación
DELETE /api/asignaciones/:id      - Eliminar asignación
\`\`\`

---

## 2.5 Socket.io Events

### Emisión del Cliente al Servidor
\`\`\`javascript
socket.emit('user:join', userId)           // Conectar usuario
socket.emit('message:send', messageData)   // Enviar mensaje
socket.emit('typing:start', {fromUserId, toUserId})
socket.emit('typing:stop', {fromUserId, toUserId})
\`\`\`

### Escucha del Cliente
\`\`\`javascript
socket.on('message:receive', messageData)  // Recibir mensaje
socket.on('typing:indicator', {userId, isTyping})
socket.on('message:sent', confirmData)
\`\`\`

### Conexión WebSocket
\`\`\`
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// activeUsers Map: { userId → socketId }
\`\`\`

---

## 2.6 Flujos Principales del Backend

### Flujo: Crear Equipo + Chat de Grupo
\`\`\`
POST /api/equipos
  ↓
Validar datos (nombre, descripción, miembros)
  ↓
Crear registro en tabla Equipos
  ↓
Insertar miembros en MiembrosEquipos
  ↓
NUEVO: Crear conversación de grupo
  ├─ Crear registro en Conversaciones
  │  (Nombre_Conversacion = nombre del equipo)
  │  (Es_Grupo = true)
  │  (ID_Equipo = ID del equipo creado)
  │
  └─ Insertar todos los miembros en Usuario_Conversacion
  ↓
Retornar equipo con chat_id
\`\`\`

### Flujo: Enviar Mensaje en Chat
\`\`\`
POST /api/mensajes
  ↓
Validar: conversacionId, emisorId, contenido
  ↓
Guardar en BD (tabla Mensajes)
  ↓
Emitir evento Socket.io a receptores
  ↓
Si es grupo: enviar a todos los miembros de Usuario_Conversacion
Si es 1-a-1: enviar solo al otro usuario
\`\`\`

### Flujo: Buscar/Filtrar Archivos
\`\`\`
POST /api/archivos/buscar
  Recibe: { idEquipo, filtros: { busqueda, tipo, rango_fecha, favoritos_de_usuario } }
  ↓
Construir query SQL dinámico:
  - WHERE Nombre_Archivo LIKE '%busqueda%'
  - WHERE Tipo_Archivo = 'tipo'
  - WHERE Fecha_Subida BETWEEN fecha1 AND fecha2
  - WHERE ID_Archivo IN (SELECT ID_Archivo FROM Favoritos WHERE ID_Usuario = favoritos_de_usuario)
  ↓
Ejecutar query y retornar resultados
  ↓
Frontend renderiza tabla con archivos filtrados
\`\`\`

---

## 2.7 Configuración y Conexión

### app.js
\`\`\`javascript
import express from "express"
import cors from "cors"
import routes from "./routes/index.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api", routes)
app.use('/uploads', express.static('uploads'))

export default app
\`\`\`

### server.js
\`\`\`javascript
const server = http.createServer(app)
const io = new Server(server, { cors: {...} })

// Gestión de usuarios activos y eventos Socket.io
\`\`\`

### config/db.js
\`\`\`javascript
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432
})
\`\`\`

---

## 2.8 Variables de Entorno (Backend)
\`\`\`
PORT=4000
DB_HOST=localhost
DB_USER=manito
DB_PASSWORD=niaaa
DB_NAME=kyra3
DB_PORT=5432
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

---

# PARTE 3: INTEGRACIÓN FRONTEND-BACKEND

## 3.1 Flujo de Datos Completo: Crear Equipo

\`\`\`
FRONTEND (usuario abre modal)
  ↓
Carga usuarios: GET /api/usuarios
Backend retorna: [{ID_Usuario, Nombre_Usuario, Correo}, ...]
Frontend transforma: [{id, nombre, correo}, ...]
  ↓
Usuario selecciona miembros y crea equipo
  ↓
POST /api/equipos {
  nombre_equipo: "Ventas",
  descripcion: "Equipo de ventas",
  miembros_ids: [2, 3, 4]
}
  ↓
BACKEND:
  ✓ Crear Equipo (ID = 15)
  ✓ Insertar en MiembrosEquipos (15, [2,3,4])
  ✓ NUEVO: Crear Conversacion (Nombre="Ventas", Es_Grupo=true, ID_Equipo=15)
  ✓ Insertar en Usuario_Conversacion (conversacion_id, [2,3,4])
  ✓ Retornar: {ID_Equipo: 15, chat_id: 45, ...}
  ↓
FRONTEND:
  ✓ Recibe equipo con chat_id
  ✓ Redirige a pantalla Equipos
  ✓ Se renderiza equipo nuevo
  ✓ Component Equipos carga chat del equipo: GET /api/conversaciones/grupo/equipo/15
  ✓ Chat listo para usar en tiempo real
\`\`\`

## 3.2 Flujo de Datos Completo: Búsqueda de Archivos con Favoritos

\`\`\`
FRONTEND (usuario abre filtros)
  ↓
Usuario selecciona:
  - Búsqueda: "reporte"
  - Tipo: ".pdf"
  - Rango fecha: [01-11-2025, 15-11-2025]
  - Favoritos: ✓ (solo mis favoritos)
  ↓
POST /api/archivos/buscar {
  idEquipo: 5,
  filtros: {
    busqueda: "reporte",
    tipo_archivo: "pdf",
    rango_fecha: ["2025-11-01", "2025-11-15"],
    favoritos_de_usuario: 3,  // ID del usuario actual
    ordenar_por: "fecha"
  }
}
  ↓
BACKEND:
  ✓ Validar que usuario pertenece al equipo
  ✓ Construir query:
    SELECT a.* FROM Archivos a
    LEFT JOIN Favoritos f ON a.ID_Archivo = f.ID_Archivo
    WHERE a.ID_Equipo = 5
      AND a.Nombre_Archivo ILIKE '%reporte%'
      AND a.Tipo_Archivo = 'pdf'
      AND a.Fecha_Subida BETWEEN '2025-11-01' AND '2025-11-15'
      AND f.ID_Usuario = 3
    ORDER BY a.Fecha_Subida DESC
  ✓ Retornar resultados
  ↓
FRONTEND:
  ✓ Recibe archivos filtrados
  ✓ Tabla se actualiza solo mostrando "reporte.pdf" (favorito)
  ✓ Si usuario presiona botón Refresh
    - Limpiar todos los filtros
    - Recargar GET /api/archivos/equipo/5
    - Mostrar todos los archivos del equipo
\`\`\`

---

# PARTE 4: CARACTERÍSTICAS PRINCIPALES

## 4.1 Gestión de Equipos
- Crear equipos con múltiples miembros
- Chat de grupo automático para cada equipo
- Gestionar miembros (agregar/remover)
- Marcar equipos como favoritos
- Historial de cambios en equipos

## 4.2 Gestión de Proyectos
- Crear proyectos dentro de equipos
- Asignar miembros a proyectos
- Seguimiento de estado de proyecto
- Archivo de documentos por proyecto

## 4.3 Gestión de Tareas (Asignaciones)
- Crear asignaciones para usuarios
- Establecer prioridades (alta, media, baja)
- Fechas de vencimiento
- Estados: pendiente, en progreso, completado
- Historial de cambios en asignaciones
- Recibir asignaciones

## 4.4 Gestión de Archivos
- Subir archivos a equipos/proyectos
- Organizar en carpetas
- Buscar con filtros avanzados
- Marcar archivos como favoritos
- Compartir archivos entre miembros
- Ver historial de acceso

## 4.5 Chat en Tiempo Real
- Chats 1-a-1 entre usuarios
- Chats de grupo por equipo (automáticos)
- Mensajes persistentes en BD
- Indicador de escritura
- Notificaciones de mensajes nuevos
- Socket.io para actualizaciones en vivo

## 4.6 Notificaciones
- Notificaciones de asignaciones nuevas
- Notificaciones de mensajes
- Notificaciones de cambios en equipos
- Centro de notificaciones
- Marcar como leído

## 4.7 Sistema de Permisos (Básico)
- Usuarios pueden ver solo sus equipos
- Solo creador del equipo puede eliminarlo
- Solo asignado puede ver su asignación
- Todos los miembros del equipo ven el chat de grupo

---

# PARTE 5: ESTADO ACTUAL DEL DESARROLLO

## 5.1 Funcionalidades Completadas
- ✅ Autenticación básica
- ✅ CRUD de usuarios
- ✅ CRUD de equipos
- ✅ Creación automática de chat al crear equipo
- ✅ Chats 1-a-1 y de grupo
- ✅ Envío de mensajes con Socket.io
- ✅ Subida de archivos con Multer
- ✅ Búsqueda y filtrado de archivos
- ✅ Marcado de favoritos
- ✅ Botón de refresh que recarga la tabla
- ✅ CRUD básico de asignaciones
- ✅ Sistema de notificaciones

## 5.2 Funcionalidades Parciales
- ⚠️ Gestión de permisos (nivel básico)
- ⚠️ Roles de usuario (estructura presente pero no completamente implementada)

## 5.3 Mejoras Futuras
- [ ] Sistema de permisos más granular (admin, editor, viewer)
- [ ] Compartición granular de archivos
- [ ] Integración con calendario externo
- [ ] Webhooks para automatizaciones
- [ ] Historial de auditoría completo
- [ ] Integración SSO (Google, Microsoft)
- [ ] Exportación de reportes
- [ ] Versionado de archivos

---

# PARTE 6: PUNTOS CLAVE DE ARQUITECTURA

## 6.1 Decisiones de Diseño

### Por qué Socket.io
- Comunicación bidireccional en tiempo real
- Fallback automático si WebSocket no funciona
- Manejo automático de reconexión
- Compatible con múltiples servidores

### Por qué Sequelize
- ORM moderno con migraciones
- Relaciones predefinidas entre modelos
- Validación a nivel ORM
- Fácil de mantener y testear

### Por qué Next.js
- SSR/SSG para mejor SEO
- API routes integradas (aunque aquí backend separado)
- Built-in optimización de imágenes
- Excelente DX (Developer Experience)

### Por qué Tailwind CSS
- Utility-first, fácil customización
- Sistema de diseño consistente
- Themes personalizables
- Bundle size pequeño

## 6.2 Flujos Críticos
1. **Chat en tiempo real**: Socket.io → garantiza entrega en vivo
2. **Búsqueda de archivos**: Filtros en backend → maneja grandes volúmenes
3. **Creación de equipo**: Transaccional → BD + chat creados juntos

## 6.3 Consideraciones de Rendimiento
- Paginación de mensajes (no cargar todos de una vez)
- Índices en tablas de chats para búsquedas rápidas
- Caché de usuarios en Frontend (no recargar cada vez)
- Compresión de archivos en upload
- CDN para archivos grandes

---

# PARTE 7: GUÍA DE REFERENCIA RÁPIDA

## Agregar una nueva funcionalidad (Checklist)

1. **Backend**:
   - [ ] Crear modelo en `backend/src/models/`
   - [ ] Crear rutas en `backend/src/routes/`
   - [ ] Registrar rutas en `backend/src/routes/index.js`

2. **Frontend**:
   - [ ] Crear tipo en `src/types/`
   - [ ] Crear servicio en `src/services/`
   - [ ] Crear componentes en `src/components/`
   - [ ] Integrar en templates

3. **Pruebas**:
   - [ ] Probar en Postman (backend)
   - [ ] Probar en navegador (frontend)
   - [ ] Verificar Socket.io si es necesario

## URLs Importantes
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- API Base: `http://localhost:4000/api`

## Comandos Útiles
\`\`\`bash
# Frontend
npm run dev       # Iniciar Next.js

# Backend
npm run dev       # Iniciar con nodemon
\`\`\`

---

# CONCLUSIÓN

Este es un sistema empresarial completo de colaboración que permite a los equipos gestionar su trabajo, comunicarse en tiempo real y compartir archivos de forma centralizada. La arquitectura está diseñada para ser escalable y mantenible, usando tecnologías modernas y probadas en la industria.

El proyecto está en un estado muy avanzado con todas las funcionalidades principales implementadas y funcionando correctamente.
