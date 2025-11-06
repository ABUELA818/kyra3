"use client"

interface MenuFechasProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

export default function MenuFechas({ startDate, endDate, onStartDateChange, onEndDateChange }: MenuFechasProps) {
  return (
    <div className="menu menu-dates">
      <div className="date-field">
        <label>📅 Fecha de inicio</label>
        <input type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
      </div>
      <div className="date-field">
        <label>📅 Fecha de entrega</label>
        <input type="date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
      </div>
    </div>
  )
}
