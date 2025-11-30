"use client"
import type React from "react"
import { useState } from "react"
import { useBatchEdit, type Prioridad } from "@/hooks/useBatchEdit"

import MenuAsignados from "@/components/molecules/Menu_Asignados"
import MenuFechas from "@/components/molecules/Menu_Fechas"
import MenuPrioridad from "@/components/molecules/Menu_Prioridad"
import MenuEliminar from "@/components/molecules/Menu_Eliminar"

interface UsuarioParaFormulario {
  id: number
  nombre: string
}

interface BarraModificacionesProps {
  tareasSeleccionadas: string[]
  usuarios: UsuarioParaFormulario[]
  onClose: () => void
  onUpdate: (taskIds: string[], updates: any) => void
  onDelete: (taskIds: string[]) => void
}

export default function Barra_Modificaciones({
  tareasSeleccionadas,
  usuarios,
  onClose,
  onUpdate,
  onDelete,
}: BarraModificacionesProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const { tempData, setTempData, changedFields, hasChanges, clearFieldChanges, resetForm, markAsChanged } =
    useBatchEdit()

  const toggleMenu = (menu: string) => setOpenMenu(openMenu === menu ? null : menu)
  const closeMenu = () => setOpenMenu(null)

  // 3. El 'handleSubmit' ahora llama a la prop 'onUpdate'
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updates: any = {}
    if (changedFields.has("asignados")) updates.asignados = tempData.asignados
    if (changedFields.has("fechas")) {
      if (tempData.fechaInicio) updates.fecha_inicio = tempData.fechaInicio
      if (tempData.fechaEntrega) updates.fecha_termino = tempData.fechaEntrega
    }
    if (changedFields.has("prioridad")) updates.prioridad = tempData.prioridad

    onUpdate(tareasSeleccionadas, updates)
    resetForm()
    onClose()
  }

  // 4. El botón "Sí" de eliminar llama a la prop 'onDelete'
  const handleDelete = () => {
    onDelete(tareasSeleccionadas)
    resetForm()
    onClose()
  }

  const usuariosNoSeleccionados = usuarios.filter((u) => !tempData.asignados.includes(u.id))

  const toggleUsuario = (id: number) => {
    markAsChanged("asignados")
    setTempData((prev) => ({
      ...prev,
      asignados: prev.asignados.includes(id) ? prev.asignados.filter((uId) => uId !== id) : [...prev.asignados, id],
    }))
  }

  const handleSelectPriority = (prio: Prioridad) => {
    markAsChanged("prioridad")
    setTempData((prev) => ({ ...prev, prioridad: prio }))
    closeMenu()
  }

  return (
    <form className="toolbar-container" onSubmit={handleSubmit}>
      <div className="toolbar">
        <div className="toolbar-left">
          <span className="selection-text">
            Selección: {tareasSeleccionadas.length} tarea{tareasSeleccionadas.length !== 1 ? "s" : ""}
          </span>
          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="toolbar-right">
          <div className="toolbar-btn-wrapper">
            <button type="button" className="toolbar-btn" onClick={() => toggleMenu("asignados")}>
              Asignados
              {changedFields.has("asignados") && (
                <span
                  className="change-indicator"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFieldChanges("asignados")
                  }}
                >
                  ×
                </span>
              )}
            </button>
          </div>
          <div className="toolbar-btn-wrapper">
            <button type="button" className="toolbar-btn" onClick={() => toggleMenu("fechas")}>
              Fechas
              {changedFields.has("fechas") && (
                <span
                  className="change-indicator"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFieldChanges("fechas")
                  }}
                >
                  ×
                </span>
              )}
            </button>
          </div>
          <div className="toolbar-btn-wrapper">
            <button type="button" className="toolbar-btn" onClick={() => toggleMenu("prioridad")}>
              Prioridad
              {changedFields.has("prioridad") && (
                <span
                  className="change-indicator"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFieldChanges("prioridad")
                  }}
                >
                  ×
                </span>
              )}
            </button>
          </div>
          <button type="button" className="toolbar-btn delete-btn" onClick={() => toggleMenu("delete")}>
            Eliminar
          </button>
          <button
            type="submit"
            className={`toolbar-btn accept-btn ${!hasChanges ? "disabled" : ""}`}
            disabled={!hasChanges}
          >
            Aceptar
          </button>
        </div>
      </div>

      {openMenu === "asignados" && (
        <MenuAsignados
          usuarios={usuariosNoSeleccionados}
          seleccionado={tempData.asignados.map(String).join(",")}
          onSelect={(usuarioId) => toggleUsuario(Number(usuarioId))}
        />
      )}

      {openMenu === "fechas" && (
        <MenuFechas
          startDate={tempData.fechaInicio}
          endDate={tempData.fechaEntrega}
          onStartDateChange={(date) => {
            setTempData((prev) => ({ ...prev, fechaInicio: date }))
            markAsChanged("fechas")
          }}
          onEndDateChange={(date) => {
            setTempData((prev) => ({ ...prev, fechaEntrega: date }))
            markAsChanged("fechas")
          }}
        />
      )}

      {openMenu === "prioridad" && (
        <MenuPrioridad prioridadActual={tempData.prioridad} onSelect={handleSelectPriority} />
      )}

      {openMenu === "delete" && <MenuEliminar onClose={closeMenu} onConfirm={handleDelete} />}
    </form>
  )
}
