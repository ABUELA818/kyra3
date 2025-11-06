"use client"
import { useState, useMemo } from "react"

// 1. Define los tipos de datos que el hook manejará
export type Prioridad = "Baja" | "Media" | "Alta" | ""

export interface TareaData {
  asignados: number[] // Array de IDs de usuario
  fechaInicio: string
  fechaEntrega: string
  prioridad: Prioridad
}

// 2. Define un estado inicial por defecto (completamente vacío)
const defaultData: TareaData = {
  asignados: [],
  fechaInicio: "",
  fechaEntrega: "",
  prioridad: "",
}

// 3. El hook ya no necesita 'initialData', siempre empieza vacío
export function useBatchEdit() {
  const [tempData, setTempData] = useState(defaultData)
  const [changedFields, setChangedFields] = useState(new Set<string>())

  // 4. 'changedFields' ahora es un estado reactivo
  const hasChanges = useMemo(() => changedFields.size > 0, [changedFields])

  // 5. Función para marcar un campo como "cambiado"
  const markAsChanged = (field: "asignados" | "fechas" | "prioridad") => {
    setChangedFields((prev) => new Set(prev).add(field))
  }

  // 6. Resetea un campo específico a su valor por defecto (vacío)
  const clearFieldChanges = (field: string) => {
    setTempData((prev) => {
      const newState = { ...prev }
      if (field === "asignados") newState.asignados = defaultData.asignados
      if (field === "fechas") {
        newState.fechaInicio = defaultData.fechaInicio
        newState.fechaEntrega = defaultData.fechaEntrega
      }
      if (field === "prioridad") newState.prioridad = defaultData.prioridad
      return newState
    })
    setChangedFields((prev) => {
      const newSet = new Set(prev)
      newSet.delete(field)
      return newSet
    })
  }

  // 7. Resetea todo el formulario al estado vacío
  const resetForm = () => {
    setTempData(defaultData)
    setChangedFields(new Set())
  }

  return {
    tempData,
    setTempData,
    changedFields,
    hasChanges,
    clearFieldChanges,
    resetForm,
    markAsChanged,
  }
}
