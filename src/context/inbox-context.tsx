"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface InboxContextType {
  isOpen: boolean
  toggleInbox: () => void
  openInbox: () => void
  closeInbox: () => void
}

const InboxContext = createContext<InboxContextType | undefined>(undefined)

export function InboxProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleInbox = () => setIsOpen((prev) => !prev)
  const openInbox = () => setIsOpen(true)
  const closeInbox = () => setIsOpen(false)

  return (
    <InboxContext.Provider value={{ isOpen, toggleInbox, openInbox, closeInbox }}>{children}</InboxContext.Provider>
  )
}

export function useInbox() {
  const context = useContext(InboxContext)
  if (context === undefined) {
    throw new Error("useInbox must be used within an InboxProvider")
  }
  return context
}
