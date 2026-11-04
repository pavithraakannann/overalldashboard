# GTM Dashboard Auto-Loader - Installation Guide

## Quick Start

### Step 1: Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in top-right corner)
4. Click **Load unpacked** button
5. Select the folder: `C:\Users\LENOVO\Desktop\pavi\overalldashboard\gtm-dashboard-extension`
6. Extension should now appear in your extensions list with a purple icon

### Step 2: Use the Extension

1. **Login to GTM**: Go to https://greentnmission.com and login with your credentials
2. **Open Extension**: Click the extension icon in your Chrome toolbar
3. **Extract Data**:
   - Navigate to any data page on GTM
   - Click "Extract Data from Current Page" in the extension popup
   - The extension will pull table data from the page
4. **Merge Files**:
   - After extracting data from multiple pages
   - Click "Merge & Download CSV" to combine all data
   - A `merged.csv` file will be downloaded
5. **Update Dashboard**:
   - Copy the downloaded `merged.csv` to your dashboard folder
   - The dashboard will automatically load from this file

## Features

### Auto-Export Mode
- Enable "Auto-export on page load" in the extension popup
- The extension will automatically monitor for download links
- Files are downloaded and processed automatically

### Status Monitoring
- See how many files have been downloaded
- View processing queue status
- Track last update time

## How It Works

1. **Content Script** runs on GTM pages and:
   - Monitors for download/export links
   - Extracts table data from pages
   - Sends data to background script

2. **Background Script** handles:
   - File downloads
   - CSV parsing and processing
   - Merging multiple files
   - Data storage

3. **Popup UI** provides:
   - Manual controls for data extraction
   - Status display
   - Configuration options

## File Locations

After installation:
- Extension files: `C:\Users\LENOVO\Desktop\pavi\overalldashboard\gtm-dashboard-extension\`
- Downloaded files: Your default Downloads folder (`gtm_data/` subfolder)
- Merged CSV: Downloads folder as `merged.csv`

## Troubleshooting

### Extension not loading
- Make sure Developer Mode is enabled
- Verify you selected the correct folder
- Check that all files exist in the folder

### Data not extracting
- Ensure you're on greentnmission.com
- Make sure you're logged in
- Try refreshing the page
- Check browser console for errors (F12)

### Files not merging
- Ensure at least one file has been extracted
- Check the processing queue in the popup
- Try extracting data again

### Icons look like purple squares
- The current icons are placeholders
- You can replace them with better icons:
  - Download tree icons from flaticon.com
  - Resize to 16x16, 48x48, 128x128
  - Save as PNG in the `icons/` folder

## Advanced Usage

### Manual Data Processing

If automatic extraction doesn't work:

1. Export data manually from GTM
2. Save CSV files to your Downloads folder
3. The extension will detect and process them
4. Use "Merge & Download CSV" to combine

### Integration with Dashboard

The extension generates `merged.csv` compatible with your dashboard:

1. After merging, download `merged.csv`
2. Place it in: `C:\Users\LENOVO\Desktop\pavi\overalldashboard\merged.csv`
3. Open your dashboard (index.html)
4. Data will load automatically from the CSV

## Security & Privacy

- Extension only accesses greentnmission.com
- All data is stored locally in Chrome
- No data is sent to external servers
- Downloads go to your default Downloads folder

## Updates

To update the extension:

1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Changes apply immediately

## Support

For issues or questions:
- Check the README.md in the extension folder
- Review browser console for error messages
- Ensure all permissions are granted

## File Structure

```
gtm-dashboard-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js             # Content script for GTM pages
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── create-icons-base64.js # Icon generator
├── README.md             # Documentation
└── INSTALL.md            # This file
```
