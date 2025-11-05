# Project Structure Recommendations

## Current Issues Identified

1. **Navigation sidebar duplicated** - Same navigation code repeated in every HTML file (~200+ lines per file)
2. **Assets scattered** - Images, logos, and references mixed in root directory
3. **No asset organization** - Screenshots, logos, and reference materials not organized
4. **Temporary files** - `page4-top.tmp`, `page4-bottom.tmp`, `page5 - [old].html` cluttering root
5. **External logo URL** - Logo loaded from external website instead of local file

## Recommended Project Structure

```
Report/
├── pages/                          # All HTML pages
│   ├── page1.html
│   ├── page2.html
│   ├── page3.html
│   └── ... (page4.html through page17.html)
│
├── assets/                         # All static assets
│   ├── images/                     # Images and screenshots
│   │   ├── logos/                  # Logo files
│   │   │   ├── lhd-logo.png        # Lion Head Digital logo (currently external URL)
│   │   │   └── client-logo.png     # Client logos (if any)
│   │   ├── screenshots/            # Reference screenshots
│   │   │   ├── brand-search-campaign.png
│   │   │   └── ... (other screenshots)
│   │   └── content/                # Content images (charts, graphics, etc.)
│   │
│   ├── css/                        # Stylesheets
│   │   └── styles.css              # Extract common styles from HTML
│   │
│   ├── js/                         # JavaScript files
│   │   ├── main.js                 # Main JavaScript logic
│   │   └── pdf-export.js            # PDF export functionality
│   │
│   └── data/                       # Data and reference files
│       ├── google-sheets/          # Links/documentation to Google Sheets
│       │   └── README.md           # Document which sheets are used for what
│       └── references/             # PDFs, exported data, etc.
│
├── partials/                       # Reusable HTML components
│   ├── sidebar.html                # Navigation sidebar (EXTRACT FROM PAGES)
│   ├── header.html                 # Page header (if needed)
│   └── footer.html                 # Page footer (if needed)
│
├── scripts/                        # Build/utility scripts (optional)
│   └── build.js                    # If you need build automation
│
├── archive/                        # Old/temporary files
│   ├── page4-top.tmp
│   ├── page4-bottom.tmp
│   └── page5 - [old].html
│
├── .gitignore                      # Git ignore file
├── README.md                       # Project documentation
└── package.json                    # If using npm/node tools
```

## Key Recommendations

### 1. ✅ **Separate Navigation Sidebar** (STRONGLY RECOMMENDED)

**Current Problem:** Navigation code (~200 lines) is duplicated in every HTML file.  
**Solution:** Extract to `partials/sidebar.html` and include it via JavaScript or a simple server-side include.

**Benefits:**
- Update navigation in ONE place instead of 17+ files
- Reduce maintenance burden
- Consistent navigation across all pages
- Easier to add/remove pages

**Implementation Options:**
- **Option A (Simple):** JavaScript fetch and inject (works for static hosting)
  ```javascript
  // Load sidebar on page load
  fetch('partials/sidebar.html')
    .then(response => response.text())
    .then(html => document.getElementById('sidebar-container').innerHTML = html);
  ```

- **Option B:** Use a simple build script to inject during development
- **Option C:** Server-side includes (if using a server)

### 2. ✅ **Organize Assets** (STRONGLY RECOMMENDED)

**Create dedicated folders for:**
- **Logos:** `assets/images/logos/` - Store all logo files locally instead of external URLs
- **Screenshots:** `assets/images/screenshots/` - All reference screenshots in one place
- **Data references:** `assets/data/google-sheets/` - Document links to your Google Sheets

**Benefits:**
- Easy to find assets
- Version control friendly
- No broken external links
- Better organization

### 3. ✅ **Extract Common CSS** (RECOMMENDED)

**Current:** Styles are inline in each HTML file.  
**Solution:** Extract common styles (sidebar, navigation, main content) to `assets/css/styles.css`.

**Benefits:**
- Single source of truth for styling
- Easier to maintain consistent design
- Smaller HTML files

### 4. ✅ **Organize Data References** (RECOMMENDED)

**For Google Sheets:**
- Create `assets/data/google-sheets/README.md` documenting:
  - Which sheets are used for which pages
  - Links to the sheets
  - Update frequency/process
  - Any API keys or access notes

**Benefits:**
- Clear documentation of data sources
- Easy to update when sheets change
- Team members know where data comes from

### 5. ✅ **Clean Up Temporary Files**

Move all temporary/old files to `archive/` folder:
- `page4-top.tmp`
- `page4-bottom.tmp`
- `page5 - [old].html`

## Implementation Priority

### Phase 1: Quick Wins (High Impact, Low Effort)
1. ✅ Create `assets/images/logos/` and download logo locally
2. ✅ Create `assets/images/screenshots/` and move `brand-search-campaign.png`
3. ✅ Move JavaScript files to `assets/js/`
4. ✅ Create `archive/` and move temporary files

### Phase 2: Structure Improvements (Medium Effort, High Value)
1. ✅ Extract sidebar to `partials/sidebar.html`
2. ✅ Implement sidebar loading in all pages
3. ✅ Extract common CSS to `assets/css/styles.css`
4. ✅ Move all HTML pages to `pages/` folder

### Phase 3: Documentation (Low Effort, Ongoing Value)
1. ✅ Create `assets/data/google-sheets/README.md`
2. ✅ Update main `README.md` with project structure
3. ✅ Add `.gitignore` file

## File Path Updates Needed

After restructuring, you'll need to update paths in:
- HTML files: `../assets/...` (if pages are in subfolder)
- Image references: `assets/images/...`
- JavaScript references: `assets/js/...`
- CSS references: `assets/css/...`

## Questions to Consider

1. **Navigation updates frequency:** How often do you add/remove pages? (This determines if sidebar separation is critical)
2. **Build process:** Do you want a simple build script to combine partials, or prefer JavaScript loading?
3. **Hosting:** Are these static files or do you have a server? (Affects include method)
4. **Team size:** Is this solo or team project? (Affects documentation needs)

## Next Steps

Would you like me to:
1. **Create the folder structure** and move files accordingly?
2. **Extract the sidebar** to a separate partial file?
3. **Set up the JavaScript** to load the sidebar dynamically?
4. **Create a build script** to automate the process?

Let me know which phase you'd like to start with!

