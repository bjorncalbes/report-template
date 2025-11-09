# PDF Export - Quick Start Guide

## Installation (One-Time Only)

1. **Open Terminal/Command Prompt** in the project folder:
   ```
   e:\OneDrive\LHD\HLS Template\Hurwitz HLS\Report
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will take a few minutes and download:
   - Express (web server)
   - Puppeteer (headless Chrome - ~200MB)
   - CORS (cross-origin support)

## Daily Usage

### Step 1: Start the Server

Open terminal and run:
```bash
npm start
```

You should see:
```
╔══════════════════════════════════════════════════════╗
║   Hurwitz Law Group - PDF Export Server             ║
╚══════════════════════════════════════════════════════╝

🚀 Server running at: http://localhost:3000
```

**Keep this terminal window open!**

### Step 2: Open the Report

In your browser, visit:
```
http://localhost:3000/pages/page1.html
```

### Step 3: Export to PDF

1. Click **"Export to PDF"** button in the sidebar
2. Wait for the progress overlay (30-90 seconds)
3. PDF downloads automatically: `hurwitz-law-group-report.pdf`

### Step 4: Stop the Server (When Done)

Press `Ctrl+C` in the terminal window

---

## What Gets Exported?

✅ **All 18 HTML pages** in the `/pages` folder
✅ **Automatic sorting** (page1 → page18)
✅ **Full styling** (colors, fonts, layouts)
✅ **All images** (logos, screenshots, graphics)
✅ **Professional format** (A4 with proper margins)
✅ **Multi-page support** (long pages span multiple PDF pages)

❌ **Sidebar navigation** (hidden in PDF)
❌ **Interactive elements** (buttons, forms become static)

---

## Common Issues & Solutions

### "PDF Export Server is not running"

**Problem**: Server isn't started
**Solution**: Run `npm start` in terminal

---

### "Failed to fetch" or "Cannot connect"

**Problem**: Not accessing through the server
**Solution**: Use `http://localhost:3000/pages/page1.html` (not direct file path)

---

### PDF takes too long or times out

**Problem**: 18 pages is a lot to process
**Solution**: Wait up to 2 minutes. If it still times out:
1. Close other Chrome/browser tabs
2. Try again (sometimes it's just temporary)
3. Check server terminal for error messages

---

### Images missing in PDF

**Problem**: Images didn't load in time
**Solution**: Usually fixes itself on retry. If persistent, images may have broken links.

---

### Port 3000 already in use

**Problem**: Another app is using port 3000
**Solution**:
1. Stop the other app, OR
2. Edit `server.js` line 14 to use a different port (e.g., 3001)
3. Also update `assets/js/pdf-export.js` line 23 with new port

---

## Advanced Customization

### Change PDF Margins

Edit `server.js` around line 125:
```javascript
margin: {
    top: '20mm',     // Change these values
    right: '15mm',
    bottom: '20mm',
    left: '15mm'
}
```

### Change PDF Paper Size

Edit `server.js` around line 123:
```javascript
format: 'A4',  // Options: 'Letter', 'Legal', 'A3', 'A4', 'A5'
```

### Exclude Certain Pages

Edit `server.js` around line 27-30:
```javascript
const htmlFiles = files
    .filter(file => file.endsWith('.html'))
    .filter(file => !file.includes('template'))  // Add more exclusions
    .sort(...);
```

### Change PDF Filename

Edit `assets/js/pdf-export.js` line 26:
```javascript
pdfFilename: 'my-custom-report.pdf',
```

---

## Technical Details

**Server**: Node.js + Express on port 3000
**PDF Engine**: Puppeteer (headless Chromium)
**Client**: Vanilla JavaScript (no frameworks)
**Format**: A4, 20mm/15mm margins
**Output**: Single combined PDF

**Files Modified:**
- ✨ `package.json` - Node.js configuration
- ✨ `server.js` - PDF generation server
- 🔄 `assets/js/pdf-export.js` - Client-side script (replaced)
- 🔄 `.gitignore` - Added `*.pdf` exclusion

---

## Support Checklist

Before asking for help, verify:

- [ ] Node.js is installed (`node --version` in terminal)
- [ ] Dependencies are installed (`npm install` completed successfully)
- [ ] Server is running (`npm start` shows success message)
- [ ] Accessing via `http://localhost:3000/pages/...` (not file://)
- [ ] Checked terminal for error messages
- [ ] Checked browser console (F12) for errors
- [ ] Tried with another browser
- [ ] Waited at least 2 minutes for PDF generation

---

## Files Overview

| File | Purpose |
|------|---------|
| `package.json` | Lists Node.js dependencies (Express, Puppeteer, CORS) |
| `server.js` | Express server that generates PDF using Puppeteer |
| `assets/js/pdf-export.js` | Browser script that calls server API |
| `.gitignore` | Excludes `node_modules/` and `*.pdf` from git |
| `README.md` | Main project documentation |
| `PDF_EXPORT_GUIDE.md` | This quick reference guide |

---

**Last Updated**: 2025-01-09
**Version**: 1.0.0
**Contact**: LHD Development Team
