# LinkedIn Contacts Manager

A professional contacts management dashboard for LinkedIn networking with advanced filtering, search, and export capabilities.

## Features

- 📊 **Comprehensive Contact Management** - Store and organize LinkedIn contacts with detailed information
- 🔍 **Advanced Search & Filtering** - Search across multiple fields with dynamic filters
- 📱 **Responsive Design** - Optimized for MacBook and iPad viewing
- 🌙 **Theme Support** - Light, Dark, and System theme options
- 📋 **Multiple Views** - Table and Card view options
- 📤 **Import/Export** - CSV import/export and PDF export functionality
- ⭐ **Favorites & Priority** - Mark favorites and set priority levels
- 💾 **Local Storage** - All data persisted locally in browser

## Deployment

### Netlify Deployment

1. Build the static export:
   \`\`\`bash
   npm run build
   \`\`\`

2. Upload the `out` folder to Netlify or connect your repository for automatic deployment.

### Manual Deployment

The application is configured for static export. After running `npm run build`, deploy the contents of the `out` directory to any static hosting service.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Next.js 15** - React framework with static export
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Roboto Condensed** - Typography
- **Lucide React** - Icons
- **jsPDF** - PDF export functionality
- **Local Storage** - Data persistence
\`\`\`

I've configured the Next.js application for static export to Netlify by adding the necessary export configuration, creating a fallback index.html file, and updating the package.json with build scripts. The app will now generate static files in the `out` directory that can be deployed to Netlify or any static hosting service.
