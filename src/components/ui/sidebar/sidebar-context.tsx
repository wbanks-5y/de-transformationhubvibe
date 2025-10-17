
import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { SidebarContext as SidebarContextType } from "./types"

// Cookie name & max age constants
export const SIDEBAR_COOKIE_NAME = "react-sidebar-collapsed"
export const SIDEBAR_COOKIE_MAX_AGE = 2147483647

// Default sidebar widths in pixels (adjust if needed)
export const SIDEBAR_WIDTH = 240
export const SIDEBAR_WIDTH_MOBILE = 240
export const SIDEBAR_WIDTH_ICON = 56

// Default keyboard shortcut (adjust if needed)
export const SIDEBAR_KEYBOARD_SHORTCUT = ["⌘", "/"]

// Create context with default values
const SidebarContext = createContext<SidebarContextType>({
  state: "expanded",
  open: false,
  setOpen: () => null,
  openMobile: false,
  setOpenMobile: () => null,
  isMobile: false,
  toggleSidebar: () => null,
})

export const useSidebar = () => {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  storageKey = SIDEBAR_COOKIE_NAME,
  disableCollapse = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
  storageKey?: string
  disableCollapse?: boolean
}) {
  // Initialize state from localStorage or default
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (disableCollapse) return true
    
    if (typeof window === "undefined") {
      return !defaultCollapsed
    }

    const savedExpanded = window.localStorage.getItem(storageKey)
    return savedExpanded ? JSON.parse(savedExpanded) : !defaultCollapsed
  })

  // Update localStorage when expanded changes
  useEffect(() => {
    if (disableCollapse) return
    
    window.localStorage.setItem(storageKey, JSON.stringify(expanded))
  }, [expanded, storageKey, disableCollapse])

  // Toggle expanded state
  const toggleExpanded = () => {
    if (!disableCollapse) {
      setExpanded((prevExpanded) => !prevExpanded)
    }
  }

  // Toggle sidebar (alias for toggleExpanded)
  const toggleSidebar = () => {
    toggleExpanded()
  }

  return (
    <SidebarContext.Provider
      value={{
        state: expanded ? "expanded" : "collapsed",
        open: false,
        setOpen: () => null,
        openMobile: false,
        setOpenMobile: () => null,
        isMobile: false,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

