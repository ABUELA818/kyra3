"use client"

import type React from "react"
import { useState } from "react"

interface CalendarioProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

export function Calendario({ startDate, endDate, onStartDateChange, onEndDateChange }: CalendarioProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)) // Agosto 2025

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const formatDate = (day: number, month: number, year: number): string => {
    return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`
  }

  const parseDate = (dateStr: string): { day: number; month: number; year: number } | null => {
    const parts = dateStr.split("/")
    if (parts.length !== 3) return null
    return {
      day: Number.parseInt(parts[0], 10),
      month: Number.parseInt(parts[1], 10) - 1,
      year: Number.parseInt(parts[2], 10),
    }
  }

  const isDateInCurrentMonth = (day: number): boolean => {
    const parsed = parseDate(startDate)
    if (!parsed) return false
    return parsed.day === day && parsed.month === currentMonth.getMonth() && parsed.year === currentMonth.getFullYear()
  }

  const isDateEndInCurrentMonth = (day: number): boolean => {
    const parsed = parseDate(endDate)
    if (!parsed) return false
    return parsed.day === day && parsed.month === currentMonth.getMonth() && parsed.year === currentMonth.getFullYear()
  }

  const handleCalendarDayClick = (day: number) => {
    const newDate = formatDate(day, currentMonth.getMonth(), currentMonth.getFullYear())

    if (!startDate) {
      onStartDateChange(newDate)
    } else if (!endDate) {
      const startParsed = parseDate(startDate)
      const newParsed = { day, month: currentMonth.getMonth(), year: currentMonth.getFullYear() }

      const startDateObj = new Date(startParsed!.year, startParsed!.month, startParsed!.day)
      const newDateObj = new Date(newParsed.year, newParsed.month, newParsed.day)

      if (newDateObj >= startDateObj) {
        onEndDateChange(newDate)
      } else {
        onStartDateChange(newDate)
        onEndDateChange("")
      }
    } else {
      onStartDateChange(newDate)
      onEndDateChange("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isStart: boolean) => {
    const value = e.target.value
    if (isStart) {
      onStartDateChange(value)
    } else {
      onEndDateChange(value)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const previousMonthDays = getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))

  const calendarDays: (number | { day: number; isCurrentMonth: boolean })[] = []

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: previousMonthDays - i, isCurrentMonth: false })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true })
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false })
  }

  return (
    <div className="date-calendar">
      <div className="date-field">
        <label>📅 Fecha de inicio</label>
        <input type="text" value={startDate} onChange={(e) => handleInputChange(e, true)} placeholder="DD/MM/YYYY" />
      </div>
      <div className="date-field">
        <label>📅 Fecha de entrega</label>
        <input type="text" value={endDate} onChange={(e) => handleInputChange(e, false)} placeholder="DD/MM/YYYY" />
      </div>
      <div className="calendar-header">
        <span>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <div className="calendar-nav">
          <button type="button" onClick={handlePrevMonth}>
            ‹
          </button>
          <button type="button" onClick={handleNextMonth}>
            ›
          </button>
        </div>
      </div>
      <div className="calendar">
        <div className="calendar-weekdays">
          <div>do</div>
          <div>lu</div>
          <div>ma</div>
          <div>mi</div>
          <div>ju</div>
          <div>vi</div>
          <div>sa</div>
        </div>
        <div className="calendar-dates">
          {calendarDays.map((dayObj, idx) => {
            const day = typeof dayObj === "number" ? dayObj : dayObj.day
            const isCurrentMonth = typeof dayObj === "number" || dayObj.isCurrentMonth
            const isStartDay = isCurrentMonth && isDateInCurrentMonth(day)
            const isEndDay = isCurrentMonth && isDateEndInCurrentMonth(day)

            return (
              <div
                key={idx}
                className={`calendar-day ${isStartDay || isEndDay ? "highlight" : ""} ${!isCurrentMonth ? "other-month" : ""}`}
                onClick={() => isCurrentMonth && handleCalendarDayClick(day)}
                style={{ cursor: isCurrentMonth ? "pointer" : "default" }}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
