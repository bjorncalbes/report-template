(function () {
    if (window.exportToPDF) {
        return;
    }

    function getPageList() {
        // Collect all anchor hrefs that look like pageN.html anywhere in the doc
        const hrefs = Array.from(document.querySelectorAll('a[href]'))
            .map(a => a.getAttribute('href'))
            .filter(Boolean)
            .map(href => href.split('#')[0]);

        const pages = [];
        const seen = new Set();
        const pageRegex = /(^|\/)page(\d+)\.html$/i;

        for (const href of hrefs) {
            const file = href.split('/').pop();
            const m = file && file.match(pageRegex);
            if (m && !seen.has(file)) {
                seen.add(file);
                pages.push({ file, num: parseInt(m[2], 10) });
            }
        }

        // Ensure current page is included
        const currentPath = window.location.pathname.split('/').pop() || 'page1.html';
        if (!seen.has(currentPath)) {
            const m = currentPath.match(pageRegex);
            pages.push({ file: currentPath, num: m ? parseInt(m[2], 10) : Number.MAX_SAFE_INTEGER });
        }

        // Sort numerically by page number, unknowns at end
        pages.sort((a, b) => a.num - b.num);
        return pages.map(p => p.file);
    }

    async function fetchPageContent(url) {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Unable to load ${url} (${response.status})`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const mainContent = doc.querySelector('.main-content') || doc.body;
        const styles = Array.from(doc.querySelectorAll('style'))
            .map(style => style.textContent || '')
            .join('\n');
        const styleLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]'))
            .map(l => l.getAttribute('href'))
            .filter(Boolean);
        return { mainContent, styles, styleLinks };
    }

    function createHiddenContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '1200px';
        container.style.background = '#ffffff';
        container.style.zIndex = '-1';
        document.body.appendChild(container);
        return container;
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pdf-export-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 0, 0, 0.35)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10000';

        overlay.innerHTML = `
            <div style="background: #ffffff; padding: 30px 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); text-align: center; max-width: 360px;">
                <h3 style="margin-bottom: 12px; color: #2B4C7E; font-size: 20px;">Preparing PDF…</h3>
                <p id="pdf-export-progress" style="margin: 0; color: #555; font-size: 15px;">Gathering pages…</p>
            </div>
        `;

        document.body.appendChild(overlay);
        return overlay;
    }

    async function renderPageIntoPDF({ url, hiddenContainer, pdf, isFirstPage, progressEl }) {
        try {
            progressEl.textContent = `Capturing ${url}…`;
            const { mainContent, styles, styleLinks } = await fetchPageContent(url);
            const clone = mainContent.cloneNode(true);

            hiddenContainer.innerHTML = '';

            if (styles) {
                const styleTag = document.createElement('style');
                styleTag.textContent = styles;
                hiddenContainer.appendChild(styleTag);
            }

            // Also include external stylesheets and wait for them to load
            const linkLoadPromises = [];
            if (styleLinks && styleLinks.length) {
                for (const href of styleLinks) {
                    const linkEl = document.createElement('link');
                    linkEl.rel = 'stylesheet';
                    linkEl.href = new URL(href, url).href;
                    const p = new Promise((resolve, reject) => {
                        linkEl.onload = resolve;
                        linkEl.onerror = resolve; // fail open to avoid stalling
                    });
                    linkLoadPromises.push(p);
                    hiddenContainer.appendChild(linkEl);
                }
            }

            clone.style.width = '100%';
            clone.style.margin = '0 auto';
            hiddenContainer.appendChild(clone);

            // Wait for next frame, stylesheets, and fonts
            await new Promise(resolve => requestAnimationFrame(resolve));
            if (linkLoadPromises.length) {
                await Promise.race([
                    Promise.all(linkLoadPromises),
                    new Promise(r => setTimeout(r, 2000)) // cap wait
                ]);
            }
            if (document.fonts && document.fonts.ready) {
                try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1000))]); } catch (e) {}
            }
            await new Promise(r => setTimeout(r, 150));

            // Guard against long-running html2canvas by timing out
            const canvas = await Promise.race([
                html2canvas(clone, {
                    scale: 1.5,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    scrollX: 0,
                    scrollY: 0
                }),
                new Promise((_, rej) => setTimeout(() => rej(new Error('html2canvas timeout')), 15000))
            ]);

            const imgData = canvas.toDataURL('image/png');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pageWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            if (!isFirstPage.value) {
                pdf.addPage();
            }
            isFirstPage.value = false;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
        } catch (error) {
            console.error('Failed to capture page:', url, error);
        }
    }

    window.exportToPDF = async function exportToPDF() {
        if (!window.html2canvas || !window.jspdf) {
            alert('Missing PDF libraries. Please ensure html2canvas and jsPDF are loaded.');
            return;
        }

        const pageList = getPageList();
        if (!pageList.length) {
            alert('No pages found to export.');
            return;
        }

        const overlay = createOverlay();
        const progressEl = overlay.querySelector('#pdf-export-progress');
        const hiddenContainer = createHiddenContainer();

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const isFirstPage = { value: true };

            for (let i = 0; i < pageList.length; i++) {
                const href = pageList[i];
                const absoluteUrl = new URL(href, window.location.origin + window.location.pathname).href;
                progressEl.textContent = `Processing ${i + 1} of ${pageList.length}`;
                await renderPageIntoPDF({
                    url: absoluteUrl,
                    hiddenContainer,
                    pdf,
                    isFirstPage,
                    progressEl
                });
            }

            progressEl.textContent = 'Finalising PDF…';
            pdf.save('hurwitz-law-group-report.pdf');
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('PDF export failed. Please check the console for details.');
        } finally {
            if (hiddenContainer && hiddenContainer.parentNode) {
                hiddenContainer.parentNode.removeChild(hiddenContainer);
            }
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }
    };
})();


