# Report Template

HLS (Hurwitz Law Group) Report Template - A structured HTML report template with dynamic navigation and PDF export capabilities.

## Project Structure

```
Report/
|-- index.html           # Landing page with export button
|-- pages/              # Individual HTML chapters
|-- assets/             # Static assets
|   |-- images/         # Logos, screenshots, content visuals
|   |-- css/            # Shared stylesheets
|   |-- js/             # Browser scripts (pdf-export.js, nav, etc.)
|   `-- data/           # Data and reference files
|-- partials/           # Reusable HTML snippets
|-- archive/            # Old/temporary files
|-- server.js           # Express/Puppeteer/pdf-lib exporter
|-- package.json        # npm scripts and dependencies
`-- README.md
```


## Features

- Dynamic sidebar navigation loaded via JavaScript
- Common CSS stylesheet for consistent styling
- Single or multi-page PDF export (sidebar automatically hidden, screenshot-fitted to one page)
- Organized asset structure
- Google Sheets integration support

## Development Guidelines

### Changelog Updates
- Always update `CHANGELOG.md` when making changes
- Include the "Requested" section documenting what was asked for
- Document both the request and the implementation
- Follow the format specified in `CHANGELOG.md`

### Project Rules
- See `.cursorrules` for Cursor AI project-specific instructions
- Follow the folder structure guidelines
- Use relative paths from the `pages/` directory

## Documentation

- `CHANGELOG.md` - Complete history of all changes with timestamps
- `PROJECT_STRUCTURE_RECOMMENDATIONS.md` - Original structure recommendations
- `IMPLEMENTATION_COMPLETE.md` - Implementation guide and next steps
- `assets/data/google-sheets/README.md` - Google Sheets documentation template

## Getting Started

### Basic Usage

1. Start the local server with `npm start`, then open `http://localhost:3000/index.html`
2. Use the landing page links to jump into any `pages/pageX.html` chapter
3. While viewing the desired chapter (e.g., `pages/page1.html`), click **Export to PDF** to download a single-page PDF without the sidebar, or use the landing-page shortcuts to export page 1 or pages 1 + 2 together

### PDF Export Setup

The project includes a **Node.js server** for professional-quality PDF export using Puppeteer (headless Chrome).

**First Time Setup:**

1. **Install Node.js dependencies** (one-time only):
   ```bash
   npm install
   ```
   This installs Express, Puppeteer, pdf-lib, and CORS. Puppeteer will download Chromium (~200MB).

2. **Start the PDF export server**:
   ```bash
   npm start
   ```
   Server runs at: `http://localhost:3000`

3. **Access pages through the server**:
   Open `http://localhost:3000/index.html` for quick links (or jump directly to `http://localhost:3000/pages/page1.html`)

4. **Export to PDF**:
   Open the specific chapter you want (start with `page1.html` if unsure) and click the "Export to PDF" button; use the new "Export Pages 1 + 2" shortcut on `index.html` (or pass `?pages=page1.html,page2.html`) to combine multiple chapters in a single download. Each chapter is screenshot-captured (without the sidebar) and scaled to fit exactly one A4 PDF page.

**What Gets Exported:**
- One or more HTML files per request (default: `page1.html`; custom via `?page=...` or `?pages=page1.html,page2.html`)
- Content is rendered in Chrome, the `.main-content` section is screenshot-captured, and that image is scaled to a single A4 PDF page
- Sidebar/navigation is removed so the PDF mirrors the report body
- Consistent white background with 0.5" margins around each screenshot

Need a different page combo? Call `http://localhost:3000/api/generate-pdf?page=page7.html` for singles or `http://localhost:3000/api/generate-pdf?pages=page1.html,page2.html` for multi-page output (or use the in-page buttons while viewing those chapters).

**Troubleshooting:**
- Error "Server not running"? → Run `npm start` first
- First install fails? → Ensure Node.js is installed (`node --version`)
- PDF timeout? → Report is large, wait up to 2 minutes

## Notes

- Logo files should be stored in `assets/images/logos/`
- Reference screenshots go in `assets/images/screenshots/`
- Google Sheets documentation should be updated in `assets/data/google-sheets/README.md`
