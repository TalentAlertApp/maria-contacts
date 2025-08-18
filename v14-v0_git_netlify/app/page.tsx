"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { SearchFilters } from "@/components/search-filters"
import { ContactsTable } from "@/components/contacts-table"
import { ContactsCards } from "@/components/contacts-cards"
import { ContactModal } from "@/components/contact-modal"
import { ImportExportDialog } from "@/components/import-export-dialog"
import { Pagination } from "@/components/pagination"
import { useContacts } from "@/hooks/use-contacts"
import { Button } from "@/components/ui/button"
import type { Contact } from "@/lib/types"

export default function HomePage() {
  const {
    contacts,
    allContacts,
    settings,
    filters,
    setFilters,
    addContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    saveSettings,
    getUniqueValues,
  } = useContacts()

  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [importExportDialog, setImportExportDialog] = useState<{
    isOpen: boolean
    type: "import" | "export-csv" | "export-pdf"
  }>({ isOpen: false, type: "import" })

  // Pagination logic
  const totalPages = Math.ceil(contacts.length / settings.rowsPerPage)
  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * settings.rowsPerPage
    return contacts.slice(startIndex, startIndex + settings.rowsPerPage)
  }, [contacts, currentPage, settings.rowsPerPage])

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleToggleFavoritesOnly = () => {
    saveSettings({ ...settings, showFavoritesOnly: !settings.showFavoritesOnly })
    setCurrentPage(1)
  }

  const handleAddContact = () => {
    setModalMode("create")
    setEditingContact(null)
    setIsModalOpen(true)
  }

  const handleEditContact = (contact: Contact) => {
    setModalMode("edit")
    setEditingContact(contact)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingContact(null)
  }

  const handleImportContacts = (importedContacts: Contact[]) => {
    let addedCount = 0
    let duplicateCount = 0
    const errors: string[] = []

    importedContacts.forEach((contactData) => {
      try {
        const result = addContact(contactData)
        if (result.success) {
          addedCount++
        } else {
          duplicateCount++
        }
      } catch (error) {
        errors.push(`Failed to import ${contactData.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    })

    return { added: addedCount, duplicates: duplicateCount, errors }
  }

  const handleExportCSV = () => {
    setImportExportDialog({ isOpen: true, type: "export-csv" })
  }

  const handleImportCSV = () => {
    setImportExportDialog({ isOpen: true, type: "import" })
  }

  const handleExportPDF = () => {
    setImportExportDialog({ isOpen: true, type: "export-pdf" })
  }

  const handleViewModeChange = (viewMode: "table" | "card") => {
    saveSettings({ ...settings, viewMode })
  }

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    saveSettings({ ...settings, rowsPerPage })
    setCurrentPage(1) // Reset to first page
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddContact={handleAddContact}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportCSV}
        onExportPDF={handleExportPDF}
      />

      <main className="container mx-auto px-4 py-6">
        {allContacts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Welcome to LinkedIn Contacts Manager</h2>
            <p className="text-muted-foreground mb-8">Start by adding your first contact or importing from CSV</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search and Filters */}
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              showFavoritesOnly={settings.showFavoritesOnly}
              onToggleFavoritesOnly={handleToggleFavoritesOnly}
              getUniqueValues={getUniqueValues}
              totalContacts={allContacts.length}
              filteredCount={contacts.length}
            />

            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Your Contacts
                {contacts.length !== allContacts.length && (
                  <span className="text-muted-foreground text-lg ml-2">
                    ({contacts.length} of {allContacts.length})
                  </span>
                )}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={settings.viewMode === "table" ? "default" : "outline"}
                  onClick={() => handleViewModeChange("table")}
                >
                  Table View
                </Button>
                <Button
                  variant={settings.viewMode === "card" ? "default" : "outline"}
                  onClick={() => handleViewModeChange("card")}
                >
                  Card View
                </Button>
              </div>
            </div>

            {/* Contacts Display */}
            {contacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No contacts match your current filters.</p>
              </div>
            ) : (
              <>
                {settings.viewMode === "table" ? (
                  <ContactsTable
                    contacts={paginatedContacts}
                    onToggleFavorite={toggleFavorite}
                    onUpdateContact={updateContact}
                    onDeleteContact={deleteContact}
                    onEditContact={handleEditContact}
                  />
                ) : (
                  <ContactsCards
                    contacts={paginatedContacts}
                    onToggleFavorite={toggleFavorite}
                    onUpdateContact={updateContact}
                    onDeleteContact={deleteContact}
                    onEditContact={handleEditContact}
                  />
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  rowsPerPage={settings.rowsPerPage}
                  totalItems={contacts.length}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={addContact}
        onUpdate={updateContact}
        contact={editingContact}
        mode={modalMode}
      />

      {/* Import/Export Dialog */}
      <ImportExportDialog
        isOpen={importExportDialog.isOpen}
        onClose={() => setImportExportDialog({ isOpen: false, type: "import" })}
        type={importExportDialog.type}
        onImport={importExportDialog.type === "import" ? handleImportContacts : undefined}
        contacts={allContacts}
      />
    </div>
  )
}
