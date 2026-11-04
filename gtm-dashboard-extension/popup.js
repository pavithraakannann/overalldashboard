// GTM Dashboard Auto-Loader Popup Script

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateStatus();
    
    // Set up event listeners
    document.getElementById('extractBtn').addEventListener('click', extractData);
    document.getElementById('mergeBtn').addEventListener('click', mergeData);
    document.getElementById('updateDashboardBtn').addEventListener('click', updateDashboard);
    document.getElementById('autoExportToggle').addEventListener('change', toggleAutoExport);
});

// Load settings from storage
function loadSettings() {
    chrome.storage.local.get(['autoExport', 'last_updated'], (result) => {
        document.getElementById('autoExportToggle').checked = result.autoExport || false;
        
        if (result.last_updated) {
            const date = new Date(result.last_updated);
            document.getElementById('lastUpdated').textContent = date.toLocaleString();
        }
    });
}

// Update status display
function updateStatus() {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
        if (response) {
            document.getElementById('downloadedCount').textContent = response.downloadedFiles.length;
            document.getElementById('queueCount').textContent = response.processingQueue.length;
            
            // Update file list
            updateFileList(response.downloadedFiles, response.processingQueue);
        }
    });
}

// Update file list display
function updateFileList(downloadedFiles, processingQueue) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    // Show downloaded files
    downloadedFiles.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-item complete';
        item.innerHTML = `
            <span>${file.filename}</span>
            <span class="status-value success">✓</span>
        `;
        fileList.appendChild(item);
    });
    
    // Show processing queue
    processingQueue.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-item pending';
        item.innerHTML = `
            <span>${file.filename}</span>
            <span class="loading"></span>
        `;
        fileList.appendChild(item);
    });
    
    if (downloadedFiles.length === 0 && processingQueue.length === 0) {
        fileList.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No files downloaded yet</div>';
    }
}

// Extract data from current page
async function extractData() {
    const btn = document.getElementById('extractBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Extracting...';
    
    try {
        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab.url.includes('greentnmission.com')) {
            alert('Please navigate to greentnmission.com first');
            btn.disabled = false;
            btn.textContent = '📥 Extract Data from Current Page';
            return;
        }
        
        // Send message to content script
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_DATA' });
        
        if (response && response.success) {
            alert(`Extracted ${response.data.length} rows from ${response.tableCount} table(s)`);
            
            // Send to background for processing
            chrome.runtime.sendMessage({
                type: 'PROCESSED_DATA',
                data: response.data
            });
        }
        
    } catch (error) {
        console.error('Extraction error:', error);
        alert('Error extracting data: ' + error.message);
    }
    
    btn.disabled = false;
    btn.textContent = '📥 Extract Data from Current Page';
    updateStatus();
}

// Merge downloaded files
async function mergeData() {
    const btn = document.getElementById('mergeBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Merging...';
    
    try {
        chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
            if (response && response.processingQueue.length > 0) {
                chrome.runtime.sendMessage({
                    type: 'MERGE_AND_DOWNLOAD',
                    files: response.processingQueue
                }, (result) => {
                    if (result && result.success) {
                        alert(`Merged ${result.count} rows successfully!`);
                    }
                    btn.disabled = false;
                    btn.textContent = '🔀 Merge & Download CSV';
                });
            } else {
                alert('No files to merge. Please extract data first.');
                btn.disabled = false;
                btn.textContent = '🔀 Merge & Download CSV';
            }
        });
    } catch (error) {
        console.error('Merge error:', error);
        alert('Error merging files: ' + error.message);
        btn.disabled = false;
        btn.textContent = '🔀 Merge & Download CSV';
    }
}

// Update dashboard
async function updateDashboard() {
    const btn = document.getElementById('updateDashboardBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Updating...';
    
    try {
        // Read the merged.csv file
        chrome.runtime.sendMessage({ type: 'GET_STATUS' }, async (response) => {
            if (response && response.processingQueue.length > 0) {
                // Convert data to CSV format
                const allData = response.processingQueue.flatMap(f => f.data);
                const headers = Object.keys(allData[0] || {});
                const csvContent = convertToCSV(allData, headers);
                
                chrome.runtime.sendMessage({
                    type: 'UPDATE_DASHBOARD',
                    csvData: csvContent
                }, (result) => {
                    if (result && result.success) {
                        alert('Dashboard updated successfully!');
                        // Update last updated time
                        chrome.storage.local.set({ last_updated: Date.now() });
                        loadSettings();
                    } else {
                        alert('Error updating dashboard: ' + (result?.error || 'Unknown error'));
                    }
                    btn.disabled = false;
                    btn.textContent = '🔄 Update Dashboard';
                });
            } else {
                alert('No data to update. Please extract and merge data first.');
                btn.disabled = false;
                btn.textContent = '🔄 Update Dashboard';
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        alert('Error updating dashboard: ' + error.message);
        btn.disabled = false;
        btn.textContent = '🔄 Update Dashboard';
    }
}

// Toggle auto-export
function toggleAutoExport(e) {
    chrome.storage.local.set({ autoExport: e.target.checked });
}

// Convert JSON to CSV
function convertToCSV(data, headers) {
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
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
