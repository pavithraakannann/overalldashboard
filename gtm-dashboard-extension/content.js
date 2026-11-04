// GTM Dashboard Auto-Loader Content Script
// This script runs on GTM pages to extract data

let isMonitoring = false;
let downloadLinks = [];

// Monitor for download links on GTM pages
function monitorDownloadLinks() {
    if (isMonitoring) return;
    isMonitoring = true;

    console.log('GTM Auto-Loader: Monitoring for download links...');

    // Check for export/download links periodically
    const checkInterval = setInterval(() => {
        const links = document.querySelectorAll('a[href*="export"], a[href*="download"], a[href*="csv"]');
        
        links.forEach(link => {
            const url = link.href;
            if (!downloadLinks.includes(url)) {
                downloadLinks.push(url);
                console.log('GTM Auto-Loader: Found download link:', url);

                // Notify background script
                chrome.runtime.sendMessage({
                    type: 'DOWNLOAD_LINK_FOUND',
                    url: url,
                    filename: extractFilename(link)
                });
            }
        });
    }, 2000);

    // Stop monitoring after 5 minutes
    setTimeout(() => {
        clearInterval(checkInterval);
        isMonitoring = false;
    }, 300000);
}

// Extract filename from link
function extractFilename(link) {
    const text = link.textContent || link.getAttribute('download') || '';
    return text.trim() || 'export.csv';
}

// Auto-click export buttons if configured
function autoExportData() {
    chrome.storage.local.get(['autoExport'], (result) => {
        if (result.autoExport) {
            console.log('GTM Auto-Loader: Auto-export enabled');
            
            // Look for export buttons
            const exportButtons = document.querySelectorAll(
                'button[type="submit"], button.export, a.export, .btn-export'
            );
            
            exportButtons.forEach((button, index) => {
                if (button.textContent.toLowerCase().includes('export')) {
                    console.log(`GTM Auto-Loader: Found export button ${index + 1}`);
                    // Don't auto-click to avoid unwanted downloads
                    // User can manually click or use popup
                }
            });
        }
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'EXTRACT_DATA') {
        console.log('GTM Auto-Loader: Extracting data...');
        extractTableData().then(sendResponse);
        return true; // Keep message channel open for async response
    }
    
    if (request.type === 'START_MONITORING') {
        monitorDownloadLinks();
        sendResponse({ success: true });
    }
    
    if (request.type === 'GET_DOWNLOAD_LINKS') {
        sendResponse({ links: downloadLinks });
    }
});

// Extract table data from GTM page
async function extractTableData() {
    const tables = document.querySelectorAll('table');
    const data = [];

    tables.forEach((table, tableIndex) => {
        const rows = table.querySelectorAll('tr');
        const headers = [];

        // Extract headers
        const headerRow = rows[0];
        if (headerRow) {
            headerRow.querySelectorAll('th, td').forEach(cell => {
                headers.push(cell.textContent.trim());
            });
        }

        // Extract data rows
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td');
            const rowData = {};

            cells.forEach((cell, cellIndex) => {
                if (headers[cellIndex]) {
                    rowData[headers[cellIndex]] = cell.textContent.trim();
                }
            });

            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        }
    });

    return { success: true, data: data, tableCount: tables.length };
}

// Start monitoring when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            monitorDownloadLinks();
            autoExportData();
        }, 3000);
    });
} else {
    setTimeout(() => {
        monitorDownloadLinks();
        autoExportData();
    }, 3000);
}
