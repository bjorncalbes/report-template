/**
 * Hurwitz Law Group - PDF Export Client Script
 *
 * This script handles the "Export to PDF" button functionality.
 * It communicates with the Node.js server to generate a combined PDF
 * of all HTML pages in the /pages folder.
 *
 * Usage: The exportToPDF() function is called when the user clicks
 * the "Export to PDF" button in the sidebar navigation.
 */

(function () {
    // Prevent duplicate initialization
    if (window.exportToPDF) {
        return;
    }

    const DEFAULT_PAGE = 'page1.html';

    /**
     * Configuration
     */
    const CONFIG = {
        // Server endpoint for PDF generation
        apiEndpoint: 'http://localhost:3000/api/generate-pdf',

        // PDF filename template (fallback if server does not set one)
        pdfFilename: 'hurwitz-report-{pages}.pdf',

        // Request timeout (milliseconds)
        timeout: 300000 // 5 minutes - allows time for all 18 pages to render
    };

    /**
     * Create and display the progress overlay
     * Shows a modal overlay while PDF is being generated
     *
     * @returns {HTMLElement} The overlay element
     */
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pdf-export-overlay';

        // Styling for the overlay
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.35)';
        overlay.style.backdropFilter = 'blur(4px)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10000';

        // Modal content with progress message
        overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                padding: 40px 50px;
                border-radius: 18px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 420px;
                border: 1px solid rgba(255, 255, 255, 0.8);
            ">
                <div style="
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 20px;
                    border: 4px solid #0445ac;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <h3 style="
                    margin: 0 0 12px 0;
                    color: #0b1e3d;
                    font-size: 22px;
                    font-weight: 600;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
                ">Generating PDF Report</h3>
                <p id="pdf-export-progress" style="
                    margin: 0;
                    color: rgba(11, 30, 61, 0.72);
                    font-size: 15px;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
                ">Processing all pages...</p>
                <p style="
                    margin: 16px 0 0 0;
                    color: rgba(11, 30, 61, 0.5);
                    font-size: 13px;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
                ">This may take a minute</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        document.body.appendChild(overlay);
        return overlay;
    }

    /**
     * Remove the progress overlay
     *
     * @param {HTMLElement} overlay - The overlay element to remove
     */
    function removeOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    /**
     * Update the progress message
     *
     * @param {HTMLElement} overlay - The overlay element
     * @param {string} message - The progress message to display
     */
    function updateProgress(overlay, message) {
        const progressEl = overlay.querySelector('#pdf-export-progress');
        if (progressEl) {
            progressEl.textContent = message;
        }
    }

    /**
     * Sanitize the requested page name so we never send invalid paths to the server.
     *
     * @param {string} pageName
     * @returns {string}
     */
    function sanitizePageName(pageName) {
        if (typeof pageName !== 'string' || !pageName.trim()) {
            return DEFAULT_PAGE;
        }

        const trimmed = pageName.trim();

        if (!trimmed.toLowerCase().endsWith('.html')) {
            return DEFAULT_PAGE;
        }

        if (!/^[a-zA-Z0-9_-]+\.html$/.test(trimmed)) {
            return DEFAULT_PAGE;
        }

        return trimmed;
    }

    /**
     * Determine which HTML file is currently being viewed.
     * Falls back to page1.html when invoked from index.html or other root files.
     *
     * @returns {string}
     */
    function getCurrentPageFromLocation() {
        const pathname = window.location.pathname || '';
        const segments = pathname.split('/');
        const lastSegment = segments.pop() || '';

        // We only consider files inside /pages/ valid targets.
        if (!pathname.includes('/pages/')) {
            return DEFAULT_PAGE;
        }

        return sanitizePageName(lastSegment);
    }

    /**
     * Decide which page should be exported.
     *
     * @param {string} explicitPage
     * @returns {string}
     */
    function resolvePagesToExport(targetPages) {
        if (Array.isArray(targetPages)) {
            const sanitized = targetPages
                .map(sanitizePageName)
                .filter(Boolean);

            const unique = [...new Set(sanitized)];
            if (unique.length > 0) {
                return unique;
            }
        } else if (typeof targetPages === 'string' && targetPages.trim()) {
            return [sanitizePageName(targetPages)];
        }

        return [getCurrentPageFromLocation()];
    }

    /**
     * Construct the API URL for the requested page(s).
     *
     * @param {string[]} pages
     * @returns {string}
     */
    function buildEndpointForPages(pages) {
        const url = new URL(CONFIG.apiEndpoint);

        if (pages.length === 1) {
            url.searchParams.set('page', pages[0]);
        } else {
            url.searchParams.set('pages', pages.join(','));
        }

        return url.toString();
    }

    /**
     * Check if the server is running
     *
     * @returns {Promise<boolean>} True if server is reachable
     */
    async function checkServerStatus() {
        try {
            const response = await fetch('http://localhost:3000/api/health', {
                method: 'GET',
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Download a blob as a file
     *
     * @param {Blob} blob - The blob to download
     * @param {string} filename - The filename for the download
     */
    function downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * Figure out the best filename to use for the downloaded PDF.
     *
     * @param {Response} response
     * @param {string} pageName
     * @returns {string}
     */
    function resolveDownloadFilename(response, pages) {
        const disposition = response.headers.get('Content-Disposition') || '';
        const match = disposition.match(/filename="?([^\";]+)"?/i);

        if (match && match[1]) {
            return match[1];
        }

        const pageSlug = pages
            .map(page => page.replace('.html', ''))
            .join('-');

        return CONFIG.pdfFilename
            .replace('{pages}', pageSlug)
            .replace('{page}', pages[0].replace('.html', ''));
    }

    /**
     * Main export function - generates and downloads the PDF
     * This function is called when the "Export to PDF" button is clicked
     */
    window.exportToPDF = async function exportToPDF(targetPages) {
        let overlay = null;

        try {
            // Show progress overlay
            overlay = createOverlay();
            const pagesToExport = resolvePagesToExport(targetPages);
            updateProgress(overlay, `Connecting to server for ${pagesToExport.join(', ')}...`);

            // Check if server is running
            const serverRunning = await checkServerStatus();
            if (!serverRunning) {
                throw new Error(
                    'PDF Export Server is not running.\n\n' +
                    'Please start the server by running:\n' +
                    'npm install (first time only)\n' +
                    'npm start\n\n' +
                    'Then try exporting again.'
                );
            }

            // Request PDF generation from server
            updateProgress(overlay, 'Generating PDF...');

            const endpoint = buildEndpointForPages(pagesToExport);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

            const response = await fetch(endpoint, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Check response status
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                    `Server error: ${response.status} ${response.statusText}`
                );
            }

            // Get PDF blob
            updateProgress(overlay, 'Downloading PDF...');
            const pdfBlob = await response.blob();

            // Validate that we got a PDF
            if (pdfBlob.type !== 'application/pdf') {
                throw new Error('Invalid response from server (not a PDF)');
            }

            // Download the PDF
            const filename = resolveDownloadFilename(response, pagesToExport);
            downloadBlob(pdfBlob, filename);

            // Success! Update progress briefly before closing
            updateProgress(overlay, `PDF downloaded successfully (${filename})!`);
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error('PDF export failed:', error);

            // User-friendly error messages
            let errorMessage = 'Failed to generate PDF.';

            if (error.name === 'AbortError') {
                errorMessage = 'PDF generation timed out. The report may be too large.\n\nPlease try again or contact support.';
            } else if (error.message.includes('PDF Export Server is not running')) {
                errorMessage = error.message;
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Cannot connect to PDF Export Server.\n\nPlease ensure the server is running:\nnpm start';
            } else {
                errorMessage = `Error: ${error.message}`;
            }

            alert(errorMessage);

        } finally {
            // Always remove the overlay
            if (overlay) {
                removeOverlay(overlay);
            }
        }
    };

    // Log initialization
    console.log('PDF Export client loaded. Server endpoint:', CONFIG.apiEndpoint);
})();
