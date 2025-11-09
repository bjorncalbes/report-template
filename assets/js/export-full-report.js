(function () {
    const REPORT_PAGES = [
        'page1.html', 'page2.html', 'page3.html', 'page4.html', 'page5.html', 'page6.html',
        'page7.html', 'page8.html', 'page9.html', 'page10.html', 'page11.html', 'page12.html',
        'page13.html', 'page14.html', 'page15.html', 'page16.html', 'page17.html', 'page18.html'
    ];

    function resolvePagesOverride(pagesOverride) {
        if (Array.isArray(pagesOverride) && pagesOverride.length) {
            return pagesOverride;
        }
        return REPORT_PAGES;
    }

    window.exportFullReport = function exportFullReport(event, pagesOverride) {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }

        const pages = resolvePagesOverride(pagesOverride);

        if (typeof window.exportToPDF === 'function') {
            window.exportToPDF(pages);
        } else {
            alert('PDF exporter script is missing. Please ensure assets/js/pdf-export.js is loaded.');
        }

        return false;
    };

    window.FULL_REPORT_PAGES = REPORT_PAGES;
})();
