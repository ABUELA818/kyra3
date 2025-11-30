# DIAGNÓSTICO DEL SISTEMA DE CHATS

## Descripción General del Proyecto
Este es un sistema de chat en tiempo real que permite a los usuarios comunicarse entre sí. La arquitectura incluye:
- **Frontend**: React (Next.js) con TypeScript
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL
- **Comunicación Real-Time**: Socket.io
- **API**: RESTful endpoints

---

## Estructura de Tablas de Base de Datos

### Tabla: `Conversaciones`
\`\`\`
- ID_Conversacion (PK, integer)
- Nombre_Conversacion (varchar 150)
- Es_Grupo (boolean)
- ID_Equipo (integer, FK)
\`\`\`

### Tabla: `Usuario_Conversacion`
\`\`\`
- ID_Conversation (PK, integer)
- ID_Usuario (PK, integer)
- LastReadAt (timestamp with time zone)
\`\`\`

### Tabla: `Mensajes`
\`\`\`
- ID_Mensaje (PK, integer, auto-increment)
- ID_Conversacion (FK, integer) → Conversaciones.ID_Conversacion
- Enviado_A (integer) → ID del receptor
- Mensaje (text)
- Fecha_Envio (timestamp, DEFAULT: CURRENT_TIMESTAMP)
\`\`\`

### Tabla: `Usuarios`
\`\`\`
- ID_Usuario (PK, integer)
- Nombre_Usuario (varchar)
- Correo (varchar)
- ... otros campos
\`\`\`

---

## ESTADO ACTUAL DEL SISTEMA

### ✅ RESUELTO: Sistema de Chats
- **Cargar mensajes**: Funciona correctamente para conversaciones 1-a-1 y grupos
- **Enviar mensajes**: Funciona correctamente para conversaciones 1-a-1 y grupos
- **Cambio de conversación**: Los mensajes se limpian y cargan correctamente
- **Validación**: Backend valida correctamente conversacionId, emisorId, receptorId y contenido

---

## PROBLEMA ACTUAL: Dropdown de Usuarios en Crear Equipo

### Ubicación
**Componente**: `src/components/organisms/Crear_Equipo.tsx`  
**Función afectada**: Búsqueda y selección de miembros del equipo

### Síntoma
\`\`\`
✅ El dropdown se muestra correctamente al escribir
❌ Aunque se escriban nombres de usuarios que existen en la BD, 
   aparece el mensaje "Usuario no encontrado"
\`\`\`

### Análisis del Problema

**Código Actual (líneas 43-57)**:
\`\`\`typescript
const usuariosFiltrados = usuarios.filter(
  (usuario) =>
    usuario.nombre &&
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    usuario.id !== usuario?.id && // ← Excluir al creador
    !miembros.some((m) => m.id === usuario.id) // ← Excluir ya seleccionados
)
\`\`\`

**Estructura de datos recibida del backend**:
\`\`\`json
{
  "ID_Usuario": 123,
  "Nombre_Usuario": "Juan Pérez",
  "Correo": "juan@example.com"
}
\`\`\`

### Causas Identificadas

| Problema | Severidad | Descripción |
|----------|-----------|-------------|
| **Mapeo incorrecto de campos** | 🔴 CRÍTICO | El componente busca `usuario.nombre` pero la BD devuelve `Nombre_Usuario` |
| **Campo ID incorrecto** | 🔴 CRÍTICO | El componente busca `usuario.id` pero la BD devuelve `ID_Usuario` |
| **Comparación incorrecta del creador** | 🔴 CRÍTICO | Compara `usuario.id !== usuario?.id` (siempre false) en lugar de `usuario.id !== usuario.id` |

### Evidencia

**Lo que el servicio devuelve**:
\`\`\`typescript
// src/services/Usuarios.service.ts
export const getAllUsuarios = async (): Promise<Usuario[]> => {
  const response = await fetch(`${API_URL}/usuarios`)
  return await response.json()
  // Devuelve: [{ ID_Usuario: 1, Nombre_Usuario: "Juan", ... }]
}
\`\`\`

**Lo que el componente espera**:
\`\`\`typescript
// Busca usuario.nombre (NO EXISTE)
// Busca usuario.id (NO EXISTE)
// Debería buscar usuario.ID_Usuario y usuario.Nombre_Usuario
\`\`\`

### Flujo Actual (Con Errores)

\`\`\`
1. Usuario escribe "Juan" en input de búsqueda
   ↓
2. useState actualiza busqueda = "Juan"
   ↓
3. Se ejecuta filtro:
   - usuario.nombre.toLowerCase() → ❌ undefined.toLowerCase() = ERROR
   - O si existe transformación previa, no coincide con estructura real
   ↓
4. usuariosFiltrados.length === 0
   ↓
5. Se muestra "Usuario no encontrado"
\`\`\`

### Solución Requerida

**Opción 1: Transformar datos al cargar usuarios**
\`\`\`typescript
useEffect(() => {
  const fetchUsuarios = async () => {
    const data = await getAllUsuarios()
    const transformados = data.map(u => ({
      id: u.ID_Usuario,
      nombre: u.Nombre_Usuario,
      correo: u.Correo
    }))
    setUsuarios(transformados)
  }
}, [])
\`\`\`

**Opción 2: Ajustar el filtro a la estructura real**
\`\`\`typescript
const usuariosFiltrados = usuarios.filter(
  (usuario) =>
    usuario.Nombre_Usuario && // ← Usar campo correcto
    usuario.Nombre_Usuario.toLowerCase().includes(busqueda.toLowerCase()) &&
    usuario.ID_Usuario !== usuario.id && // ← Usar campo correcto
    !miembros.some((m) => m.id === usuario.ID_Usuario) // ← Usar campo correcto
)
\`\`\`

### Verificaciones Necesarias

- [ ] Verificar estructura exacta del objeto Usuario en tipos (src/types)
- [ ] Confirmar qué campos devuelve el endpoint /usuarios
- [ ] Revisar si hay transformación de datos en otros componentes similares
- [ ] Verificar consistencia de nombres de campos en toda la aplicación

---

## RECOMENDACIONES

### ✅ CORTO PLAZO (Arreglar dropdown)
1. **Agregar console.log** para ver estructura exacta de `usuarios` array
2. **Mapear campos correctamente**: Ajustar filtro para usar `Nombre_Usuario` e `ID_Usuario`
3. **Corregir comparación del creador**: Usar el ID del usuario en sesión correctamente

### ⚠️ MEDIANO PLAZO (Consistencia)
1. **Estandarizar nombres de campos**: Decidir si usar camelCase o snake_case
2. **Crear capa de transformación**: Servicio que normalice datos del backend
3. **Actualizar tipos TypeScript**: Que reflejen la estructura real de la BD

### 🔧 DEBUGGING INMEDIATO

**En el componente Crear_Equipo.tsx:**
\`\`\`typescript
useEffect(() => {
  const fetchUsuarios = async () => {
    const data = await getAllUsuarios()
    console.log("[v0] Estructura de usuarios:", data[0]) // Ver primer usuario
    console.log("[v0] Campos disponibles:", Object.keys(data[0])) // Ver nombres de campos
    setUsuarios(data)
  }
}, [])
\`\`\`

**Verificar en Console del navegador:**
1. Abrir modal de Crear Equipo
2. Buscar logs `[v0] Estructura de usuarios:`
3. Confirmar nombres exactos de los campos
4. Ajustar código según estructura real

---

## Estado Actual del Sistema
- ✅ Sistema de Chats: COMPLETAMENTE FUNCIONAL
- ❌ Crear Equipo - Búsqueda de usuarios: NO FUNCIONA (mapeo incorrecto de campos)
- ✅ Autenticación: Usuario en sesión disponible vía useUser()
- ✅ Dropdown UI: Se renderiza correctamente

**Bloqueante**: El mapeo incorrecto de campos impide encontrar usuarios aunque existan en la BD
