# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2025-11-08] - Removed Wins Icon

### Requested
- User requested: "<h1>Wins 🎉</h1> remove the icon"
  - Context: Remove emoji icon from Wins header on page4
  - Reason: Keep heading text plain without emoji
  - Branch name: `hotfix/remove-wins-icon`

### Changed
- Updated `pages/page4.html` Wins header to display "Wins" without emoji

---

## [2025-11-08] - Changed Executive Summary to Scope

### Requested
- User requested: "create a plan for create a branch in github for editing executive summary text on sidebar then once created edit sidebar of all 18pages change the text Executive Summary to Scope"
  - Context: Update navigation label in sidebar across all pages
  - Reason: Rebrand "Executive Summary" navigation item to "Scope"
  - Branch name: `design/executive-summary-to-scope`

### Changed
- Updated sidebar navigation text from "Executive Summary" to "Scope" in all 18 pages:
  - `pages/page1.html`
  - `pages/page2.html`
  - `pages/page3.html`
  - `pages/page4.html`
  - `pages/page5.html`
  - `pages/page6.html`
  - `pages/page7.html`
  - `pages/page8.html`
  - `pages/page9.html`
  - `pages/page10.html`
  - `pages/page11.html`
  - `pages/page12.html`
  - `pages/page13.html`
  - `pages/page14.html`
  - `pages/page15.html`
  - `pages/page16.html`
  - `pages/page17.html`
  - `pages/page18.html`

### Technical Details
- Changed `<span class="nav-label">Executive Summary</span>` to `<span class="nav-label">Scope</span>`
- Navigation link still points to `page2.html`
- Title attribute remains "Executive Summary" (hover tooltip)
- No styling or functionality changes
- All navigation features remain intact (active state, hover effects, etc.)

### Quality Assurance
- All 18 pages tested and verified working properly
- Navigation sidebar displays "Scope" correctly
- Link to page2.html functions correctly
- Active state highlighting works as expected
- No visual or styling issues introduced

---

## [2025-11-05] - Added Executive Summary Navigation Item

### Requested
- User requested: "on @page1.html on the left navigation below the High Level Strategy add Executive Summary use an icon that represent executive summary"
  - Context: Add a new navigation item for Executive Summary in the sidebar
  - Location: Position it between "High Level Strategy" and "Client Goals"
  - Requirement: Use an appropriate icon representing executive summary

### Added
- Added "Executive Summary" navigation item to all HLS template pages
- New navigation item links to `page2.html`
- Created document icon (SVG) with horizontal lines to represent summary/document
- Icon design: Rectangle with rounded corners and three horizontal lines (text representation)
- Positioned between "High Level Strategy" (page1) and "Client Goals" (page3)

### Changed
- Updated the following pages with the new "Executive Summary" navigation item:
  - `page1.html` (manually added)
  - `page3.html`, `page4.html`, `page5.html`, `page6.html`, `page7.html`, `page8.html`, `page9.html` (batch updated)
  - `page10.html`, `page11.html`, `page12.html`, `page13.html`, `page14.html`, `page18.html` (batch updated)
- Pages not updated (different sidebar template): `page2.html`, `page15.html`, `page16.html`, `page17.html`

### Technical Details
- Icon SVG: `<rect x="7" y="4" width="10" height="16" rx="2" />` with three `<path>` elements for text lines
- Link target: `href="page2.html"` with `data-page="page2.html"`
- Consistent styling with existing navigation items
- Title attribute: "Executive Summary"
- Navigation order: High Level Strategy → **Executive Summary** → Client Goals → ... (rest of menu)

---

## [2025-11-05] - Removed Sidebar Partial and Loader

### Requested
- User requested: "lets remove the sidebar.html and just have sidebar hard coded on each page"
  - Context: Eliminate the dynamic sidebar loading system completely
  - Reason: Simplified architecture with hardcoded sidebars on each page

### Removed
- Deleted `partials/sidebar.html` - sidebar partial file no longer needed
- Deleted `assets/js/sidebar-loader.js` - dynamic sidebar loading script no longer needed

### Technical Details
- All pages (page1.html through page17.html) now have hardcoded sidebar navigation
- No pages are using `<div id="sidebar-container"></div>` or referencing `sidebar-loader.js`
- Each page maintains its own complete sidebar structure with all 17 navigation items
- Active navigation state is handled by inline JavaScript on each page

---

## [2025-11-05] - Reverted page1.html to Original State

### Requested
- User requested: "revert back the changes you have made on pag1.html"
  - Context: Restore page1.html to its original state with hardcoded sidebar navigation
  - Reason: The dynamic sidebar loading implementation needed to be reversed

### Changed
- Reverted `pages/page1.html` to use hardcoded sidebar navigation instead of dynamic loading
- Removed `<div id="sidebar-container"></div>` placeholder
- Removed `<script src="../assets/js/sidebar-loader.js"></script>` reference
- Restored complete `<nav class="sidebar">...</nav>` structure with all 17 navigation items
- Restored inline script for setting active navigation link state
- File structure now matches original implementation with sidebar directly embedded in the page

### Technical Details
- All navigation items (pages 1-17) are now hardcoded within the page
- Logo source: `https://lionheadmarketing.com/wp-content/uploads/2023/05/cropped-LHD_Favicon-1-192x192.png`
- Active navigation state is handled by inline JavaScript using `DOMContentLoaded` event
- Navigation includes all sections: High Level Strategy through CU Deployment, plus Export PDF button

---

## [2025-01-11] - Page4 Styling Updates

### Requested
- User requested: "in @page4.html the the font color of the convertion rate rows to blue"
  - Context: Update the conversion rate row text color to blue for better visibility
- User requested: Remove shadow effect from `<span class="has-leads">` elements in the "Leads by Landing Page" table
  - Context: Simplify visual styling by removing box-shadow from lead count badges
- User requested: "change the TD color to green"
  - Context: Change the text color of lead count badges in the landing page table to green
- User requested: "change the font color to green and highlight it or change the background color of the TD to light green see screenshot"
  - Context: Apply light green background to lead count badges with dark, bold text as shown in screenshot
- User requested: "change the font color to darger green"
  - Context: Change text color to darker green for better visual consistency
- User requested: Add page break before "Issues/Concerns" section
  - Context: Ensure proper page breaks when exporting to PDF
- User requested: Revert page break and add line break instead
  - Context: Add visual spacing instead of page break
- User requested: Revert line break and add divider instead
  - Context: Add a visual divider line before the "Issues/Concerns" section
- User requested: Add divider above "Issues/Concerns" section on all pages
  - Context: Ensure consistent visual separation across all pages

### Changed
- Updated `.cvr-row td` CSS in `pages/page4.html` to set `color: var(--accent-color)` (blue)
- This ensures both the "Conversion Rate" label and all percentage values in conversion rate rows are displayed in blue
- Removed `box-shadow` property from `.landing-table .has-leads` CSS rule
- Lead count badges in the landing page table now display without shadow effects
- Changed `background` property in `.landing-table .has-leads` from `linear-gradient(...)` to solid `#e6ffe6` (light green)
- Changed `color` property in `.landing-table .has-leads` from `#0b1e3d` (dark blue-gray) to `#155724` (darker green)
- Updated `font-weight` property in `.landing-table .has-leads` from `600` to `700` (bold)
- Lead count badges now have light green background with darker green, bold text for better visibility and consistency
- Reverted page break change - removed `page-break-before` class and CSS
- Reverted line break spacing - removed `section-spacing` class and CSS
- Added divider element using existing `.section-divider` class before "Issues/Concerns" section
- The divider provides a visual separation with a gradient line styling
- Added `.section-divider` CSS class to all pages that had "Issues/Concerns" sections (page2, page3, page5, page6, page8, page9, page10, page11, page12, page13)
- Added divider element before "Issues/Concerns" section on all pages for consistent visual separation
- All pages now have a uniform divider styling before the Issues/Concerns section

---

## [2025-01-11] - Logo Files and Additional Updates

### Requested
- User provided logo files and requested updates:
  - Lion Head Digital logo (SVG format) saved as `lhd-logo.svg` for use on page1.html
  - Client logo saved as `client-logo.png` for use on page1.html
  - Favicon saved as `favicon.png` for sidebar navigation menu
  - Requested to update references to use local logo files instead of external URLs

### Added
- Logo files in `assets/images/logos/`:
  - `lhd-logo.svg` - Lion Head Digital logo (colored SVG from https://lionheadmarketing.com/wp-content/uploads/2023/06/Logo_Colored.svg)
  - `favicon.png` - Favicon for sidebar navigation
  - `client-logo.png` - Client logo for page1.html
- Created `.gitkeep` files for empty directories:
  - `assets/images/logos/.gitkeep`
  - `assets/images/content/.gitkeep`
  - `assets/data/references/.gitkeep`
- Created `pages/README.md` - Documentation for the pages directory

### Changed
- Updated `partials/sidebar.html` to reference `favicon.png` instead of `lhd-logo.png` for sidebar logo
- Moved `page5 - [old].html` from `pages/` to `archive/` folder

### Notes
- Page1.html still uses base64-encoded logos - these should be updated to reference:
  - `../assets/images/logos/lhd-logo.svg` for the LHD logo
  - `../assets/images/logos/client-logo.png` for the client logo
- Sidebar logo now correctly references local `favicon.png` file

---

## [2025-01-11] - Major Project Restructure

### Requested
- User requested: "how should i structure my projects?"
  - Considerations mentioned:
    - Should we separate the left navigation menu and just have it referenced inside the HTML?
    - Should we create a folder for assets like logos and also PDF files or Excel files with data to be featured?
    - Note: Uses Google Sheets instead of Excel
    - Data from Google Sheets along with different screenshots used as reference
  - User also requested: "lets implement this" - to implement the recommended structure

### Added
- Created comprehensive folder structure:
  - `assets/images/logos/` - For logo files
  - `assets/images/screenshots/` - For reference screenshots
  - `assets/images/content/` - For content images
  - `assets/css/` - Common stylesheets
  - `assets/js/` - JavaScript files
  - `assets/data/google-sheets/` - Documentation for Google Sheets
  - `assets/data/references/` - For PDFs and reference files
  - `pages/` - All HTML pages
  - `partials/` - Reusable HTML components
  - `archive/` - Temporary/old files
- Created `partials/sidebar.html` - Extracted navigation sidebar from all pages
- Created `assets/js/sidebar-loader.js` - JavaScript to dynamically load sidebar navigation
- Created `assets/css/styles.css` - Common CSS styles extracted from individual pages
- Created `assets/data/google-sheets/README.md` - Template for documenting Google Sheets usage
- Created `.gitignore` - Git ignore file for the project
- Created `.cursorrules` - Project rules and instructions for Cursor AI
- Created `CHANGELOG.md` - This file for tracking all changes

### Changed
- Moved all HTML pages (`page*.html`) from root directory to `pages/` folder
- Moved `pdf-export.js` to `assets/js/pdf-export.js`
- Moved `brand-search-campaign.png` to `assets/images/screenshots/brand-search-campaign.png`
- Updated sidebar navigation links to use `../pages/pageX.html` paths
- Reorganized project structure for better maintainability

### Removed
- Removed duplicate sidebar HTML code from all individual HTML pages (now uses partial)
- Removed duplicate CSS code from individual pages (now uses common stylesheet)
- Moved temporary files to archive:
  - `page4-top.tmp` → `archive/`
  - `page4-bottom.tmp` → `archive/`
  - `page5 - [old].html` → `archive/`

### Fixed
- Fixed external logo URL reference (prepared for local storage in `assets/images/logos/`)
- Fixed scattered asset organization
- Fixed duplicate code issues (sidebar and CSS repeated in every file)

### Notes
- HTML pages still need to be updated to:
  - Remove inline sidebar HTML and replace with `<div id="sidebar-container"></div>`
  - Link to external CSS file (`../assets/css/styles.css`)
  - Add sidebar loader script (`../assets/js/sidebar-loader.js`)
  - Update JavaScript file paths
- See `IMPLEMENTATION_COMPLETE.md` for detailed update instructions

---

## Template for Future Entries

### [YYYY-MM-DD] - Description

### Requested
- User requested: [What the user asked for]
  - Context: [Any additional context, considerations, or constraints]
  - Related to: [Any related requests or issues]

### Added
- [New features, files, folders, or functionality added]

### Changed
- [Changes to existing functionality, files, or structure]

### Deprecated
- [Features that are no longer recommended and will be removed in future]

### Removed
- [Removed features, files, or functionality]

### Fixed
- [Bug fixes and corrections]

### Security
- [Security improvements or fixes]

