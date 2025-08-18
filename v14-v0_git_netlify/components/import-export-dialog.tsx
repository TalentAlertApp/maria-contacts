"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Upload, Download, FileText } from "lucide-react"
import type { Contact } from "@/lib/types"

interface ImportExportDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "import" | "export-csv" | "export-pdf"
  onImport?: (contacts: Contact[]) => { added: number; duplicates: number; errors: string[] }
  contacts?: Contact[]
}

export function ImportExportDialog({ isOpen, onClose, type, onImport, contacts = [] }: ImportExportDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: { added?: number; duplicates?: number; errors?: string[] }
  } | null>(null)

  const handleImport = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsProcessing(true)
      setProgress(0)
      setResult(null)

      try {
        const text = await file.text()

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 100)

        // Parse CSV and import
        const { storage } = await import("@/lib/storage")
        const importedContacts = storage.importFromCSV(text)

        if (onImport) {
          const result = onImport(importedContacts)

          clearInterval(progressInterval)
          setProgress(100)

          setResult({
            success: true,
            message: `Import completed successfully!`,
            details: result,
          })
        }
      } catch (error) {
        setResult({
          success: false,
          message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
      } finally {
        setIsProcessing(false)
      }
    }

    input.click()
  }

  const handleExportCSV = async () => {
    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const { storage } = await import("@/lib/storage")

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90))
      }, 50)

      const csvContent = storage.exportToCSV(contacts)

      clearInterval(progressInterval)
      setProgress(100)

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `linkedin-contacts-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)

      setResult({
        success: true,
        message: `Successfully exported ${contacts.length} contacts to CSV!`,
      })
    } catch (error) {
      setResult({
        success: false,
        message: `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExportPDF = async () => {
    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const { pdfExport } = await import("@/lib/pdf-export")

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90))
      }, 100)

      await pdfExport.exportToPDF(contacts)

      clearInterval(progressInterval)
      setProgress(100)

      setResult({
        success: true,
        message: `Successfully generated PDF with ${contacts.length} contacts!`,
      })
    } catch (error) {
      setResult({
        success: false,
        message: `PDF export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStart = () => {
    switch (type) {
      case "import":
        handleImport()
        break
      case "export-csv":
        handleExportCSV()
        break
      case "export-pdf":
        handleExportPDF()
        break
    }
  }

  const getTitle = () => {
    switch (type) {
      case "import":
        return "Import Contacts"
      case "export-csv":
        return "Export to CSV"
      case "export-pdf":
        return "Export to PDF"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "import":
        return <Upload className="h-5 w-5" />
      case "export-csv":
        return <Download className="h-5 w-5" />
      case "export-pdf":
        return <FileText className="h-5 w-5" />
    }
  }

  const getDescription = () => {
    switch (type) {
      case "import":
        return "Select a CSV file to import contacts. Duplicates will be automatically detected."
      case "export-csv":
        return `Export all ${contacts.length} contacts to a CSV file for backup or use in other applications.`
      case "export-pdf":
        return `Generate a formatted PDF document with all ${contacts.length} contacts for printing or sharing.`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{getDescription()}</p>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                Processing...
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                    {result.message}
                    {result.details && (
                      <div className="mt-2 text-xs">
                        {result.details.added !== undefined && <div>✓ {result.details.added} contacts added</div>}
                        {result.details.duplicates !== undefined && result.details.duplicates > 0 && (
                          <div>⚠ {result.details.duplicates} duplicates skipped</div>
                        )}
                        {result.details.errors && result.details.errors.length > 0 && (
                          <div className="text-red-600">✗ {result.details.errors.length} errors occurred</div>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {result ? "Close" : "Cancel"}
            </Button>
            {!result && (
              <Button onClick={handleStart} disabled={isProcessing} className="bg-[#0077b5] hover:bg-[#004182]">
                {isProcessing ? "Processing..." : type === "import" ? "Select File" : "Export"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
