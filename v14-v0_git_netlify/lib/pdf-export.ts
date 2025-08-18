"use client"

import type { Contact } from "./types"

export const pdfExport = {
  // Generate PDF content for contacts
  async exportToPDF(contacts: Contact[]): Promise<void> {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      throw new Error("Unable to open print window. Please check your popup blocker.")
    }

    const htmlContent = this.generatePDFHTML(contacts)

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      // Close window after printing (user can cancel)
      printWindow.onafterprint = () => {
        printWindow.close()
      }
    }
  },

  generatePDFHTML(contacts: Contact[]): string {
    const currentDate = new Date().toLocaleDateString()

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>LinkedIn Contacts Export - ${currentDate}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #0077b5;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #0077b5;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #666;
              font-size: 14px;
            }
            .stats {
              text-align: center;
              margin-bottom: 30px;
              font-size: 14px;
              color: #666;
            }
            .contact {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
              page-break-inside: avoid;
              background: #fafafa;
            }
            .contact-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              padding-bottom: 8px;
            }
            .contact-name {
              font-size: 18px;
              font-weight: bold;
              color: #0077b5;
              margin: 0;
            }
            .contact-position {
              font-size: 14px;
              color: #666;
              margin: 2px 0 0 0;
            }
            .contact-badges {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            }
            .badge {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 500;
              text-transform: uppercase;
            }
            .priority-high { background: #fee2e2; color: #dc2626; }
            .priority-medium { background: #fef3c7; color: #d97706; }
            .priority-low { background: #dcfce7; color: #16a34a; }
            .favorite { background: #fce7f3; color: #be185d; }
            .contact-details {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 10px;
              margin-top: 10px;
            }
            .detail-item {
              font-size: 13px;
            }
            .detail-label {
              font-weight: 600;
              color: #374151;
              display: inline-block;
              min-width: 80px;
            }
            .detail-value {
              color: #6b7280;
            }
            .skills, .interests {
              margin-top: 8px;
            }
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
              margin-top: 4px;
            }
            .tag {
              background: #e5e7eb;
              color: #374151;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
            }
            .notes {
              margin-top: 10px;
              padding: 8px;
              background: #f9fafb;
              border-radius: 4px;
              font-size: 12px;
              color: #4b5563;
              font-style: italic;
            }
            @media print {
              body { margin: 0; }
              .contact { 
                break-inside: avoid;
                margin-bottom: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LinkedIn Contacts Export</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          
          <div class="stats">
            <strong>${contacts.length}</strong> contacts exported
          </div>

          ${contacts
            .map(
              (contact) => `
            <div class="contact">
              <div class="contact-header">
                <div>
                  <h3 class="contact-name">${this.escapeHtml(contact.name)}</h3>
                  <p class="contact-position">${this.escapeHtml(contact.position)} ${contact.company ? `at ${this.escapeHtml(contact.company)}` : ""}</p>
                </div>
                <div class="contact-badges">
                  <span class="badge priority-${contact.priority}">
                    ${contact.priority.charAt(0).toUpperCase() + contact.priority.slice(1)} Priority
                  </span>
                  ${contact.isFavorite ? '<span class="badge favorite">Favorite</span>' : ""}
                </div>
              </div>
              
              <div class="contact-details">
                ${
                  contact.industry
                    ? `
                  <div class="detail-item">
                    <span class="detail-label">Industry:</span>
                    <span class="detail-value">${this.escapeHtml(contact.industry)}</span>
                  </div>
                `
                    : ""
                }
                
                ${
                  contact.location || contact.city
                    ? `
                  <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${this.escapeHtml(`${contact.city}${contact.city && contact.location ? ", " : ""}${contact.location}`)}</span>
                  </div>
                `
                    : ""
                }
                
                ${
                  contact.email
                    ? `
                  <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${this.escapeHtml(contact.email)}</span>
                  </div>
                `
                    : ""
                }
                
                ${
                  contact.otherContact
                    ? `
                  <div class="detail-item">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${this.escapeHtml(contact.otherContact)}</span>
                  </div>
                `
                    : ""
                }
                
                ${
                  contact.linkedin
                    ? `
                  <div class="detail-item">
                    <span class="detail-label">LinkedIn:</span>
                    <span class="detail-value">${this.escapeHtml(contact.linkedin)}</span>
                  </div>
                `
                    : ""
                }
                
                <div class="detail-item">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">${this.getStatusLabel(contact.status)}</span>
                </div>
                
                <div class="detail-item">
                  <span class="detail-label">Relationship:</span>
                  <span class="detail-value">${this.getRelationshipLabel(contact.relationship)}</span>
                </div>
              </div>

              ${
                contact.skills.length > 0
                  ? `
                <div class="skills">
                  <span class="detail-label">Skills:</span>
                  <div class="tags">
                    ${contact.skills.map((skill) => `<span class="tag">${this.escapeHtml(skill)}</span>`).join("")}
                  </div>
                </div>
              `
                  : ""
              }

              ${
                contact.interests.length > 0
                  ? `
                <div class="interests">
                  <span class="detail-label">Interests:</span>
                  <div class="tags">
                    ${contact.interests.map((interest) => `<span class="tag">${this.escapeHtml(interest)}</span>`).join("")}
                  </div>
                </div>
              `
                  : ""
              }

              ${
                contact.notes
                  ? `
                <div class="notes">
                  <strong>Notes:</strong> ${this.escapeHtml(contact.notes)}
                </div>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </body>
      </html>
    `
  },

  escapeHtml(text: string): string {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  },

  getStatusLabel(status: string): string {
    const labels = {
      "contact-asap": "Contact ASAP",
      contact: "Contact",
      "contacted-answered": "Contacted/Answered",
      "contacted-no-answer": "Contacted/No Answer",
      "contacted-my-turn": "Contacted/My Turn",
    }
    return labels[status as keyof typeof labels] || status
  },

  getRelationshipLabel(relationship: string): string {
    const labels = {
      "good-friend": "Good Friend",
      acquainted: "Acquainted",
      none: "None",
      "no-idea": "No Idea",
    }
    return labels[relationship as keyof typeof labels] || relationship
  },
}
