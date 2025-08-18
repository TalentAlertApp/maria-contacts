"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Contact } from "@/lib/types"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => { success: boolean; message?: string }
  onUpdate?: (id: string, updates: Partial<Contact>) => void
  contact?: Contact | null
  mode: "create" | "edit"
}

const priorityOptions = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
]

const statusOptions = [
  { value: "contact-asap", label: "Contact ASAP" },
  { value: "contact", label: "Contact" },
  { value: "contacted-answered", label: "Contacted/Answered" },
  { value: "contacted-no-answer", label: "Contacted/No Answer" },
  { value: "contacted-my-turn", label: "Contacted/My Turn" },
]

const relationshipOptions = [
  { value: "good-friend", label: "Good Friend" },
  { value: "acquainted", label: "Acquainted" },
  { value: "none", label: "None" },
  { value: "no-idea", label: "No Idea" },
]

export function ContactModal({ isOpen, onClose, onSave, onUpdate, contact, mode }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    linkedin: "",
    company: "",
    position: "",
    industry: "",
    location: "",
    city: "",
    skills: [] as string[],
    interests: [] as string[],
    email: "",
    otherContact: "",
    notes: "",
    isFavorite: false,
    priority: "medium" as const,
    status: "contact" as const,
    relationship: "none" as const,
  })

  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [error, setError] = useState("")

  // Initialize form data when contact changes
  useEffect(() => {
    if (contact && mode === "edit") {
      setFormData({
        name: contact.name,
        linkedin: contact.linkedin,
        company: contact.company,
        position: contact.position,
        industry: contact.industry,
        location: contact.location,
        city: contact.city,
        skills: [...contact.skills],
        interests: [...contact.interests],
        email: contact.email,
        otherContact: contact.otherContact,
        notes: contact.notes,
        isFavorite: contact.isFavorite,
        priority: contact.priority,
        status: contact.status,
        relationship: contact.relationship,
      })
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        linkedin: "",
        company: "",
        position: "",
        industry: "",
        location: "",
        city: "",
        skills: [],
        interests: [],
        email: "",
        otherContact: "",
        notes: "",
        isFavorite: false,
        priority: "medium",
        status: "contact",
        relationship: "none",
      })
    }
    setError("")
    setActiveTab("basic")
  }, [contact, mode, isOpen])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, newInterest.trim()] }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({ ...prev, interests: prev.interests.filter((i) => i !== interest) }))
  }

  const handleSave = () => {
    // Basic validation
    if (!formData.name.trim()) {
      setError("Name is required")
      setActiveTab("basic")
      return
    }

    if (mode === "create") {
      const result = onSave(formData)
      if (result.success) {
        onClose()
      } else {
        setError(result.message || "Failed to save contact")
      }
    } else if (mode === "edit" && contact && onUpdate) {
      onUpdate(contact.id, formData)
      onClose()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault()
      action()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Contact" : "Edit Contact"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[60vh] mt-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => updateFormData("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Country/State</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherContact">Other Contact Info</Label>
                <Input
                  id="otherContact"
                  value={formData.otherContact}
                  onChange={(e) => updateFormData("otherContact", e.target.value)}
                  placeholder="Phone, website, etc."
                />
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateFormData("company", e.target.value)}
                  placeholder="Company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => updateFormData("position", e.target.value)}
                  placeholder="Job title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => updateFormData("industry", e.target.value)}
                  placeholder="Technology, Finance, etc."
                />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => handleKeyPress(e, addSkill)}
                  />
                  <Button type="button" onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    onKeyPress={(e) => handleKeyPress(e, addInterest)}
                  />
                  <Button type="button" onClick={addInterest} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="flex items-center gap-1">
                      {interest}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInterest(interest)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  placeholder="Additional notes (max 200 characters)"
                  maxLength={200}
                  rows={3}
                />
                <div className="text-xs text-muted-foreground text-right">{formData.notes.length}/200 characters</div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => updateFormData("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => updateFormData("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Relationship</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value: any) => updateFormData("relationship", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={formData.isFavorite}
                  onChange={(e) => updateFormData("isFavorite", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="favorite">Add to favorites</Label>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#0077b5] hover:bg-[#004182]">
            {mode === "create" ? "Add Contact" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
