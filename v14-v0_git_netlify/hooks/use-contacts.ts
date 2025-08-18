"use client"

import { useState, useEffect, useCallback } from "react"
import type { Contact, AppSettings, FilterState } from "@/lib/types"
import { storage } from "@/lib/storage"

export function useContacts() {
  const [allContacts, setAllContacts] = useState<Contact[]>([])
  const [settings, setSettings] = useState<AppSettings>({
    theme: "system",
    viewMode: "table",
    rowsPerPage: 10,
    showFavoritesOnly: false,
  })
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    company: "",
    industry: "",
    location: "",
    priority: "",
    status: "",
    relationship: "",
  })

  // Load data on mount
  useEffect(() => {
    setAllContacts(storage.getContacts())
    setSettings(storage.getSettings())
  }, [])

  // Save contacts when they change
  const saveContacts = useCallback((newContacts: Contact[]) => {
    setAllContacts(newContacts)
    storage.saveContacts(newContacts)
  }, [])

  // Save settings when they change
  const saveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings)
    storage.saveSettings(newSettings)
  }, [])

  // Add contact
  const addContact = useCallback(
    (contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => {
      const newContact: Contact = {
        ...contactData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Check for duplicates
      const isDuplicate = allContacts.some(
        (contact) =>
          contact.name.toLowerCase() === newContact.name.toLowerCase() &&
          contact.company.toLowerCase() === newContact.company.toLowerCase(),
      )

      if (isDuplicate) {
        return { success: false, message: "Contact with this name and company already exists" }
      }

      const updatedContacts = [...allContacts, newContact]
      saveContacts(updatedContacts)
      return { success: true, contact: newContact }
    },
    [allContacts, saveContacts],
  )

  // Update contact
  const updateContact = useCallback(
    (id: string, updates: Partial<Contact>) => {
      const updatedContacts = allContacts.map((contact) =>
        contact.id === id ? { ...contact, ...updates, updatedAt: new Date() } : contact,
      )
      saveContacts(updatedContacts)
    },
    [allContacts, saveContacts],
  )

  // Delete contact
  const deleteContact = useCallback(
    (id: string) => {
      const updatedContacts = allContacts.filter((contact) => contact.id !== id)
      saveContacts(updatedContacts)
    },
    [allContacts, saveContacts],
  )

  // Toggle favorite
  const toggleFavorite = useCallback(
    (id: string) => {
      updateContact(id, { isFavorite: !allContacts.find((c) => c.id === id)?.isFavorite })
    },
    [allContacts, updateContact],
  )

  // Filter contacts
  const filteredContacts = allContacts.filter((contact) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const searchableFields = [
        contact.name,
        contact.company,
        contact.position,
        contact.industry,
        contact.location,
        contact.city,
        contact.skills.join(" "),
        contact.interests.join(" "),
      ]
        .join(" ")
        .toLowerCase()

      if (!searchableFields.includes(searchTerm)) return false
    }

    // Other filters
    if (filters.company && contact.company !== filters.company) return false
    if (filters.industry && contact.industry !== filters.industry) return false
    if (filters.location && contact.location !== filters.location) return false
    if (filters.priority && contact.priority !== filters.priority) return false
    if (filters.status && contact.status !== filters.status) return false
    if (filters.relationship && contact.relationship !== filters.relationship) return false

    // Favorites filter
    if (settings.showFavoritesOnly && !contact.isFavorite) return false

    return true
  })

  // Get unique values for filter dropdowns
  const getUniqueValues = useCallback(
    (field: keyof Contact) => {
      return Array.from(new Set(allContacts.map((contact) => contact[field] as string).filter(Boolean)))
    },
    [allContacts],
  )

  return {
    contacts: filteredContacts,
    allContacts,
    settings,
    filters,
    setFilters,
    saveSettings,
    addContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    getUniqueValues,
  }
}
