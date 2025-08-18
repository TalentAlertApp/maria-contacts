"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Download, Upload, FileText, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onAddContact: () => void
  onExportCSV: () => void
  onImportCSV: () => void
  onExportPDF: () => void
}

export function Header({ onAddContact, onExportCSV, onImportCSV, onExportPDF }: HeaderProps) {
  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 theme-transition">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image src="/linkedin-icon.png" alt="LinkedIn" width={40} height={40} className="rounded-lg shadow-sm" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0077b5] to-[#00a0dc] bg-clip-text text-transparent">
                LinkedIn Contacts
              </h1>
              <p className="text-sm text-muted-foreground">Manage your professional network</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onAddContact}
              className="bg-[#0077b5] hover:bg-[#004182] text-white shadow-sm theme-transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Contact</span>
              <span className="sm:hidden">Add</span>
            </Button>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" onClick={onImportCSV} size="sm" className="theme-transition bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>

              <Button variant="outline" onClick={onExportCSV} size="sm" className="theme-transition bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" onClick={onExportPDF} size="sm" className="theme-transition bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>

            {/* Mobile menu for import/export */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="theme-transition bg-transparent">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onImportCSV}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExportPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
