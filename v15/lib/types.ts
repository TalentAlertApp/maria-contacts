export interface Contact {
  id: string
  name: string
  linkedin: string
  company: string
  position: string
  industry: string
  location: string
  city: string
  skills: string[]
  interests: string[]
  email: string
  otherContact: string
  notes: string
  isFavorite: boolean
  priority: "high" | "medium" | "low"
  status: "contact-asap" | "contact" | "contacted-answered" | "contacted-no-answer" | "contacted-my-turn"
  relationship: "good-friend" | "acquainted" | "none" | "no-idea"
  createdAt: Date
  updatedAt: Date
}

export interface AppSettings {
  theme: "light" | "dark" | "system"
  viewMode: "table" | "card"
  rowsPerPage: 10 | 20 | 50 | 100
  showFavoritesOnly: boolean
}

export interface FilterState {
  search: string
  company: string
  industry: string
  location: string
  priority: string
  status: string
  relationship: string
}
