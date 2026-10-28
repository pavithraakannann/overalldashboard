# Tree Plantation Dashboard

A modern dark-themed dashboard for tracking tree plantation data from Green TN Mission.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Local Server**
   ```bash
   # Option 1: Using start_server.bat (Windows)
   double-click start_server.bat

   # Option 2: Using Node.js
   npx http-server -p 3000

   # Option 3: Using Python
   python -m http.server 3000
   ```

3. **Open Dashboard**
   - Main Dashboard: http://localhost:3000/index.html
   - Summary Table: http://localhost:3000/summary_table.html

## 📊 Data Management

### Loading Data

The dashboard loads data from JSON files in the following format:
- `data_forest.json` - Forest department data
- `data_other_dept.json` - Other department data
- `data_agriculture.json` - Agriculture department data
- `data_plant_atree.json` - Plant a Tree data
- `data_palm_forest.json` - Palm forest data
- `data_palm_other_dept.json` - Palm other department data

### Exporting Data from Website

1. Go to https://www.greentnmission.com/Export
2. Login with credentials
3. Export data for each section (Forest, Other Dept, Agriculture, Plant a Tree)
4. Save CSV files to Downloads folder

### Converting CSV to JSON

```bash
# Option 1: Using update_data.bat
double-click update_data.bat

# Option 2: Using Node.js
node convert_excel_to_json.js
```

### Auto-Download Script

For automated data download from the website:

```bash
# Run the auto-download script
double-click run_auto_download.bat
```

This will:
- Login to greentnmission.com
- Download all export files
- Convert them to JSON format
- Update dashboard data

## 🌐 Hosting on Vercel

### Important Note

The dashboard data files are 370+ MB and are NOT committed to git (see `.gitignore`). To host on Vercel, you need to use cloud storage for the data files.

### Option 1: Cloudflare R2 (Recommended - Free)

1. **Create Cloudflare R2 Bucket**
   - Go to Cloudflare Dashboard
   - Create R2 bucket
   - Upload all `data_*.json` files

2. **Enable Public Access**
   - Configure bucket for public access
   - Get the public URL

3. **Update Data Loading**
   - Update `summary_table_script.js` to fetch from R2 URL
   - Replace: `fetch('data_forest.json')`
   - With: `fetch('https://your-r2-url.com/data_forest.json')`

4. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

### Option 2: AWS S3

1. **Create S3 Bucket**
   - Go to AWS Console
   - Create S3 bucket
   - Upload `data_*.json` files
   - Enable public access

2. **Update Data Loading**
   - Update `summary_table_script.js` to fetch from S3 URL

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

### Option 3: GitHub Pages (Data Limitation)

GitHub Pages can host the dashboard, but:
- Data files will NOT be included (they're in .gitignore)
- You'll need to use cloud storage for data
- Only the UI code will be on GitHub Pages

To deploy to GitHub Pages:
1. Push to GitHub
2. Go to repository Settings → Pages
3. Enable GitHub Pages
4. Select main branch as source

## 📁 Project Structure

```
overalldashboard/
├── index.html                    # Main dashboard
├── summary_table.html            # Summary table page
├── script.js                     # Main dashboard logic
├── summary_table_script.js       # Summary table logic
├── styles.css                    # Dark theme styles
├── convert_excel_to_json.js      # CSV to JSON converter
├── auto_download.py              # Auto-download script
├── auto_download_template.py     # Template without credentials
├── run_auto_download.bat          # Run auto-download
├── update_data.bat               # Update data script
├── start_server.bat              # Start local server
├── vercel.json                   # Vercel configuration
├── package.json                  # Node dependencies
├── requirements.txt              # Python dependencies
├── .gitignore                    # Git ignore rules
└── data_*.json                   # Data files (not in git)
```

## 🔧 Configuration

### Environment Variables

For auto-download script:
- `GREEN_USERNAME` - Website username
- `GREEN_PASSWORD` - Website password

### District List

The dashboard supports 38 Tamil Nadu districts. Update in `summary_table_script.js` if needed.

## 🎨 Features

- Modern dark theme with animations
- District-wise data visualization
- Financial year filtering
- Date range filtering
- Species-based extraction (Silver Oak, Sandle Wood)
- Auto-download from website
- Export to Excel

## 📝 License

This project is for tracking tree plantation data from Green TN Mission.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
