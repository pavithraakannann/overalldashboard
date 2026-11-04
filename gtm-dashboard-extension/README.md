# GTM Dashboard Auto-Loader Chrome Extension

A Chrome extension that automatically loads data from Green Tamil Mission (GTM) website and updates your dashboard.

## Features

- 🌳 **Auto-detects download links** on GTM website
- 📥 **Extracts table data** from GTM pages
- 🔀 **Merges multiple CSV files** into a single merged.csv
- 🔄 **Updates dashboard** with latest data
- ⚙️ **Configurable auto-export** option

## Installation

### Step 1: Generate Icons

1. Open `create-icons.html` in your browser
2. Click the download buttons for each icon size
3. Save the downloaded files to the `icons/` folder:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `gtm-dashboard-extension` folder
5. The extension should now appear in your extensions list

## Usage

### Basic Workflow

1. **Login to GTM**: Navigate to https://greentnmission.com and login
2. **Open Extension**: Click the extension icon in Chrome toolbar
3. **Extract Data**: Click "Extract Data from Current Page" to pull data from the page
4. **Merge Files**: Click "Merge & Download CSV" to combine all extracted data
5. **Update Dashboard**: Click "Update Dashboard" to sync data with your dashboard

### Auto-Export Mode

1. Enable "Auto-export on page load" in the extension popup
2. The extension will automatically monitor for download links when you visit GTM
3. Files will be downloaded and processed automatically

## How It Works

### Content Script (`content.js`)
- Runs on GTM pages
- Monitors for download/export links
- Extracts table data from pages
- Communicates with background script

### Background Script (`background.js`)
- Handles file downloads
- Processes CSV data
- Merges multiple files
- Stores data in Chrome storage

### Popup (`popup.html` & `popup.js`)
- User interface for the extension
- Shows download status
- Provides manual controls
- Configures settings

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
├── create-icons.html      # Icon generator
└── README.md             # This file
```

## Integration with Dashboard

The extension generates a `merged.csv` file that can be used with your dashboard:

1. After merging files, download the `merged.csv`
2. Place it in your dashboard project directory
3. The dashboard will automatically load from this file

## Troubleshooting

### Extension not loading
- Make sure Developer mode is enabled in Chrome
- Check that all files are in the correct folder
- Verify icons exist in the `icons/` folder

### Data not extracting
- Make sure you're on greentnmission.com
- Check that you're logged in
- Try refreshing the page

### Files not merging
- Ensure at least one file has been extracted
- Check the processing queue in the popup
- Try extracting data again

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on your extension card
4. Changes will be applied immediately

## Security

- The extension only accesses greentnmission.com
- Data is stored locally in Chrome storage
- No data is sent to external servers
- Downloads are saved to your default Downloads folder

## License

This extension is part of the GTM Dashboard project.
