import type { Contact, AppSettings } from "./types"

const CONTACTS_KEY = "linkedin-contacts"
const SETTINGS_KEY = "linkedin-contacts-settings"

export const storage = {
  // Contacts management
  getContacts(): Contact[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(CONTACTS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveContacts(contacts: Contact[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts))
    } catch (error) {
      console.error("Failed to save contacts:", error)
    }
  },

  // Settings management
  getSettings(): AppSettings {
    if (typeof window === "undefined") {
      return {
        theme: "system",
        viewMode: "table",
        rowsPerPage: 10,
        showFavoritesOnly: false,
      }
    }
    try {
      const data = localStorage.getItem(SETTINGS_KEY)
      return data
        ? JSON.parse(data)
        : {
            theme: "system",
            viewMode: "table",
            rowsPerPage: 10,
            showFavoritesOnly: false,
          }
    } catch {
      return {
        theme: "system",
        viewMode: "table",
        rowsPerPage: 10,
        showFavoritesOnly: false,
      }
    }
  },

  saveSettings(settings: AppSettings): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  },

  // CSV Export
  exportToCSV(contacts: Contact[]): string {
    const headers = [
      "Name",
      "LinkedIn",
      "Company",
      "Position",
      "Industry",
      "Location",
      "City",
      "Skills",
      "Interests",
      "Email",
      "Other Contact",
      "Notes",
      "Favorite",
      "Priority",
      "Status",
      "Relationship",
      "Created At",
      "Updated At",
    ]

    const rows = contacts.map((contact) => [
      contact.name,
      contact.linkedin,
      contact.company,
      contact.position,
      contact.industry,
      contact.location,
      contact.city,
      contact.skills.join("; "),
      contact.interests.join("; "),
      contact.email,
      contact.otherContact,
      contact.notes,
      contact.isFavorite ? "Yes" : "No",
      contact.priority,
      contact.status,
      contact.relationship,
      new Date(contact.createdAt).toISOString(),
      new Date(contact.updatedAt).toISOString(),
    ])

    return [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")
  },

  // CSV Import
  importFromCSV(csvContent: string): Contact[] {
    const lines = csvContent.split("\n").filter((line) => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    const contacts: Contact[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
      if (values.length < headers.length) continue

      const contact: Contact = {
        id: crypto.randomUUID(),
        name: values[0] || "",
        linkedin: values[1] || "",
        company: values[2] || "",
        position: values[3] || "",
        industry: values[4] || "",
        location: values[5] || "",
        city: values[6] || "",
        skills: values[7] ? values[7].split(";").map((s) => s.trim()) : [],
        interests: values[8] ? values[8].split(";").map((s) => s.trim()) : [],
        email: values[9] || "",
        otherContact: values[10] || "",
        notes: values[11] || "",
        isFavorite: values[12]?.toLowerCase() === "yes",
        priority: (values[13] as any) || "medium",
        status: (values[14] as any) || "contact",
        relationship: (values[15] as any) || "none",
        createdAt: values[16] ? new Date(values[16]) : new Date(),
        updatedAt: values[17] ? new Date(values[17]) : new Date(),
      }

      contacts.push(contact)
    }

    return contacts
  },
}
