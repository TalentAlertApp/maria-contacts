"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, ExternalLink, MoreHorizontal, Edit, Trash2, MapPin, Building, User, Mail, Phone } from "lucide-react"
import type { Contact } from "@/lib/types"

interface ContactsCardsProps {
  contacts: Contact[]
  onToggleFavorite: (id: string) => void
  onUpdateContact: (id: string, updates: Partial<Contact>) => void
  onDeleteContact: (id: string) => void
  onEditContact: (contact: Contact) => void
}

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
}

const statusLabels = {
  "contact-asap": "Contact ASAP",
  contact: "Contact",
  "contacted-answered": "Contacted/Answered",
  "contacted-no-answer": "Contacted/No Answer",
  "contacted-my-turn": "Contacted/My Turn",
}

const relationshipLabels = {
  "good-friend": "Good Friend",
  acquainted: "Acquainted",
  none: "None",
  "no-idea": "No Idea",
}

export function ContactsCards({
  contacts,
  onToggleFavorite,
  onUpdateContact,
  onDeleteContact,
  onEditContact,
}: ContactsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="relative hover:shadow-md transition-shadow duration-200">
          {/* Priority colored left bar */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${priorityColors[contact.priority]}`} />

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight truncate" title={contact.name}>
                  {contact.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 truncate" title={contact.position}>
                  {contact.position}
                </p>
              </div>

              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(contact.id)}
                  className="p-1 h-8 w-8"
                  title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-4 w-4 ${contact.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <Badge variant="outline" className="text-xs max-w-[80px] truncate">
                        {statusLabels[contact.status]}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <DropdownMenuItem key={key} onClick={() => onUpdateContact(contact.id, { status: key as any })}>
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate" title={contact.company}>
                  {contact.company}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate" title={`${contact.city}, ${contact.location}`}>
                  {contact.city}, {contact.location}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-sm justify-start">
                      <span className="truncate">{relationshipLabels[contact.relationship]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(relationshipLabels).map(([key, label]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => onUpdateContact(contact.id, { relationship: key as any })}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {contact.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="truncate text-blue-600 hover:underline"
                    title={contact.email}
                  >
                    {contact.email}
                  </a>
                </div>
              )}

              {contact.otherContact && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate" title={contact.otherContact}>
                    {contact.otherContact}
                  </span>
                </div>
              )}

              {contact.industry && (
                <Badge variant="secondary" className="text-xs max-w-full truncate" title={contact.industry}>
                  {contact.industry}
                </Badge>
              )}

              {contact.notes && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2" title={contact.notes}>
                  {contact.notes}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8" title="Change priority">
                      <div className={`w-4 h-4 rounded-full ${priorityColors[contact.priority]}`} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onUpdateContact(contact.id, { priority: "high" })}>
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                      High Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateContact(contact.id, { priority: "medium" })}>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                      Medium Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateContact(contact.id, { priority: "low" })}>
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                      Low Priority
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {contact.linkedin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(contact.linkedin, "_blank")}
                    className="p-1 h-8 w-8"
                    title="Open LinkedIn profile"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8" title="More actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEditContact(contact)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteContact(contact.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
