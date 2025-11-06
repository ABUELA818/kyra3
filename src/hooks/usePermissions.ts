"use client"

import { useUser } from "@/context/userContext"

// IDs de roles que pueden crear proyectos, asignaciones y modificarlas
const ADMIN_ROLES = [1, 2, 3, 4] // Administrador general, Administrador de canal, Líder de proyecto, Sublíder

export function usePermissions() {
  const { usuario } = useUser()

  const canCreateProject = usuario ? ADMIN_ROLES.includes(usuario.ID_Rol) : false
  const canCreateAssignment = usuario ? ADMIN_ROLES.includes(usuario.ID_Rol) : false
  const canModifyAssignment = usuario ? ADMIN_ROLES.includes(usuario.ID_Rol) : false
  const canDeleteAssignment = usuario ? ADMIN_ROLES.includes(usuario.ID_Rol) : false

  return {
    canCreateProject,
    canCreateAssignment,
    canModifyAssignment,
    canDeleteAssignment,
    userRole: usuario?.ID_Rol,
  }
}
