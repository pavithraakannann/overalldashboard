# Setup Guide: Deploy Dashboard with Cloudflare R2

This guide will help you set up the dashboard to work online with Cloudflare R2 for data storage and Vercel for hosting.

## Prerequisites

- Cloudflare account (free)
- GitHub account (for Vercel)
- Vercel account (free)
- Python installed on your computer

## Step 1: Set Up Cloudflare R2

### 1.1 Create R2 Bucket
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** → **Create Bucket**
3. Enter bucket name (e.g., `planting-dashboard-data`)
4. Click **Create Bucket**

### 1.2 Get R2 API Credentials
1. In Cloudflare Dashboard, go to **R2** → **Manage R2 API Tokens**
2. Click **Create API Token**
3. Give it a name (e.g., `dashboard-upload`)
4. Select **Edit** permissions
5. Click **Create API Token**
6. Copy the following:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (shown in R2 dashboard URL)

### 1.3 Enable Public Access
1. Go to your bucket in R2
2. Click **Settings**
3. Scroll to **Public Access**
4. Turn on **Allow List** (or set to public)
5. Note your public URL format: `https://YOUR_BUCKET_NAME.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com`

## Step 2: Configure Dashboard

### 2.1 Update r2_config.js
Open `r2_config.js` and update the values:

```javascript
const R2_CONFIG = {
    accountId: 'YOUR_ACCOUNT_ID',      // From step 1.2
    bucketName: 'YOUR_BUCKET_NAME',      // From step 1.1
    publicUrl: 'https://YOUR_BUCKET_NAME.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com'
};
```

Replace:
- `YOUR_ACCOUNT_ID` with your actual Account ID
- `YOUR_BUCKET_NAME` with your actual bucket name

### 2.2 Test Local R2 Upload
1. Open Command Prompt in the overalldashboard folder
2. Set your R2 credentials:
   ```bash
   set R2_ACCESS_KEY_ID=your_access_key
   set R2_SECRET_ACCESS_KEY=your_secret_key
   set R2_BUCKET_NAME=your_bucket_name
   set R2_ACCOUNT_ID=your_account_id
   ```
3. Run:
   ```bash
   upload_to_r2.bat
   ```
4. This will upload all `data_*.json` files to R2

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Deploy
```bash
cd C:\Users\LENOVO\Desktop\pavi\overalldashboard
vercel
```

Follow the prompts:
- Link to your GitHub repository
- Select framework: "Other"
- Build command: (leave empty)
- Output directory: (leave empty)

### 3.4 Get Your URL
After deployment, Vercel will give you a URL like:
```
https://overalldashboard.vercel.app
```

This is your shareable link!

## Step 4: Update Data Workflow

### Option A: Manual Export + Upload
1. Export data from greentnmission.com
2. Save CSV files to Downloads folder
3. Run `update_data.bat` to convert to JSON
4. Run `upload_to_r2.bat` to upload to R2
5. Refresh Vercel URL → Data loads from R2

### Option B: Automatic Download + Upload
1. Set R2 credentials in `run_auto_download.bat`
2. Double-click `run_auto_download.bat`
3. Script will:
   - Download from website
   - Convert to JSON
   - Upload to R2
4. Refresh Vercel URL → Data loads from R2

## Step 5: Share with Users

Share your Vercel URL with other users:
- They open the link
- Dashboard loads data from R2
- They see the current data from the website
- No local setup needed for them

## Important Notes

- **Data files are NOT in git** - they're in `.gitignore`
- **Only UI code is on Vercel** - data is on Cloudflare R2
- **R2 is free** - no egress fees, great for static data
- **Update data by running** `run_auto_download.bat` or manual export

## Troubleshooting

### Data not loading on Vercel?
- Check `r2_config.js` has correct values
- Verify R2 bucket is set to public access
- Check browser console for errors
- Ensure data files are uploaded to R2

### Upload to R2 failing?
- Verify R2 credentials are correct
- Check bucket name matches
- Ensure Account ID is correct
- Check internet connection

### Dashboard shows 0?
- Ensure data files are uploaded to R2
- Check R2 public URL is correct
- Verify files exist in R2 bucket

## Quick Reference

**Files to modify:**
- `r2_config.js` - Update with your R2 credentials
- `run_auto_download.bat` - Set R2 credentials here for automation

**Scripts to run:**
- `update_data.bat` - Convert CSV to JSON
- `upload_to_r2.bat` - Upload JSON to R2
- `run_auto_download.bat` - Download + Convert + Upload (all in one)

**URLs you'll need:**
- Vercel dashboard URL: `https://your-app.vercel.app`
- R2 public URL: `https://your-bucket.account-id.r2.cloudflarestorage.com`
