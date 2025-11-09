/**
 * Hurwitz Law Group HLS Report - PDF Export Server
 *
 * This Node.js server provides a PDF generation endpoint that:
 * - Renders any requested HTML page from the /pages folder
 * - Uses Puppeteer (headless Chrome) to capture screenshots of the main content
 * - Hides the sidebar so each screenshot focuses on the report body
 * - Scales every screenshot to fit a single A4 PDF page before download
 */

const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const { PDFDocument } = require('pdf-lib');

const app = express();
const PORT = 3000;
const PAGES_DIR = path.join(__dirname, 'pages');

// Enable CORS for local development
app.use(cors());

// Serve static files (HTML pages, CSS, images, etc.)
app.use(express.static(__dirname));

/**
 * Normalize and validate the requested page name.
 * Prevents path traversal and ensures we only serve .html files.
 *
 * @param {string} rawPage
 * @returns {string}
 */
function sanitizePageName(rawPage = 'page1.html') {
    const candidate = path.basename(rawPage || 'page1.html');

    if (!candidate.toLowerCase().endsWith('.html')) {
        throw new Error('Only .html files can be exported.');
    }

    if (!/^[a-zA-Z0-9_-]+\.html$/.test(candidate)) {
        throw new Error('Invalid page name. Use alphanumeric characters, dashes, and underscores only.');
    }

    return candidate;
}

/**
 * Ensure the requested page actually exists inside /pages.
 *
 * @param {string} pageName
 * @returns {Promise<void>}
 */
async function assertPageExists(pageName) {
    const fullPath = path.join(PAGES_DIR, pageName);

    try {
        await fs.access(fullPath);
    } catch (error) {
        throw new Error(`Page "${pageName}" was not found inside /pages.`);
    }
}

/**
 * Turn a query parameter into a normalized list of page names.
 *
 * @param {string|string[]} rawValue
 * @returns {string[]}
 */
function normalizePageList(rawValue) {
    if (!rawValue) {
        return ['page1.html'];
    }

    const values = Array.isArray(rawValue)
        ? rawValue
        : String(rawValue)
            .split(',')
            .map(value => value.trim())
            .filter(Boolean);

    const sanitized = [];

    for (const value of values) {
        const pageName = sanitizePageName(value);
        if (!sanitized.includes(pageName)) {
            sanitized.push(pageName);
        }
    }

    return sanitized.length > 0 ? sanitized : ['page1.html'];
}

/**
 * Generate screenshot-based PDFs for one or more HTML pages.
 * Each page's `.main-content` is captured as a PNG screenshot without the sidebar
 * and then scaled to fit onto a single A4 PDF page.
 *
 * @param {string[]} pageNames
 * @returns {Promise<Buffer>}
 */
async function generatePDF(pageNames = ['page1.html']) {
    let browser;
    let page;
    const screenshots = [];

    try {
        if (!Array.isArray(pageNames) || pageNames.length === 0) {
            pageNames = ['page1.html'];
        }

        await Promise.all(pageNames.map(assertPageExists));

        console.log(`Launching headless Chrome to export: ${pageNames.join(', ')}`);
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        page = await browser.newPage();

        await page.setViewport({
            width: 1400,
            height: 1800,
            deviceScaleFactor: 2
        });

        await page.emulateMediaType('screen');

        for (const pageName of pageNames) {
            const fileUrl = `http://localhost:${PORT}/pages/${pageName}`;

            console.log(`→ Rendering ${pageName} for screenshot...`);

            await page.goto(fileUrl, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            // Allow custom fonts/images to render fully.
            await page.waitForTimeout(750);

            // Hide the sidebar and normalize background before capturing.
            await page.addStyleTag({
                content: `
                    body {
                        background: #ffffff !important;
                        margin: 0 !important;
                    }

                    .sidebar,
                    .page-sidebar,
                    nav,
                    footer,
                    .notes-section,
                    .notes,
                    .notes-wrapper,
                    .notes-container,
                    .notes-panel,
                    .notes-area,
                    .notes-block,
                    .notes-card,
                    [data-notes],
                    [data-component="notes"],
                    [id*="notes"],
                    .page-footer,
                    .footer-notes,
                    .cta-footer {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    .main-content,
                    main {
                        margin-left: 0 !important;
                    }
                `
            });

            // Remove any lingering notes/footer nodes that might still reserve space.
            await page.evaluate(() => {
                const selectors = [
                    '.notes-section',
                    '.notes',
                    '.notes-wrapper',
                    '.notes-container',
                    '.notes-panel',
                    '.notes-area',
                    '.notes-block',
                    '.notes-card',
                    'footer',
                    '.page-footer',
                    '.footer-notes',
                    '.cta-footer',
                    '[data-notes]',
                    '[data-component="notes"]'
                ];

                selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                });
            });

            const mainContentHandle =
                (await page.$('.main-content')) ||
                (await page.$('main')) ||
                (await page.$('body'));

            if (!mainContentHandle) {
                throw new Error(`Could not find main content container on ${pageName}`);
            }

            const screenshot = await mainContentHandle.screenshot({
                type: 'png',
                omitBackground: false
            });

            await mainContentHandle.dispose();

            screenshots.push(screenshot);
        }

        if (screenshots.length === 0) {
            throw new Error('No screenshots were captured.');
        }

        console.log(`Creating PDF from ${screenshots.length} screenshot(s)...`);
        return await buildPdfFromScreenshots(screenshots);
    } catch (error) {
        console.error(`Error generating PDF for [${pageNames.join(', ')}]:`, error);
        throw error;
    } finally {
        if (page && !page.isClosed()) {
            await page.close().catch(() => { /* noop */ });
        }

        if (browser) {
            await browser.close().catch(() => { /* noop */ });
        }
    }
}

/**
 * Convert screenshots into a PDF document, scaling each image
 * to fit within an A4 page while preserving aspect ratio.
 *
 * @param {Buffer[]} screenshotBuffers
 * @returns {Promise<Buffer>}
 */
async function buildPdfFromScreenshots(screenshotBuffers) {
    const pdfDoc = await PDFDocument.create();

    const A4_WIDTH = 595.28; // points
    const A4_HEIGHT = 841.89;
    const MARGIN = 36; // half inch

    for (const screenshot of screenshotBuffers) {
        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        const image = await pdfDoc.embedPng(screenshot);
        const imageDims = image.scale(1);

        const maxWidth = A4_WIDTH - (MARGIN * 2);
        const maxHeight = A4_HEIGHT - (MARGIN * 2);
        const widthScale = maxWidth / imageDims.width;
        const heightScale = maxHeight / imageDims.height;
        const scale = Math.min(widthScale, heightScale, 1);
        const scaled = image.scale(scale);

        const x = (A4_WIDTH - scaled.width) / 2;
        const y = (A4_HEIGHT - scaled.height) / 2;

        page.drawImage(image, {
            x,
            y,
            width: scaled.width,
            height: scaled.height
        });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
/**
 * API Endpoint: Generate and download PDF
 */
app.get('/api/generate-pdf', async (req, res) => {
    let pageNames;

    console.log('\n=== PDF Generation Request Received ===');

    try {
        if (typeof req.query.pages !== 'undefined') {
            pageNames = normalizePageList(req.query.pages);
        } else {
            pageNames = normalizePageList(req.query.page);
        }
    } catch (validationError) {
        console.error('Invalid page parameter supplied:', validationError.message);
        return res.status(400).json({
            error: 'Invalid page parameter',
            message: validationError.message
        });
    }

    try {
        const pdfBuffer = await generatePDF(pageNames);

        const downloadName = pageNames.length === 1
            ? `${path.parse(pageNames[0]).name}.pdf`
            : `hurwitz-report-${pageNames.map(name => path.parse(name).name).join('-')}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        res.send(pdfBuffer);

        console.log(`=== PDF Sent Successfully (${downloadName}) ===\n`);

    } catch (error) {
        console.error('=== PDF Generation Failed ===');
        console.error(error);

        res.status(500).json({
            error: 'Failed to generate PDF',
            message: error.message
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'PDF Export Server is running' });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║   Hurwitz Law Group - PDF Export Server             ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log(`\n🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📄 PDF Endpoint: http://localhost:${PORT}/api/generate-pdf`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
    console.log('\n💡 Ready to generate PDFs! Click "Export to PDF" on any page.\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nServer shutting down gracefully...');
    process.exit(0);
});
