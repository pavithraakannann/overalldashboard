// GTM Dashboard Auto-Loader Background Script
// Handles data processing and file management

let downloadedFiles = [];
let processingQueue = [];

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'DOWNLOAD_LINK_FOUND') {
        console.log('Background: Download link found:', request.url);
        handleDownloadLink(request.url, request.filename);
        sendResponse({ success: true });
    }
    
    if (request.type === 'PROCESSED_DATA') {
        console.log('Background: Received processed data');
        saveProcessedData(request.data);
        sendResponse({ success: true });
    }
    
    if (request.type === 'GET_STATUS') {
        sendResponse({
            downloadedFiles: downloadedFiles,
            processingQueue: processingQueue
        });
    }
    
    if (request.type === 'MERGE_AND_DOWNLOAD') {
        mergeAndDownloadCSV(request.files).then(sendResponse);
        return true; // Keep message channel open
    }
    
    if (request.type === 'UPDATE_DASHBOARD') {
        updateDashboardData(request.csvData).then(sendResponse);
        return true;
    }
});

// Handle download links
function handleDownloadLink(url, filename) {
    // Download the file
    chrome.downloads.download({
        url: url,
        filename: `gtm_data/${filename}`,
        saveAs: false
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error('Download error:', chrome.runtime.lastError);
        } else {
            console.log('Download started:', downloadId);
            downloadedFiles.push({
                id: downloadId,
                filename: filename,
                url: url,
                timestamp: Date.now()
            });
            
            // Notify user
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'GTM Auto-Loader',
                message: `Downloaded: ${filename}`
            });
        }
    });
}

// Monitor download completion
chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state && delta.state.current === 'complete') {
        const file = downloadedFiles.find(f => f.id === delta.id);
        if (file) {
            console.log('Download complete:', file.filename);
            // Process the file
            processDownloadedFile(file);
        }
    }
});

// Process downloaded file
async function processDownloadedFile(file) {
    try {
        // Get file content
        const fileUrl = await getFileUrl(file.id);
        const response = await fetch(fileUrl);
        const csvText = await response.text();
        
        // Parse CSV
        const data = parseCSV(csvText);
        
        // Add to processing queue
        processingQueue.push({
            filename: file.filename,
            data: data,
            timestamp: Date.now()
        });
        
        console.log('File processed:', file.filename, 'Rows:', data.length);
        
        // Check if all expected files are downloaded
        checkAllFilesDownloaded();
        
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

// Get file URL from download ID
function getFileUrl(downloadId) {
    return new Promise((resolve, reject) => {
        chrome.downloads.search({ id: downloadId }, (results) => {
            if (results && results.length > 0) {
                resolve(results[0].filename);
            } else {
                reject(new Error('File not found'));
            }
        });
    });
}

// Parse CSV to JSON
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) continue;

        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
    }

    return data;
}

// Parse CSV line (handles quoted values)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Check if all expected files are downloaded
function checkAllFilesDownloaded() {
    chrome.storage.local.get(['expectedFiles'], (result) => {
        const expectedFiles = result.expectedFiles || [
            'planting_export',
            'other_department_export',
            'agriculture_export',
            'plant_atree_export',
            'palm_forest_export',
            'palm_other_dept_export'
        ];
        
        const downloadedFilenames = processingQueue.map(f => f.filename);
        const allDownloaded = expectedFiles.every(expected => 
            downloadedFilenames.some(downloaded => downloaded.includes(expected))
        );
        
        if (allDownloaded && processingQueue.length >= expectedFiles.length) {
            console.log('All files downloaded, ready to merge');
            mergeAndDownloadCSV(processingQueue);
        }
    });
}

// Merge multiple CSV files
async function mergeAndDownloadCSV(files) {
    console.log('Merging CSV files...');
    
    let mergedData = [];
    let headers = [];
    
    files.forEach((file, index) => {
        if (index === 0) {
            headers = Object.keys(file.data[0] || {});
            mergedData = file.data;
        } else {
            // Append data (assuming same headers)
            mergedData = mergedData.concat(file.data);
        }
    });
    
    // Convert back to CSV
    const csvContent = convertToCSV(mergedData, headers);
    
    // Download merged file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
        url: url,
        filename: 'merged.csv',
        saveAs: true
    }, (downloadId) => {
        console.log('Merged CSV downloaded:', downloadId);
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'GTM Auto-Loader',
            message: 'Merged CSV file downloaded successfully!'
        });
    });
    
    return { success: true, count: mergedData.length };
}

// Convert JSON data to CSV
function convertToCSV(data, headers) {
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape quotes and wrap in quotes if contains comma
            const escaped = String(value).replace(/"/g, '""');
            if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')) {
                return `"${escaped}"`;
            }
            return escaped;
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

// Update dashboard data
async function updateDashboardData(csvData) {
    try {
        // Store in chrome.storage.local
        await chrome.storage.local.set({
            'gtm_dashboard_data': csvData,
            'last_updated': Date.now()
        });
        
        console.log('Dashboard data updated');
        
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'GTM Auto-Loader',
            message: 'Dashboard data updated successfully!'
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error updating dashboard:', error);
        return { success: false, error: error.message };
    }
}

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
    console.log('GTM Dashboard Auto-Loader installed');
    
    // Set default settings
    chrome.storage.local.set({
        autoExport: false,
        expectedFiles: [
            'planting_export',
            'other_department_export',
            'agriculture_export',
            'plant_atree_export',
            'palm_forest_export',
            'palm_other_dept_export'
        ]
    });
});
