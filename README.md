# Planting Dashboard

A comprehensive demo dashboard for tracking planting statistics including geotag counts, palm species data, agroforest, and sandalwood planting progress.

## Features

### 1. Geotag Planting Statistics
- **All Years Count**: Total plantings across all years
- **Current Year Count**: Plantings for the current financial year (2025-2026)
- **This Month Count**: Plantings for the current month
- **Today's Count**: Plantings completed today

### 2. Geotag Progress Overview
- **District-wise Progress Bars**: Visual progress indicators for each district
- **Pie Chart**: Distribution of geotag status (Completed, In Progress, Pending, Rejected)

### 3. Palm Species Statistics
- **Financial Year Selection**: Select from 2021-2022 to 2025-2026
- **District-wise Progress**: Track different palm species (Coconut, Areca Nut, Oil Palm, Date Palm, Palmyra)
- **Dynamic Updates**: Data updates automatically when year is changed

### 4. Agroforest & Sandalwood Statistics
- **Year-wise Data**: View data for different financial years
- **Total Geotags**: Summary of total plantings
- **Completion Percentage**: Overall completion rate
- **District-wise Progress**: Detailed progress for each district

### 5. Date Filter
- **Custom Date Range**: Filter data by selecting start and end dates
- **Apply Filter**: Update dashboard with filtered data

## Technologies Used

- **HTML5**: Structure and layout
- **Bootstrap 5.3.2**: Responsive UI framework
- **Bootstrap Icons**: Icon library
- **Chart.js 4.4.0**: Data visualization (pie chart)
- **CSS3**: Custom styling
- **JavaScript**: Interactive functionality

## How to Use

1. **Open the Dashboard**: Simply open `index.html` in a web browser
2. **View Statistics**: The dashboard displays all statistics with demo data
3. **Filter by Date**: Use the date picker in the navbar to filter data
4. **Change Years**: Use the dropdown selectors to view data for different financial years
5. **View Progress**: Progress bars show completion status for each district

## File Structure

```
overalldashboard/
├── index.html      # Main HTML file
├── styles.css      # Custom CSS styling
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

## Hosting on GitHub

### Repository: pavithraakannann/overalldashboard

Since Git is not installed on your system, follow these steps to upload via GitHub web interface:

#### Step 1: Create the Repository
1. Go to https://github.com/new
2. Repository name: `overalldashboard`
3. Make it Public (for GitHub Pages)
4. Do NOT initialize with README (we have our own)
5. Click "Create repository"

#### Step 2: Upload Files
1. On the repository page, click "uploading an existing file"
2. Drag and drop these files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. Wait for files to upload
4. Scroll to the bottom and click "Commit changes"
5. In the commit message, type: "Initial commit - Planting Dashboard"
6. Click "Commit changes"

#### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Click on "Pages" in the left sidebar
3. Under "Build and deployment", select "Source" as "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click "Save"
6. Wait 1-2 minutes for GitHub to deploy
7. Your dashboard will be available at: `https://pavithraakannann.github.io/overalldashboard/`

### Alternative: Using Git Command Line
If you install Git later, you can use these commands:

```bash
git init
git add .
git commit -m "Initial commit - Planting Dashboard"
git branch -M main
git remote add origin https://github.com/pavithraakannann/overalldashboard.git
git push -u origin main
```

## Troubleshooting GitHub Pages 404 Error

If you see a "404 Site not found" error, follow these steps:

### 1. Check if Repository Exists
- Go to: https://github.com/pavithraakannann/overalldashboard
- If you see "404 Not Found", the repository doesn't exist yet - create it first

### 2. Verify Files are Uploaded
- Make sure all 4 files are in the repository:
  - `index.html`
  - `styles.css`
  - `script.js`
  - `README.md`
- The `index.html` file MUST be in the root of the repository (not in a subfolder)

### 3. Check GitHub Pages Settings
1. Go to repository Settings → Pages
2. Verify:
   - Source is set to "Deploy from a branch"
   - Branch is "main" (or "master")
   - Folder is "/ (root)"
3. If settings look correct, click "Save" again to trigger redeployment

### 4. Wait for Deployment
- GitHub Pages takes 1-5 minutes to deploy
- Check the "Pages" section for deployment status
- Look for green checkmark indicating successful deployment

### 5. Common Issues & Fixes

**Issue: Files in wrong location**
- Make sure `index.html` is at the root level
- Don't put files in subfolders like `docs/` or `dist/`

**Issue: Wrong branch name**
- GitHub sometimes uses "master" instead of "main"
- Check your actual branch name in the repository
- Update Pages settings to match

**Issue: Repository is private**
- GitHub Pages requires public repositories for free accounts
- Make repository public in Settings

**Issue: Index file missing**
- GitHub Pages looks for `index.html` (not `Index.html` or `INDEX.html`)
- Ensure exact lowercase filename

### 6. Check Deployment Logs
1. Go to repository → Actions tab
2. Look for "pages" workflow runs
3. Click on the latest run to see error details
4. Fix any errors shown in the logs

### 7. Correct URL Format
Your dashboard URL should be:
```
https://pavithraakannann.github.io/overalldashboard/
```
NOT:
```
https://pavithraakannann.github.io/overalldashboard (without trailing slash)
```

### Still Having Issues?
1. Delete the repository and recreate it from scratch
2. Re-upload files following the steps above
3. Enable GitHub Pages again
4. Wait 2-3 minutes and try again

## Customization

To customize the dashboard with real data:

1. Replace the demo data in `script.js` with actual API calls
2. Update the data structures (palmData, agroforestData, sandalwoodData) with real values
3. Connect to your backend API for dynamic data fetching
4. Modify the UI as needed in `index.html`

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## License

This is a demo dashboard for educational purposes.
