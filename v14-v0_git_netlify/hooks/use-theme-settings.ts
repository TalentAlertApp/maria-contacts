"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"
import { useContacts } from "./use-contacts"

export function useThemeSettings() {
  const { theme, setTheme, systemTheme } = useTheme()
  const { settings, saveSettings } = useContacts()

  // Sync theme with settings
  useEffect(() => {
    if (theme && theme !== settings.theme) {
      saveSettings({ ...settings, theme: theme as "light" | "dark" | "system" })
    }
  }, [theme, settings, saveSettings])

  // Apply saved theme on mount
  useEffect(() => {
    if (settings.theme && settings.theme !== theme) {
      setTheme(settings.theme)
    }
  }, [settings.theme, theme, setTheme])

  const currentTheme = theme === "system" ? systemTheme : theme

  return {
    theme: theme as "light" | "dark" | "system",
    currentTheme: currentTheme as "light" | "dark",
    setTheme: (newTheme: "light" | "dark" | "system") => {
      setTheme(newTheme)
      saveSettings({ ...settings, theme: newTheme })
    },
  }
}
