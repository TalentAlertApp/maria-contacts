"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Heart, Building, MapPin, Briefcase, Users, AlertCircle, X, ChevronDown } from "lucide-react"
import type { FilterState, Contact } from "@/lib/types"

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  showFavoritesOnly: boolean
  onToggleFavoritesOnly: () => void
  getUniqueValues: (field: keyof Contact) => string[]
  totalContacts: number
  filteredCount: number
}

const priorityOptions = [
  { value: "high", label: "High Priority", color: "bg-red-500" },
  { value: "medium", label: "Medium Priority", color: "bg-yellow-500" },
  { value: "low", label: "Low Priority", color: "bg-green-500" },
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

export function SearchFilters({
  filters,
  onFiltersChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  getUniqueValues,
  totalContacts,
  filteredCount,
}: SearchFiltersProps) {
  const [showAllFilters, setShowAllFilters] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilter = (key: keyof FilterState) => {
    onFiltersChange({ ...filters, [key]: "" })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      company: "",
      industry: "",
      location: "",
      priority: "",
      status: "",
      relationship: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (showFavoritesOnly ? 1 : 0)

  const companies = getUniqueValues("company")
  const industries = getUniqueValues("industry")
  const locations = getUniqueValues("location")

  return (
    <div className="space-y-4">
      {/* Search Bar and Main Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name, company, industry, location..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={onToggleFavoritesOnly}
            className="flex items-center gap-2"
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            Favorites
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${showAllFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredCount} of {totalContacts} contacts
          {activeFiltersCount > 0 && " (filtered)"}
        </span>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
            Clear all filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              Search: {filters.search}
              <Button variant="ghost" size="sm" onClick={() => clearFilter("search")} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.company && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              Company: {filters.company}
              <Button variant="ghost" size="sm" onClick={() => clearFilter("company")} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.industry && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Industry: {filters.industry}
              <Button variant="ghost" size="sm" onClick={() => clearFilter("industry")} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location: {filters.location}
              <Button variant="ghost" size="sm" onClick={() => clearFilter("location")} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.priority && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Priority: {priorityOptions.find((p) => p.value === filters.priority)?.label}
              <Button variant="ghost" size="sm" onClick={() => clearFilter("priority")} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusOptions.find((s) => s.value === filters.status)?.label}
              <Button variant="ghost" size="sm" onClick={() => clearFilter("status")} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.relationship && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Relationship: {relationshipOptions.find((r) => r.value === filters.relationship)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("relationship")}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {showFavoritesOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Heart className="h-3 w-3 fill-current" />
              Favorites Only
              <Button variant="ghost" size="sm" onClick={onToggleFavoritesOnly} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Expanded Filters */}
      {showAllFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-4 border rounded-lg bg-muted/50">
          {/* Company Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company
            </label>
            <Select value={filters.company} onValueChange={(value) => updateFilter("company", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-companies">All companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Industry
            </label>
            <Select value={filters.industry} onValueChange={(value) => updateFilter("industry", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-industries">All industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Priority
            </label>
            <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-priorities">All priorities</SelectItem>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Relationship Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Relationship
            </label>
            <Select value={filters.relationship} onValueChange={(value) => updateFilter("relationship", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All relationships" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-relationships">All relationships</SelectItem>
                {relationshipOptions.map((relationship) => (
                  <SelectItem key={relationship.value} value={relationship.value}>
                    {relationship.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
