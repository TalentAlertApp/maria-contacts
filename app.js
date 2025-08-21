// LinkedIn Contacts Manager - Main Application
class ContactsManager {
    constructor() {
        this.contacts = [];
        this.filteredContacts = [];
        this.currentView = 'table';
        this.currentSort = 'name';
        this.currentSortDirection = 'asc';
        this.editingContactId = null;
        this.currentPage = 1;
        this.contactsPerPage = 9; // 3 rows x 3 columns
        this.tableCurrentPage = 1;
        this.tableRecordsPerPage = 10; // Default for table view
        this.searchTimeout = null;
        

        
        // Application data from JSON
        this.appData = {
            priorities: ["High Priority", "Medium Priority", "Low Priority"],
            statuses: ["Contact ASAP", "Contact", "Contacted/Answered", "Contacted/No Answer", "Contacted/My Turn"],
            relationships: ["Good friend", "Acquainted", "None", "No idea"],
            companies: [], // Will be populated from imported CSV data
            industries: [], // Will be populated from imported CSV data
            locations: [] // Will be populated from imported CSV data
        };
        
        // Sample data
        this.sampleContacts = [
            {
                id: 1,
                name: "Denis Perushev",
                linkedin: "https://www.linkedin.com/in/denis-perushev-1b2412266",
                company: "INTERFOOTBALL MANAGEMENT S.L.",
                position: "Sports Agent",
                industry: "Spectator Sports",
                location: "Spain",
                city: "Madrid",
                skills: "Sports Management, Football Analytics, Player Representation",
                interests: "Football, Sports Business, Player Development",
                email: "denis@interfootball.com",
                otherContact: "+34 123 456 789",
                favorite: false,
                priority: "Medium Priority",
                status: "Contact",
                relationship: "Professional",
                notes: "Sports agent with extensive network in football industry"
            },
            {
                id: 2,
                name: "León Adel D'souza",
                linkedin: "https://www.linkedin.com/in/le%C3%B3n-adel-d-souza-804846140",
                company: "Indonesian Football Group",
                position: "Football Academy Head",
                industry: "Leisure, Travel & Tourism",
                location: "Indonesia",
                city: "Jakarta",
                skills: "Youth Development, Football Coaching, Academy Management",
                interests: "Football Development, Youth Training, Sports Education",
                email: "leon@indonesianfootball.com",
                otherContact: "+62 123 456 789",
                favorite: true,
                priority: "High Priority",
                status: "Contact ASAP",
                relationship: "Good Friend",
                notes: "Head of football academy, great contact for youth development"
            }
        ];
        
        this.init();
    }
    
    init() {
        console.log('=== INITIALIZING CONTACTS MANAGER ===');
        
        // Initialize elements first
        this.initializeElements();
        
        // Load contacts with fallback
        this.loadContactsWithFallback();
        
        // Bind events and populate dropdowns
        this.bindEvents();
        this.populateDropdowns();
        this.initializeTheme();
        
        console.log('=== INITIALIZATION COMPLETE ===');
    }
    
    loadContactsWithFallback() {
        console.log('=== LOADING CONTACTS WITH FALLBACK ===');
        
        // Try to load contacts from localStorage first
        try {
            const savedContacts = localStorage.getItem('linkedinContacts');
            if (savedContacts) {
                this.contacts = JSON.parse(savedContacts);
                this.filteredContacts = [...this.contacts];
                console.log(`Loaded ${this.contacts.length} contacts from localStorage`);
            } else {
                // Start with empty contacts - user will import CSV
                this.contacts = [];
                this.filteredContacts = [];
                console.log('No contacts found in localStorage, starting with empty list');
            }
        } catch (error) {
            console.error('Error loading contacts from localStorage:', error);
            this.contacts = [];
            this.filteredContacts = [];
        }
        
        // Update stats to show current state
        this.updateStats();
        
        // Update view immediately
        this.updateView();
        
        console.log('=== END LOADING CONTACTS ===');
    }
    

    
    initializeElements() {
        console.log('=== INITIALIZING ELEMENTS ===');
        
        // Cache DOM elements
        this.elements = {
            // Header elements
            globalSearch: document.getElementById('globalSearch'),
            addContactBtn: document.getElementById('addContactBtn'),
            importBtn: document.getElementById('importBtn'),
            exportBtn: document.getElementById('exportBtn'),
            themeToggle: document.getElementById('themeToggle'),
            
            // Content elements
            contactCount: document.getElementById('contactCount'),
            filteredCount: document.getElementById('filteredCount'),
            favoritesFilter: document.getElementById('favoritesFilter'),
            viewToggleBtns: document.querySelectorAll('.view-toggle__btn'),

            tableView: document.getElementById('tableView'),
            cardView: document.getElementById('cardView'),
            contactsTableBody: document.getElementById('contactsTableBody'),
            contactsCardsContainer: document.getElementById('contactsCardsContainer'),
            
                    // Pagination elements
            paginationContainer: document.getElementById('paginationContainer'),
            prevPageBtn: document.getElementById('prevPageBtn'),
            nextPageBtn: document.getElementById('nextPageBtn'),
            pageInfo: document.getElementById('pageInfo'),
            
            // Table pagination elements
            tablePaginationContainer: document.getElementById('tablePaginationContainer'),
            tablePrevPageBtn: document.getElementById('tablePrevPageBtn'),
            tableNextPageBtn: document.getElementById('tableNextPageBtn'),
            tablePageInfo: document.getElementById('tablePageInfo'),
            tableRecordsPerPage: document.getElementById('tableRecordsPerPage'),
        

            
            // Modal elements
            contactModal: document.getElementById('contactModal'),
            modalTitle: document.getElementById('modalTitle'),
            contactForm: document.getElementById('contactForm'),
            saveBtn: document.getElementById('saveBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            
            // Import modal elements
            importModal: document.getElementById('importModal'),
            csvFileInput: document.getElementById('csvFileInput'),
            confirmImportBtn: document.getElementById('confirmImportBtn'),
            cancelImportBtn: document.getElementById('cancelImportBtn'),
            
            // Toast
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            toastClose: document.querySelector('.toast__close')
        };
        
        // Log important elements for debugging
        console.log('Import modal elements found:');
        console.log('- importModal:', this.elements.importModal);
        console.log('- csvFileInput:', this.elements.csvFileInput);
        console.log('- confirmImportBtn:', this.elements.confirmImportBtn);
        console.log('- cancelImportBtn:', this.elements.cancelImportBtn);
        
        // Check if confirmImportBtn is properly initialized
        if (this.elements.confirmImportBtn) {
            console.log('confirmImportBtn found and initialized');
            console.log('Initial disabled state:', this.elements.confirmImportBtn.disabled);
            console.log('Initial text content:', this.elements.confirmImportBtn.textContent);
        } else {
            console.error('confirmImportBtn NOT FOUND!');
        }
        
        console.log('Elements initialized:', Object.keys(this.elements).length);
        console.log('=== END INITIALIZING ELEMENTS ===');
    }
    
    bindEvents() {
        console.log('=== BINDING EVENTS ===');
        
        // Header events with debounced search
        if (this.elements.globalSearch) {
            this.elements.globalSearch.addEventListener('input', this.handleGlobalSearch.bind(this));
        }
        if (this.elements.addContactBtn) {
            this.elements.addContactBtn.addEventListener('click', this.openAddContactModal.bind(this));
        }
        if (this.elements.importBtn) {
            this.elements.importBtn.addEventListener('click', this.openImportModal.bind(this));
        }
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', this.exportContacts.bind(this));
        }
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        
        // Clear all contacts button
        const clearAllContactsBtn = document.getElementById('clearAllContactsBtn');
        if (clearAllContactsBtn) {
            clearAllContactsBtn.addEventListener('click', this.clearAllContacts.bind(this));
        }
        
        // Favorites filter event
        if (this.elements.favoritesFilter) {
            this.elements.favoritesFilter.addEventListener('click', this.toggleFavoritesFilter.bind(this));
        }
        
        // Content events
        this.elements.viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', this.handleViewToggle.bind(this));
        });
        // Removed selectAll event binding - element no longer exists
        
        // Export PDF event
        document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportPdf());
        
        // Table pagination events
        if (this.elements.tableRecordsPerPage) {
            this.elements.tableRecordsPerPage.addEventListener('change', this.handleTableRecordsPerPageChange.bind(this));
        }
        if (this.elements.tablePrevPageBtn) {
            this.elements.tablePrevPageBtn.addEventListener('click', () => this.goToTablePage(this.tableCurrentPage - 1));
        }
        if (this.elements.tableNextPageBtn) {
            this.elements.tableNextPageBtn.addEventListener('click', () => this.goToTablePage(this.tableCurrentPage + 1));
        }
        
        // Table sorting events
        this.bindTableSortingEvents();
        

        
        // Modal events
        this.elements.contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        this.elements.cancelBtn.addEventListener('click', this.closeModal.bind(this));
        this.elements.csvFileInput.addEventListener('change', this.handleFileSelect.bind(this));
        this.elements.confirmImportBtn.addEventListener('click', this.confirmImport.bind(this));
        this.elements.cancelImportBtn.addEventListener('click', this.closeImportModal.bind(this));
        
        // Modal tab events
        this.bindModalTabEvents();
        
        // Close modal events
        document.addEventListener('click', this.handleModalBackdropClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Direct modal close button events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal__close')) {
                this.closeModal();
            }
        });
        
        // Toast events
        this.elements.toastClose.addEventListener('click', this.hideToast.bind(this));
        
        // Inline edit events
        this.bindInlineEditEvents();
        
        // Events bound successfully
        
        console.log('=== EVENTS BOUND ===');
    }
    
    populateDropdowns() {
        console.log('=== POPULATING DROPDOWNS ===');
        
        console.log('Populating dropdowns...');
        console.log('App data:', this.appData);
        
        // Only populate datalists if there's data
        if (this.appData.companies.length > 0) {
            this.populateDatalist('companyOptions', this.appData.companies);
        }
        if (this.appData.industries.length > 0) {
            this.populateDatalist('industryOptions', this.appData.industries);
        }
        if (this.appData.locations.length > 0) {
            this.populateDatalist('locationOptions', this.appData.locations);
        }
        
        // Populate form dropdowns
        this.populateDatalist('contactIndustryOptions', this.appData.industries);
        this.populateDatalist('contactLocationOptions', this.appData.locations);
        this.populateDatalist('contactCompanyOptions', this.appData.companies);
        this.populateDatalist('contactCityOptions', this.appData.cities || []);
        this.populateSelect(document.getElementById('contactPriority'), this.appData.priorities);
        this.populateSelect(document.getElementById('contactStatus'), this.appData.statuses);
        
        // Dropdowns populated successfully
        
        console.log('Dropdowns populated successfully');
    }
    
    populateSelect(selectElement, options) {
        if (!selectElement) {
            console.warn('Select element is null, cannot populate');
            return;
        }
        
        console.log(`Populating select: ${selectElement.id} with ${options.length} options`);
        console.log('Options:', options);
        
        // Clear existing options except the first one (which is usually "All" or placeholder)
        const existingOptions = selectElement.querySelectorAll('option');
        console.log(`Found ${existingOptions.length} existing options in ${selectElement.id}`);
        
        // Remove all options except the first one
        for (let i = existingOptions.length - 1; i >= 1; i--) {
            existingOptions[i].remove();
        }
        
        console.log(`Cleared ${existingOptions.length - 1} options, keeping first option: "${existingOptions[0]?.textContent}"`);
        
        // Add new options, but check for duplicates first
        const existingValues = new Set();
        if (existingOptions[0]) {
            existingValues.add(existingOptions[0].value);
        }
        
        let addedCount = 0;
        options.forEach(option => {
            // Skip if option already exists
            if (existingValues.has(option)) {
                console.log(`Skipping duplicate option: ${option}`);
                return;
            }
            
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
            existingValues.add(option);
            addedCount++;
        });
        
        console.log(`Added ${addedCount} new options to ${selectElement.id}`);
        console.log('Final options count:', selectElement.querySelectorAll('option').length);
    }
    
    populateDatalist(datalistId, options) {
        const datalist = document.getElementById(datalistId);
        if (!datalist) return;
        
        console.log(`Populating datalist: ${datalistId} with ${options.length} options`);
        
        // Clear existing options except the first one
        const existingOptions = datalist.querySelectorAll('option');
        console.log(`Found ${existingOptions.length} existing options in ${datalistId}`);
        
        // Remove all options except the first one
        for (let i = existingOptions.length - 1; i >= 1; i--) {
            existingOptions[i].remove();
        }
        
        console.log(`Cleared ${existingOptions.length - 1} options, keeping first option: "${existingOptions[0]?.textContent}"`);
        
        // Add new options, but check for duplicates first
        const existingValues = new Set();
        if (existingOptions[0]) {
            existingValues.add(existingOptions[0].value);
        }
        
        options.forEach(option => {
            // Skip if option already exists
            if (existingValues.has(option)) {
                console.log(`Skipping duplicate option: ${option}`);
                return;
            }
            
            const optionElement = document.createElement('option');
            optionElement.value = option;
            datalist.appendChild(optionElement);
            existingValues.add(option);
        });
        
        console.log(`Added ${options.length} new options to ${datalistId}`);
    }
    
    bindModalTabEvents() {
        const tabButtons = document.querySelectorAll('.modal__tab');
        const tabContents = document.querySelectorAll('.modal__tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.dataset.tab === targetTab) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    bindTableSortingEvents() {
        const sortableHeaders = document.querySelectorAll('.sortable');
        
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortField = header.dataset.sort;
                
                // Toggle sort direction if same field
                if (this.currentSort === sortField) {
                    this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.currentSort = sortField;
                    this.currentSortDirection = 'asc';
                }
                
                // Sort indicators removed as per user request
                
                // Apply sorting
                this.applyFilters();
            });
        });
    }
    

    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-color-scheme', prefersDark ? 'dark' : 'light');
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    

    

    
    saveContacts() {
        try {
            localStorage.setItem('linkedinContacts', JSON.stringify(this.contacts));
        } catch (error) {
            console.error('Failed to save contacts:', error);
        }
    }
    

    
    generateId() {
        return Math.max(0, ...this.contacts.map(c => c.id)) + 1;
    }
    
    // Debounced search with 300ms delay
    handleGlobalSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Set new timeout for debounced search
        this.searchTimeout = setTimeout(() => {
            this.applyFilters(query);
        }, 300);
    }
    
    // Toggle favorites filter
    toggleFavoritesFilter() {
        // Toggle the active state of the button
        const isActive = this.elements.favoritesFilter.classList.contains('active');
        
        if (isActive) {
            this.elements.favoritesFilter.classList.remove('active');
            this.showingFavoritesOnly = false;
        } else {
            this.elements.favoritesFilter.classList.add('active');
            this.showingFavoritesOnly = true;
        }
        
        // Apply filters
        this.applyFilters();
    }
    
    // Simplified filters with search and favorites only
    applyFilters(searchQuery = '') {
        console.log('=== APPLY FILTERS CALLED ===');
        
        const search = searchQuery || this.elements.globalSearch.value.toLowerCase().trim();
        const showingFavoritesOnly = this.showingFavoritesOnly || false;
        
        console.log('Filter values:', {
            search: search || 'none',
            showingFavoritesOnly: showingFavoritesOnly
        });
        
        // Early return if no filters are active
        if (!search && !showingFavoritesOnly) {
            console.log('No active filters, showing all contacts');
            this.filteredContacts = [...this.contacts];
            this.sortContacts();
            this.updateStats();
            this.updateView();
            return;
        }
        
        console.log('Starting filter process. Total contacts:', this.contacts.length);
        
        // Filter contacts
        this.filteredContacts = this.contacts.filter(contact => {
            // Search filter (only if search query exists)
            if (search) {
                const searchableFields = [
                    contact.name, contact.company, contact.position, 
                    contact.industry, contact.location, contact.city,
                    contact.skills, contact.interests, contact.email, 
                    contact.notes
                ].filter(field => field);
                
                const matches = searchableFields.some(field => 
                    field.toLowerCase().includes(search)
                );
                
                if (!matches) {
                    return false;
                }
            }
            
            // Favorites filter
            if (showingFavoritesOnly) {
                const isFavorite = contact.favorite === true || contact.favorite === 'true' || contact.favorite === 'Yes';
                if (!isFavorite) {
                    return false;
                }
            }
            
            return true;
        });
        
        console.log('Filtering complete. Filtered contacts:', this.filteredContacts.length);
        
        // Sort contacts
        this.sortContacts();
        
        // Reset to first page when filters change
        this.currentPage = 1;
        this.tableCurrentPage = 1;
        
        // Update UI
        this.updateStats();
        this.updateView();
    }
    
    sortContacts() {
        this.filteredContacts.sort((a, b) => {
            let valueA, valueB;
            
            switch (this.currentSort) {
                case 'name':
                    valueA = (a.name || '').toLowerCase();
                    valueB = (b.name || '').toLowerCase();
                    break;
                case 'company':
                    valueA = (a.company || '').toLowerCase();
                    valueB = (b.company || '').toLowerCase();
                    break;
                case 'position':
                    valueA = (a.position || '').toLowerCase();
                    valueB = (b.position || '').toLowerCase();
                    break;
                case 'industry':
                    valueA = (a.industry || '').toLowerCase();
                    valueB = (b.industry || '').toLowerCase();
                    break;
                case 'location':
                    valueA = (a.location || '').toLowerCase();
                    valueB = (b.location || '').toLowerCase();
                    break;
                case 'priority':
                    const priorityOrder = { 'High Priority': 3, 'Medium Priority': 2, 'Low Priority': 1 };
                    valueA = priorityOrder[a.priority] || 0;
                    valueB = priorityOrder[b.priority] || 0;
                    return this.currentSortDirection === 'asc' ? valueA - valueB : valueB - valueA;
                case 'status':
                    valueA = (a.status || '').toLowerCase();
                    valueB = (b.status || '').toLowerCase();
                    break;
                default:
                    valueA = (a.name || '').toLowerCase();
                    valueB = (b.name || '').toLowerCase();
            }
            
            if (this.currentSort === 'priority') {
                return this.currentSortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            }
            
            const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            return this.currentSortDirection === 'asc' ? comparison : -comparison;
        });
    }
    

    

    
    updateStats() {
        const totalContacts = this.contacts.length;
        const filteredContacts = this.filteredContacts.length;
        
        console.log('Updating stats:', { totalContacts, filteredContacts });
        
        if (this.elements.contactCount) {
            this.elements.contactCount.textContent = `${totalContacts} contact${totalContacts !== 1 ? 's' : ''}`;
        }
        
        if (this.elements.filteredCount) {
            if (filteredContacts !== totalContacts) {
                this.elements.filteredCount.textContent = `${filteredContacts} filtered`;
                this.elements.filteredCount.classList.remove('hidden');
            } else {
                this.elements.filteredCount.classList.add('hidden');
            }
        }
    }
    
    updateView() {
        // Use requestAnimationFrame to avoid blocking the UI
        requestAnimationFrame(() => {
            // Show appropriate view
            if (this.currentView === 'table') {
                if (this.elements.tableView) {
                    this.elements.tableView.classList.remove('hidden');
                }
                if (this.elements.cardView) {
                    this.elements.cardView.classList.add('hidden');
                }
                this.renderTableView();
                this.hidePagination();
                // Reset table pagination when switching to table view
                this.tableCurrentPage = 1;
            } else {
                if (this.elements.tableView) {
                    this.elements.tableView.classList.add('hidden');
                }
                if (this.elements.cardView) {
                    this.elements.cardView.classList.remove('hidden');
                }
                this.renderCardView();
                this.showPagination();
            }
        });
    }
    
    renderTableView() {
        const tbody = this.elements.contactsTableBody;
        if (!tbody) {
            console.warn('Table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        // Calculate pagination for table view
        const startIndex = (this.tableCurrentPage - 1) * this.tableRecordsPerPage;
        const endIndex = startIndex + this.tableRecordsPerPage;
        const pageContacts = this.filteredContacts.slice(startIndex, endIndex);
        
        // Render only the contacts for the current page
        pageContacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="contact-id">${contact.id}</td>
                <td>
                    ${contact.linkedin ? `<a href="${contact.linkedin}" target="_blank" class="linkedin-icon" title="Open LinkedIn Profile">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>` : '<span class="no-linkedin">—</span>'}
                </td>
                <td>
                    <div class="contact-name clickable" onclick="contactsManager.viewContact(${contact.id})" title="Click to view contact details">
                        ${contact.favorite ? '★ ' : ''}${this.escapeHtml(contact.name || '')}
                    </div>
                </td>
                <td>${this.truncateText(this.escapeHtml(contact.company || ''), 30)}</td>
                <td>${this.truncateText(this.escapeHtml(contact.position || ''), 25)}</td>
                <td>${this.truncateText(this.escapeHtml(contact.industry || ''), 25) || '—'}</td>
                <td>${this.truncateText(this.escapeHtml(contact.location || ''), 20) || '—'}</td>
                <td>
                    <div class="priority-bars" data-contact-id="${contact.id}" data-field="priority" data-original-value="${contact.priority || ''}" title="Click to set priority">
                        <div class="priority-bar priority-bar--high ${contact.priority === 'High Priority' ? 'active' : ''}" data-value="High Priority" title="High Priority"></div>
                        <div class="priority-bar priority-bar--medium ${contact.priority === 'Medium Priority' ? 'active' : ''}" data-value="Medium Priority" title="Medium Priority"></div>
                        <div class="priority-bar priority-bar--low ${contact.priority === 'Low Priority' ? 'active' : ''}" data-value="Low Priority" title="Low Priority"></div>
                    </div>
                </td>
                <td>
                    <select class="inline-edit status-edit" data-field="status" data-contact-id="${contact.id}" data-original-value="${contact.status || ''}">
                        <option value="">No Status</option>
                        <option value="Contact ASAP" ${contact.status === 'Contact ASAP' ? 'selected' : ''}>Contact ASAP</option>
                        <option value="Contact" ${contact.status === 'Contact' ? 'selected' : ''}>Contact</option>
                        <option value="Contacted/Answered" ${contact.status === 'Contacted/Answered' ? 'selected' : ''}>Contacted/Answered</option>
                        <option value="Contacted/No Answer" ${contact.status === 'Contacted/No Answer' ? 'selected' : ''}>Contacted/No Answer</option>
                        <option value="Contacted/My Turn" ${contact.status === 'Contacted/My Turn' ? 'selected' : ''}>Contacted/My Turn</option>
                    </select>
                </td>
                <td>
                    <select class="inline-edit relationship-edit" data-field="relationship" data-contact-id="${contact.id}" data-original-value="${contact.relationship || ''}">
                        <option value="">No Relationship</option>
                        <option value="Good friend" ${contact.relationship === 'Good friend' ? 'selected' : ''}>Good friend</option>
                        <option value="Acquainted" ${contact.relationship === 'Acquainted' ? 'selected' : ''}>Acquainted</option>
                        <option value="None" ${contact.relationship === 'None' ? 'selected' : ''}>None</option>
                        <option value="No idea" ${contact.relationship === 'No idea' ? 'selected' : ''}>No idea</option>
                    </select>
                </td>
                <td class="contact-actions">
                    <button onclick="contactsManager.toggleFavorite(${contact.id})" aria-label="${contact.favorite ? 'Remove from favorites' : 'Add to favorites'}" title="${contact.favorite ? 'Remove from favorites' : 'Add to favorites'}" class="favorite-btn ${contact.favorite ? 'favorite' : ''}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="${contact.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </button>
                    ${contact.email ? `<button onclick="contactsManager.sendEmail('${contact.email}')" aria-label="Send email" title="Send email">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </button>` : ''}
                    <button onclick="contactsManager.editContact(${contact.id})" aria-label="Edit contact" title="Edit">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 1 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button onclick="contactsManager.deleteContact(${contact.id})" aria-label="Delete contact" title="Delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2,2V6"></path>
                        </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Update table pagination
        this.updateTablePagination();
        
        // Show/hide table pagination based on number of contacts
        if (this.filteredContacts.length > this.tableRecordsPerPage) {
            this.showTablePagination();
        } else {
            this.hideTablePagination();
        }
    }
    
    renderCardView() {
        const container = this.elements.contactsCardsContainer;
        container.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.contactsPerPage;
        const endIndex = startIndex + this.contactsPerPage;
        const pageContacts = this.filteredContacts.slice(startIndex, endIndex);
        
        pageContacts.forEach(contact => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <div class="contact-card__header">
                    <div class="contact-card__header-main">
                        <div class="contact-card__name clickable" onclick="contactsManager.viewContact(${contact.id})" title="Click to view contact details">${this.escapeHtml(contact.name || '')}</div>
                        <div class="contact-card__company">${this.escapeHtml(contact.company || '')}</div>
                        <div class="contact-card__position">${this.escapeHtml(contact.position || '')}</div>
                    </div>
                    <div class="contact-card__header-icons">
                        <div class="contact-card__favorite ${contact.favorite ? 'active' : ''}" onclick="contactsManager.toggleFavorite(${contact.id})" title="${contact.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                            ${contact.favorite ? '★' : '☆'}
                        </div>
                        ${contact.linkedin ? `<a href="${contact.linkedin}" target="_blank" class="contact-card__linkedin" title="LinkedIn Profile">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>` : ''}
                        ${contact.email ? `<a href="mailto:${contact.email}" class="contact-card__email" title="Send email">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </a>` : ''}
                    </div>
                </div>
                
                <div class="contact-card__body">
                    ${contact.industry ? `<div class="contact-card__field">
                        <span class="contact-card__field-label">Industry:</span>
                        <span class="contact-card__field-value">${this.escapeHtml(contact.industry)}</span>
                    </div>` : ''}
                    ${contact.location ? `<div class="contact-card__field">
                        <span class="contact-card__field-label">Location:</span>
                        <span class="contact-card__field-value">${this.escapeHtml(contact.location)}</span>
                    </div>` : ''}
                    ${contact.priority ? `<div class="contact-card__field">
                        <span class="contact-card__field-label">Priority:</span>
                        <span class="contact-card__field-value">
                            <span class="status-badge status-badge--${this.getPriorityClass(contact.priority)}">${this.escapeHtml(contact.priority)}</span>
                        </span>
                    </div>` : ''}
                    ${contact.status ? `<div class="contact-card__field">
                        <span class="contact-card__field-label">Status:</span>
                        <span class="contact-card__field-value">
                            <span class="status-badge status-badge--${this.getStatusClass(contact.status)}">${this.escapeHtml(contact.status)}</span>
                        </span>
                    </div>` : ''}
                </div>
                
                <div class="contact-card__actions">
                    ${contact.email ? `<button class="btn btn--outline btn--sm" onclick="contactsManager.sendEmail('${contact.email}')" title="Send email">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email
                    </button>` : ''}
                    <button class="btn btn--outline btn--sm" onclick="contactsManager.editContact(${contact.id})">Edit</button>
                    <button class="btn btn--outline btn--sm" onclick="contactsManager.deleteContact(${contact.id})">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    showPagination() {
        if (!this.elements.paginationContainer) return;
        
        const totalPages = Math.ceil(this.filteredContacts.length / this.contactsPerPage);
        if (totalPages <= 1) {
            this.hidePagination();
            return;
        }
        
        this.elements.paginationContainer.classList.remove('hidden');
        
        // Update page info
        const startContact = (this.currentPage - 1) * this.contactsPerPage + 1;
        const endContact = Math.min(this.currentPage * this.contactsPerPage, this.filteredContacts.length);
        this.elements.pageInfo.textContent = `Showing ${startContact}-${endContact} of ${this.filteredContacts.length} contacts`;
        
        // Update button states
        this.elements.prevPageBtn.disabled = this.currentPage === 1;
        this.elements.nextPageBtn.disabled = this.currentPage === totalPages;
        
        // Add event listeners
        this.elements.prevPageBtn.onclick = () => this.goToPage(this.currentPage - 1);
        this.elements.nextPageBtn.onclick = () => this.goToPage(this.currentPage + 1);
    }
    

    
    hidePagination() {
        if (this.elements.paginationContainer) {
            this.elements.paginationContainer.classList.add('hidden');
        }
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredContacts.length / this.contactsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderCardView();
        this.showPagination();
    }
    
    // Table pagination functions
    goToTablePage(page) {
        if (page < 1 || page > this.getTableTotalPages()) return;
        
        this.tableCurrentPage = page;
        this.renderTableView();
        this.updateTablePagination();
    }
    
    updateTablePagination() {
        const totalPages = this.getTableTotalPages();
        const pageInfo = this.elements.tablePageInfo;
        const prevBtn = this.elements.tablePrevPageBtn;
        const nextBtn = this.elements.tableNextPageBtn;
        
        if (pageInfo) pageInfo.textContent = `Page ${this.tableCurrentPage} of ${totalPages}`;
        if (prevBtn) prevBtn.disabled = this.tableCurrentPage === 1;
        prevBtn.disabled = this.tableCurrentPage === 1;
        if (nextBtn) nextBtn.disabled = this.tableCurrentPage === totalPages;
    }
    
    showTablePagination() {
        if (this.elements.tablePaginationContainer) {
            this.elements.tablePaginationContainer.classList.remove('hidden');
        }
    }
    
    hideTablePagination() {
        if (this.elements.tablePaginationContainer) {
            this.elements.tablePaginationContainer.classList.add('hidden');
        }
    }
    
    getTableTotalPages() {
        return Math.ceil(this.filteredContacts.length / this.tableRecordsPerPage);
    }
    
    handleTableRecordsPerPageChange() {
        this.tableRecordsPerPage = parseInt(this.elements.tableRecordsPerPage.value);
        this.tableCurrentPage = 1; // Reset to first page
        this.renderTableView();
        this.updateTablePagination();
    }
    
    handleViewToggle(e) {
        const view = e.target.closest('[data-view]').dataset.view;
        this.currentView = view;
        
        // Update active button
        this.elements.viewToggleBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Reset pagination when switching views
        this.currentPage = 1;
        
        this.updateView();
    }
    
    handleSelectAll(e) {
        const checkboxes = document.querySelectorAll('input[data-contact-id]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    }
    
    openAddContactModal() {
        this.editingContactId = null;
        this.elements.modalTitle.textContent = 'Add Contact';
        this.resetContactForm();
        this.showModal();
    }
    
    editContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact) return;
        
        this.editingContactId = id;
        this.elements.modalTitle.textContent = 'Edit Contact';
        this.populateContactForm(contact);
        
        // Ensure all form fields are enabled for editing
        const formFields = this.elements.contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.disabled = false;
        });
        
        this.showModal();
    }
    
    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.saveContacts();
            this.applyFilters();
            this.showToast('Contact deleted successfully', 'success');
        }
    }
    
    showModal() {
        this.elements.contactModal.classList.remove('hidden');
        this.elements.contactModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Reset save button to visible
        this.elements.saveBtn.style.display = 'inline-flex';
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('contactName').focus();
        }, 100);
    }
    
    closeModal() {
        this.elements.contactModal.classList.add('hidden');
        this.elements.contactModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.resetContactForm();
    }
    
    resetContactForm() {
        const form = this.elements.contactForm;
        form.reset();
        this.clearFormErrors();
        
        // Enable all form fields
        const formFields = form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.disabled = false;
        });
        
        // Reset to first tab
        const tabButtons = document.querySelectorAll('.modal__tab');
        const tabContents = document.querySelectorAll('.modal__tab-content');
        
        if (tabButtons.length > 0 && tabContents.length > 0) {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            tabButtons[0].classList.add('active');
            tabContents[0].classList.add('active');
        }
    }
    
    populateContactForm(contact) {
        document.getElementById('contactName').value = contact.name || '';
        document.getElementById('contactEmail').value = contact.email || '';
        document.getElementById('contactCompany').value = contact.company || '';
        document.getElementById('contactPosition').value = contact.position || '';
        document.getElementById('contactIndustry').value = contact.industry || '';
        document.getElementById('contactLocation').value = contact.location || '';
        document.getElementById('contactCity').value = contact.city || '';
        document.getElementById('contactLinkedin').value = contact.linkedin || '';
        document.getElementById('contactPriority').value = contact.priority || '';
        document.getElementById('contactStatus').value = contact.status || '';
        document.getElementById('contactRelationship').value = contact.relationship || '';
        document.getElementById('contactOther').value = contact.otherContact || '';
        document.getElementById('contactSkills').value = contact.skills || '';
        document.getElementById('contactInterests').value = contact.interests || '';
        document.getElementById('contactNotes').value = contact.notes || '';
        document.getElementById('contactFavorite').checked = contact.favorite || false;
    }
    
    handleContactSubmit(e) {
        e.preventDefault();
        
        if (!this.validateContactForm()) {
            return;
        }
        
        const formData = new FormData(e.target);
        const contact = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            company: document.getElementById('contactCompany').value.trim(),
            position: document.getElementById('contactPosition').value.trim(),
            industry: document.getElementById('contactIndustry').value,
            location: document.getElementById('contactLocation').value,
            city: document.getElementById('contactCity').value.trim(),
            linkedin: document.getElementById('contactLinkedin').value.trim(),
            priority: document.getElementById('contactPriority').value,
            status: document.getElementById('contactStatus').value,
            relationship: document.getElementById('contactRelationship').value,
            otherContact: document.getElementById('contactOther').value.trim(),
            skills: document.getElementById('contactSkills').value.trim(),
            interests: document.getElementById('contactInterests').value.trim(),
            notes: document.getElementById('contactNotes').value.trim(),
            favorite: document.getElementById('contactFavorite').checked
        };
        
        if (this.editingContactId) {
            // Edit existing contact
            const index = this.contacts.findIndex(c => c.id === this.editingContactId);
            if (index !== -1) {
                this.contacts[index] = { ...this.contacts[index], ...contact };
                this.showToast('Contact updated successfully', 'success');
            }
        } else {
            // Add new contact
            contact.id = this.generateId();
            this.contacts.push(contact);
            this.showToast('Contact added successfully', 'success');
        }
        
        this.saveContacts();
        this.applyFilters();
        this.closeModal();
    }
    
    validateContactForm() {
        this.clearFormErrors();
        let isValid = true;
        
        // Name validation
        const name = document.getElementById('contactName').value.trim();
        if (!name) {
            this.showFieldError('contactName', 'nameError', 'Name is required');
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('contactEmail').value.trim();
        if (email && !this.isValidEmail(email)) {
            this.showFieldError('contactEmail', 'emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFieldError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(errorId);
        
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    clearFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        const errorFields = document.querySelectorAll('.form-control.error');
        
        errorElements.forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
        
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }
    
    clearAllFilters() {
        // Clear search timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
        
        this.elements.globalSearch.value = '';
        this.elements.favoritesFilter.classList.remove('active');
        this.showingFavoritesOnly = false;
        
        this.applyFilters();
    }
    
    // CSV Import/Export functionality
    openImportModal() {
        this.elements.importModal.classList.remove('hidden');
        this.elements.importModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    closeImportModal() {
        this.elements.importModal.classList.add('hidden');
        this.elements.importModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.elements.csvFileInput.value = '';
        this.elements.confirmImportBtn.disabled = true;
        this.elements.confirmImportBtn.textContent = 'Import Contacts';
        
        // Clear CSV data
        this.csvData = null;
        
        console.log('Import modal closed and reset');
    }
    
    handleFileSelect(e) {
        console.log('=== FILE SELECT EVENT TRIGGERED ===');
        console.log('confirmImportBtn element:', this.elements.confirmImportBtn);
        console.log('confirmImportBtn disabled state:', this.elements.confirmImportBtn?.disabled);
        
        const file = e.target.files[0];
        console.log('=== FILE SELECTED ===');
        console.log('File:', file);
        console.log('File type:', file?.type);
        console.log('File name:', file?.name);
        console.log('File size:', file?.size);
        
        if (!file) {
            console.log('No file selected');
            this.elements.confirmImportBtn.disabled = true;
            return;
        }
        
        // Check if file is CSV by extension or MIME type
        // Firefox may not recognize CSV MIME type correctly, so we'll be more lenient
        const isCSV = file.type === 'text/csv' || 
                     file.name.toLowerCase().endsWith('.csv') ||
                     file.type === 'application/vnd.ms-excel' ||
                     file.type === 'text/plain' ||
                     file.type === 'application/csv' ||
                     file.type === 'text/comma-separated-values' ||
                     file.type === 'application/octet-stream'; // Fallback for Firefox
        
        console.log('Is CSV file:', isCSV);
        console.log('File MIME type:', file.type);
        console.log('File extension:', file.name.toLowerCase().split('.').pop());
        
        if (isCSV || file.name.toLowerCase().endsWith('.csv')) {
            console.log('Valid CSV file selected, enabling import button');
            console.log('Before enabling - disabled state:', this.elements.confirmImportBtn.disabled);
            this.elements.confirmImportBtn.disabled = false;
            console.log('After enabling - disabled state:', this.elements.confirmImportBtn.disabled);
            this.elements.confirmImportBtn.textContent = 'Import Contacts';
            // Store the file for later processing
            this.selectedFile = file;
            this.showToast('CSV file selected. Choose import options and click Import Contacts.', 'success');
        } else {
            console.log('File is not CSV, showing error');
            this.showToast('Please select a valid CSV file', 'error');
            // Reset file input
            this.elements.csvFileInput.value = '';
            this.elements.confirmImportBtn.disabled = true;
            this.selectedFile = null;
        }
        
        console.log('=== FILE SELECT HANDLING COMPLETE ===');
    }
    
    // Old parseCSVFile function removed - now using parseCSVFileForImport
    
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] === ',')) {
                inQuotes = true;
            } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
    
    // Old displayImportPreview function removed - preview functionality removed
    
    // Log function for debugging CSV import
    logCSVMapping(row, headers) {
        console.log('CSV Row Mapping:', {
            headers: headers,
            row: row,
            mappedFields: {
                name: row[headers.indexOf('Name')] || 'N/A',
                linkedin: row[headers.indexOf('Linkedin')] || 'N/A',
                company: row[headers.indexOf('Company')] || 'N/A',
                position: row[headers.indexOf('Current position')] || 'N/A',
                industry: row[headers.indexOf('Industry')] || 'N/A',
                location: row[headers.indexOf('Location')] || 'N/A',
                city: row[headers.indexOf('City')] || 'N/A',
                skills: row[headers.indexOf('Skills')] || 'N/A',
                interests: row[headers.indexOf('Interests')] || 'N/A',
                email: row[headers.indexOf('Contact info (email)')] || 'N/A',
                otherContact: row[headers.indexOf('Contact info (other)')] || 'N/A',
                favorite: row[headers.indexOf('Favorite')] || 'N/A',
                priority: row[headers.indexOf('Priority')] || 'N/A',
                status: row[headers.indexOf('Status')] || 'N/A',
                relationship: row[headers.indexOf('Relationship')] || 'N/A',
                connectedOn: row[headers.indexOf('Connected On')] || 'N/A'
            }
        });
    }
    
    confirmImport() {
        if (!this.selectedFile) {
            this.showToast('Please select a CSV file first', 'error');
            return;
        }
        
        console.log('=== CONFIRMING IMPORT ===');
        
        // Process the CSV file now
        this.parseCSVFileForImport(this.selectedFile);
    }
    
    parseCSVFileForImport(file) {
        console.log('=== PARSING CSV FILE FOR IMPORT ===');
        
        // Get selected import mode
        const importMode = document.querySelector('input[name="importMode"]:checked')?.value || 'add';
        console.log('Selected import mode:', importMode);
        
        // Disable import button while processing
        this.elements.confirmImportBtn.disabled = true;
        this.elements.confirmImportBtn.textContent = 'Processing...';
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            console.log('=== FILE READ SUCCESSFULLY ===');
            const csv = e.target.result;
            console.log('CSV content length:', csv.length);
            
            try {
                const lines = csv.split('\n').filter(line => line.trim());
                console.log('Total lines:', lines.length);
                
                if (lines.length < 2) {
                    console.log('CSV file too short, showing error');
                    this.showToast('CSV file must have at least a header and one data row', 'error');
                    this.elements.confirmImportBtn.disabled = false;
                    this.elements.confirmImportBtn.textContent = 'Import Contacts';
                    return;
                }
                
                const headers = this.parseCSVLine(lines[0]);
                console.log('Parsed headers:', headers);
                
                // Validate that we have at least the Name column
                if (!headers.includes('Name')) {
                    console.log('CSV missing Name column, showing error');
                    this.showToast('CSV file must have a "Name" column', 'error');
                    this.elements.confirmImportBtn.disabled = false;
                    this.elements.confirmImportBtn.textContent = 'Import Contacts';
                    return;
                }
                
                const rows = lines.slice(1).map(line => this.parseCSVLine(line));
                console.log('Parsed', rows.length, 'data rows');
                
                // Process the import
                this.processImport(headers, rows, importMode);
                
            } catch (error) {
                console.error('Error parsing CSV:', error);
                this.showToast('Error parsing CSV file: ' + error.message, 'error');
                this.elements.confirmImportBtn.disabled = false;
                this.elements.confirmImportBtn.textContent = 'Import Contacts';
            }
        };
        
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            this.showToast('Error reading CSV file', 'error');
            this.elements.confirmImportBtn.disabled = false;
            this.elements.confirmImportBtn.textContent = 'Import Contacts';
        };
        
        console.log('Starting to read file...');
        reader.readAsText(file);
    }
    
    processImport(headers, rows, importMode) {
        console.log('=== PROCESSING IMPORT ===');
        
        const importedContacts = [];
        const duplicateContacts = [];
        const updatedContacts = [];
        
        console.log('Processing', rows.length, 'rows from CSV');
        console.log('Current contacts in app:', this.contacts.length);
        
        // Create a map of existing contacts for faster lookup
        const existingContactsMap = new Map();
        this.contacts.forEach(contact => {
            const key = contact.name.toLowerCase().trim();
            if (key) {
                existingContactsMap.set(key, contact);
            }
            // Also index by LinkedIn URL if available
            if (contact.linkedin && contact.linkedin.trim()) {
                const linkedinKey = contact.linkedin.toLowerCase().trim();
                existingContactsMap.set(linkedinKey, contact);
            }
        });
        
        rows.forEach((row, index) => {
            // Log the mapping for debugging
            this.logCSVMapping(row, headers);
            
            const contact = {
                id: this.generateId() + importedContacts.length,
                name: row[headers.indexOf('Name')] || '',
                linkedin: row[headers.indexOf('Linkedin')] || '',
                company: row[headers.indexOf('Company')] || '',
                position: row[headers.indexOf('Current position')] || '',
                industry: row[headers.indexOf('Industry')] || '',
                location: row[headers.indexOf('Location')] || '',
                city: row[headers.indexOf('City')] || '',
                skills: row[headers.indexOf('Skills')] || '',
                interests: row[headers.indexOf('Interests')] || '',
                email: row[headers.indexOf('Contact info (email)')] || '',
                otherContact: row[headers.indexOf('Contact info (other)')] || '',
                favorite: row[headers.indexOf('Favorite')] === 'Yes' || row[headers.indexOf('Favorite')] === 'true' || false,
                priority: row[headers.indexOf('Priority')] || 'Medium Priority',
                status: row[headers.indexOf('Status')] || 'Contact',
                relationship: row[headers.indexOf('Relationship')] || 'Professional',
                notes: row[headers.indexOf('Notes')] || ''
            };
            
            // Only process contacts with at least a name
            if (contact.name.trim()) {
                const contactNameKey = contact.name.toLowerCase().trim();
                const contactLinkedinKey = contact.linkedin ? contact.linkedin.toLowerCase().trim() : '';
                
                // Find existing contact with same name or LinkedIn
                let existingContact = null;
                let existingContactIndex = -1;
                
                // Check by name first
                if (existingContactsMap.has(contactNameKey)) {
                    existingContact = existingContactsMap.get(contactNameKey);
                    existingContactIndex = this.contacts.findIndex(c => c.id === existingContact.id);
                }
                // Check by LinkedIn if name not found
                else if (contactLinkedinKey && existingContactsMap.has(contactLinkedinKey)) {
                    existingContact = existingContactsMap.get(contactLinkedinKey);
                    existingContactIndex = this.contacts.findIndex(c => c.id === existingContact.id);
                }
                
                if (existingContactIndex !== -1) {
                    console.log(`Existing contact found: ${contact.name} (ID: ${existingContact.id})`);
                    
                    if (importMode === 'add') {
                        // Skip duplicates
                        duplicateContacts.push(contact);
                        console.log(`Skipping duplicate contact: ${contact.name}`);
                    } else if (importMode === 'replace') {
                        // Replace existing contact
                        this.contacts[existingContactIndex] = { ...contact, id: existingContact.id };
                        updatedContacts.push(contact);
                        console.log(`Replacing existing contact: ${contact.name}`);
                    } else if (importMode === 'merge') {
                        // Merge and update existing contact
                        const existingContact = this.contacts[existingContactIndex];
                        const mergedContact = { ...existingContact, ...contact };
                        mergedContact.id = existingContact.id; // Preserve original ID
                        this.contacts[existingContactIndex] = mergedContact;
                        updatedContacts.push(mergedContact);
                        console.log(`Merging existing contact: ${contact.name}`);
                    }
                } else {
                    console.log(`Adding new contact: ${contact.name}`);
                    importedContacts.push(contact);
                }
            }
        });
        
        console.log(`Found ${duplicateContacts.length} duplicate contacts`);
        console.log(`Adding ${importedContacts.length} new contacts`);
        console.log(`Updating ${updatedContacts.length} existing contacts`);
        
        if (importMode === 'replace') {
            // Replace all contacts - clear existing ones first
            console.log('Replace mode selected, clearing existing contacts');
            this.clearContactsBeforeImport();
            this.contacts = [...importedContacts, ...updatedContacts];
            console.log('Replaced all existing contacts');
        } else {
            // Add new contacts and update existing ones
            if (importMode === 'merge') {
                this.contacts.push(...importedContacts);
                console.log('Merged with existing contacts');
            } else {
                // Add only new contacts
                this.contacts.push(...importedContacts);
                console.log('Added only new contacts');
            }
        }
        
        // Update filtered contacts
        this.filteredContacts = [...this.contacts];
        
        // Populate filter options from imported data
        this.populateFiltersFromContacts();
        
        this.saveContacts();
        
        // Reset filters to show all contacts after import
        this.resetFiltersAfterImport();
        
        this.updateStats();
        this.updateView();
        this.closeImportModal();
        
        // Create appropriate success message
        let message = '';
        if (importMode === 'replace') {
            message = `Successfully replaced all contacts with ${this.contacts.length} contacts from CSV`;
        } else if (importMode === 'merge') {
            message = `Successfully imported ${importedContacts.length} new contacts and updated ${updatedContacts.length} existing contacts`;
        } else {
            message = `Successfully imported ${importedContacts.length} new contacts`;
            if (duplicateContacts.length > 0) {
                message += ` (${duplicateContacts.length} duplicates skipped)`;
            }
        }
        
        this.showToast(message, 'success');
        
        console.log('=== IMPORT COMPLETE ===');
    }
    
    populateFiltersFromContacts() {
        if (this.contacts.length === 0) return;
        
        console.log('=== POPULATING FILTERS FROM CONTACTS ===');
        console.log('Total contacts:', this.contacts.length);
        
        // Extract unique values from contacts
        const companies = [...new Set(this.contacts.map(c => c.company).filter(Boolean))].sort();
        const industries = [...new Set(this.contacts.map(c => c.industry).filter(Boolean))].sort();
        const locations = [...new Set(this.contacts.map(c => c.location).filter(Boolean))].sort();
        const cities = [...new Set(this.contacts.map(c => c.city).filter(Boolean))].sort();
        
        console.log('Extracted filter values:', { companies, industries, locations, cities });
        
        // Update appData
        this.appData.companies = companies;
        this.appData.industries = industries;
        this.appData.locations = locations;
        this.appData.cities = cities;
        
        // Update datalists
        this.populateDatalist('companyOptions', companies);
        this.populateDatalist('industryOptions', industries);
        this.populateDatalist('locationOptions', locations);
        this.populateDatalist('cityOptions', cities);
        
        // Repopulate dropdowns to ensure all filters are updated
        this.populateDropdowns();
        
        console.log('Filters populated from contacts:', { companies, industries, locations });
        console.log('=== END POPULATING FILTERS ===');
    }
    
    exportContacts() {
        if (this.contacts.length === 0) {
            this.showToast('No contacts to export', 'warning');
            return;
        }
        
        const headers = [
            'Name', 'Email', 'Company', 'Position', 'Industry', 'Location', 'City',
            'LinkedIn', 'Priority', 'Status', 'Relationship', 'Skills', 'Interests',
            'Other Contact Info', 'Notes', 'Favorite'
        ];
        
        const csvContent = [
            headers.join(','),
            ...this.contacts.map(contact => [
                this.escapeCsvField(contact.name || ''),
                this.escapeCsvField(contact.email || ''),
                this.escapeCsvField(contact.company || ''),
                this.escapeCsvField(contact.position || ''),
                this.escapeCsvField(contact.industry || ''),
                this.escapeCsvField(contact.location || ''),
                this.escapeCsvField(contact.city || ''),
                this.escapeCsvField(contact.linkedin || ''),
                this.escapeCsvField(contact.priority || ''),
                this.escapeCsvField(contact.status || ''),
                this.escapeCsvField(contact.relationship || ''),
                this.escapeCsvField(contact.skills || ''),
                this.escapeCsvField(contact.interests || ''),
                this.escapeCsvField(contact.otherContact || ''),
                this.escapeCsvField(contact.notes || ''),
                contact.favorite ? 'Yes' : 'No'
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `linkedin-contacts-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Contacts exported successfully', 'success');
    }
    
    exportPdf() {
        // Create a new window for PDF generation
        const printWindow = window.open('', '_blank');
        const contacts = this.filteredContacts.length > 0 ? this.filteredContacts : this.contacts;
        
        if (contacts.length === 0) {
            this.showToast('No contacts to export', 'error');
            return;
        }
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>LinkedIn Contacts - PDF Export</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    h1 { color: #333; text-align: center; }
                    .export-info { margin: 20px 0; color: #666; }
                </style>
            </head>
            <body>
                <h1>LinkedIn Contacts</h1>
                <div class="export-info">
                    <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Total Contacts:</strong> ${contacts.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Industry</th>
                            <th>Location</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Email</th>
                            <th>LinkedIn</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contacts.map(contact => `
                            <tr>
                                <td>${contact.name || ''}</td>
                                <td>${contact.company || ''}</td>
                                <td>${contact.position || ''}</td>
                                <td>${contact.industry || ''}</td>
                                <td>${contact.location || ''}</td>
                                <td>${contact.priority || ''}</td>
                                <td>${contact.status || ''}</td>
                                <td>${contact.email || ''}</td>
                                <td>${contact.linkedin || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };
        
        this.showToast('PDF export initiated', 'success');
    }
    
    escapeCsvField(field) {
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
    }
    
    // Event handlers
    handleModalBackdropClick(e) {
        if (e.target.classList.contains('modal__backdrop')) {
            if (this.elements.contactModal.classList.contains('hidden') === false) {
                this.closeModal();
            }
            if (this.elements.importModal.classList.contains('hidden') === false) {
                this.closeImportModal();
            }
        }
        
        if (e.target.classList.contains('modal__close')) {
            this.closeModal();
            this.closeImportModal();
        }
    }
    
    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.closeModal();
            this.closeImportModal();
            this.hideToast();
        }
    }
    
    // Toast notifications
    showToast(message, type = 'info') {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.className = `toast ${type}`;
        this.elements.toast.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }
    
    hideToast() {
        this.elements.toast.classList.add('hidden');
    }
    
    // Utility functions
    escapeHtml(unsafe) {
        if (!unsafe || typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    truncateText(text, maxLength) {
        if (!text || typeof text !== 'string' || text.trim() === '') return '';
        const cleanText = text.trim();
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.substring(0, maxLength) + '...';
    }
    
    getPriorityClass(priority) {
        switch (priority) {
            case 'High Priority': return 'high';
            case 'Medium Priority': return 'medium';
            case 'Low Priority': return 'low';
            default: return 'medium';
        }
    }
    
    getStatusClass(status) {
        switch (status) {
            case 'Contact ASAP': return 'contact-asap';
            case 'Contact': return 'contact';
            case 'Contacted/Answered': return 'answered';
            case 'Contacted/No Answer': return 'no-answer';
            case 'Contacted/My Turn': return 'my-turn';
            default: return 'contact';
        }
    }
    
    getRelationshipClass(relationship) {
        switch (relationship) {
            case 'Good friend': return 'good-friend';
            case 'Acquainted': return 'acquainted';
            case 'None': return 'none';
            case 'No idea': return 'no-idea';
            default: return 'none';
        }
    }
    
    bindInlineEditEvents() {
        // Use event delegation for dynamically created elements
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('inline-edit')) {
                this.handleInlineEdit(e.target);
            }
        });
        
        // Handle priority bar clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('priority-bar')) {
                this.handlePriorityBarClick(e.target);
            }
        });
    }
    
    handleInlineEdit(selectElement) {
        const contactId = parseInt(selectElement.dataset.contactId);
        const field = selectElement.dataset.field;
        const newValue = selectElement.value;
        const originalValue = selectElement.dataset.originalValue;
        
        // Find the contact
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        // Update the contact
        contact[field] = newValue;
        
        // Update the original value for future comparisons
        selectElement.dataset.originalValue = newValue;
        
        // Save to localStorage
        this.saveContacts();
        
        // Show success message
        this.showToast(`${field} updated successfully`, 'success');
        
        // Update stats if needed
        this.updateStats();
    }
    
    handlePriorityBarClick(priorityBar) {
        const priorityBarsContainer = priorityBar.closest('.priority-bars');
        const contactId = parseInt(priorityBarsContainer.dataset.contactId);
        const newValue = priorityBar.dataset.value;
        
        // Find the contact
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        // Update the contact
        contact.priority = newValue;
        
        // Update the original value for future comparisons
        priorityBarsContainer.dataset.originalValue = newValue;
        
        // Update visual state
        priorityBarsContainer.querySelectorAll('.priority-bar').forEach(bar => {
            bar.classList.remove('active');
        });
        priorityBar.classList.add('active');
        
        // Save to localStorage
        this.saveContacts();
        
        // Show success message
        this.showToast(`Priority updated to ${newValue}`, 'success');
        
        // Update stats if needed
        this.updateStats();
    }
    
    viewContact(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        // Populate the modal with contact data
        this.populateContactForm(contact);
        
        // Change modal title
        this.elements.modalTitle.textContent = 'View Contact';
        
        // Disable form fields for view-only mode
        const formFields = this.elements.contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.disabled = true;
        });
        
        // Hide save button, show close button
        this.elements.saveBtn.style.display = 'none';
        
        // Show the modal
        this.showModal();
    }
    
    sendEmail(email) {
        if (email) {
            window.open(`mailto:${email}`, '_blank');
        }
    }
    
    toggleFavorite(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        // Toggle favorite status
        contact.favorite = !contact.favorite;
        
        console.log('Toggled favorite for:', contact.name, 'New favorite status:', contact.favorite);
        
        // Save to localStorage
        this.saveContacts();
        
        // Show success message
        this.showToast(`Contact ${contact.favorite ? 'added to' : 'removed from'} favorites`, 'success');
        
        // Update the view to reflect changes
        this.updateView();
        
        // Update stats if needed
        this.updateStats();
    }
    
    // Debug function to test filters
    debugFilters() {
        console.log('=== FILTER DEBUG ===');
        console.log('Total contacts:', this.contacts.length);
        console.log('Filtered contacts:', this.filteredContacts.length);
        console.log('App data:', this.appData);
        
        // Check favorite contacts
        const favorites = this.contacts.filter(c => c.favorite === true || c.favorite === 'true' || c.favorite === 'Yes');
        console.log('Favorite contacts:', favorites.length);
        favorites.forEach(c => console.log('-', c.name, 'favorite:', c.favorite));
        
        // Check filter elements
        console.log('Filter elements:', {
            priorityFilter: this.elements.priorityFilter?.value,
            statusFilter: this.elements.statusFilter?.value,
            relationshipFilter: this.elements.relationshipFilter?.value,
            companyFilter: this.elements.companyFilter?.value,
            industryFilter: this.elements.industryFilter?.value,
            locationFilter: this.elements.locationFilter?.value,
            cityFilter: this.elements.cityFilter?.value,
            favoritesFilter: this.elements.favoritesFilter?.checked
        });
    }
    
    // Function to clear all existing contacts
    clearAllContacts() {
        console.log('=== CLEARING ALL CONTACTS ===');
        
        // Show confirmation dialog
        if (!confirm('Are you sure you want to clear all contacts? This action cannot be undone.')) {
            console.log('Contact clearing cancelled by user');
            return;
        }
        
        this.contacts = [];
        this.filteredContacts = [];
        
        // Clear filter options
        this.appData.companies = [];
        this.appData.industries = [];
        this.appData.locations = [];
        this.appData.cities = [];
        
        // Reset filters
        this.resetFiltersAfterImport();
        
        // Clear localStorage
        this.saveContacts();
        
        // Update UI
        this.updateStats();
        this.updateView();
        
        // Reset dropdowns
        this.populateDropdowns();
        
        this.showToast('All contacts cleared', 'info');
        console.log('=== ALL CONTACTS CLEARED ===');
    }
    
    // Function to clear contacts before import (for replace mode)
    clearContactsBeforeImport() {
        console.log('=== CLEARING CONTACTS BEFORE IMPORT ===');
        this.contacts = [];
        this.filteredContacts = [];
        
        // Clear filter options
        this.appData.companies = [];
        this.appData.industries = [];
        this.appData.locations = [];
        this.appData.cities = [];
        
        // Reset filters
        this.resetFiltersAfterImport();
        
        // Update UI
        this.updateStats();
        this.updateView();
        
        // Reset dropdowns
        
        console.log('=== CONTACTS CLEARED BEFORE IMPORT ===');
    }
    
    // Function to reset filters after import
    resetFiltersAfterImport() {
        console.log('=== RESETTING FILTERS AFTER IMPORT ===');
        
        // Clear all filter values
        if (this.elements.globalSearch) this.elements.globalSearch.value = '';
        if (this.elements.priorityFilter) this.elements.priorityFilter.value = '';
        if (this.elements.statusFilter) this.elements.statusFilter.value = '';
        if (this.elements.relationshipFilter) this.elements.relationshipFilter.value = '';
        if (this.elements.companyFilter) this.elements.companyFilter.value = '';
        if (this.elements.industryFilter) this.elements.industryFilter.value = '';
        if (this.elements.locationFilter) this.elements.locationFilter.value = '';
        if (this.elements.cityFilter) this.elements.cityFilter.value = '';
        if (this.elements.favoritesFilter) this.elements.favoritesFilter.checked = false;
        
        // Reset filtered contacts to show all
        this.filteredContacts = [...this.contacts];
        
        // Reset pagination
        this.currentPage = 1;
        this.tableCurrentPage = 1;
        
        // Force update of view and stats
        this.updateStats();
        this.updateView();
        
        console.log('=== FILTERS RESET ===');
        console.log('Total contacts:', this.contacts.length);
        console.log('Filtered contacts:', this.filteredContacts.length);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactsManager = new ContactsManager();
});