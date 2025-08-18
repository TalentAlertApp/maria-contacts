"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, ExternalLink, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import type { Contact } from "@/lib/types"

interface ContactsTableProps {
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

export function ContactsTable({
  contacts,
  onToggleFavorite,
  onUpdateContact,
  onDeleteContact,
  onEditContact,
}: ContactsTableProps) {
  const truncateText = (text: string, maxLength = 15) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1200px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px] text-center">
                <Heart className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead className="w-[60px] text-center">Priority</TableHead>
              <TableHead className="w-[140px]">Name</TableHead>
              <TableHead className="w-[120px]">Company</TableHead>
              <TableHead className="w-[120px]">Position</TableHead>
              <TableHead className="w-[100px]">Industry</TableHead>
              <TableHead className="w-[120px]">Location</TableHead>
              <TableHead className="w-[140px]">Status</TableHead>
              <TableHead className="w-[120px]">Relationship</TableHead>
              <TableHead className="w-[50px] text-center">LinkedIn</TableHead>
              <TableHead className="w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className="h-12 hover:bg-muted/30">
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(contact.id)}
                    className="p-1 h-8 w-8"
                  >
                    <Heart
                      className={`h-4 w-4 ${contact.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
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
                </TableCell>

                <TableCell className="font-medium">
                  <div className="group relative">
                    <span className="cursor-help">{truncateText(contact.name, 18)}</span>
                    {contact.name.length > 18 && (
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg border text-sm whitespace-nowrap">
                        {contact.name}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="group relative">
                    <span className="cursor-help">{truncateText(contact.company, 15)}</span>
                    {contact.company.length > 15 && (
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg border text-sm whitespace-nowrap">
                        {contact.company}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="group relative">
                    <span className="cursor-help">{truncateText(contact.position, 15)}</span>
                    {contact.position.length > 15 && (
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg border text-sm whitespace-nowrap">
                        {contact.position}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="group relative">
                    <span className="cursor-help">{truncateText(contact.industry, 12)}</span>
                    {contact.industry.length > 12 && (
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg border text-sm whitespace-nowrap">
                        {contact.industry}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="group relative">
                    <span className="cursor-help">{truncateText(`${contact.city}, ${contact.location}`, 15)}</span>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-popover text-popover-foreground px-2 py-1 rounded shadow-lg border text-sm whitespace-nowrap">
                      {contact.city}, {contact.location}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2 w-full justify-start">
                        <Badge variant="outline" className="text-xs truncate max-w-[120px]">
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
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2 w-full justify-start">
                        <Badge variant="secondary" className="text-xs truncate max-w-[100px]">
                          {relationshipLabels[contact.relationship]}
                        </Badge>
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
                </TableCell>

                <TableCell className="text-center">
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
                </TableCell>

                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden text-xs text-muted-foreground text-center mt-2">
        Scroll horizontally to see all columns
      </div>
    </div>
  )
}
