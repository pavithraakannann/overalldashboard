@echo off
echo ===================================
echo Green TN Mission Auto-Download Script
echo ===================================
echo.
echo This script will:
echo 1. Login to greentnmission.com
echo 2. Download all export files
echo 3. Convert them to JSON format
echo 4. Upload to Cloudflare R2
echo 5. Update the dashboard data
echo.
pause

echo.
echo Installing Python dependencies...
pip install -r requirements.txt
pip install boto3

echo.
echo Setting environment variables...
set GREEN_USERNAME=CMD
set GREEN_PASSWORD=cf@23

echo.
echo Running auto-download script...
python auto_download.py

echo.
echo ===================================
echo Download complete!
echo ===================================
echo.
echo ===================================
echo Uploading to Cloudflare R2...
echo ===================================
echo.
echo Please set your R2 credentials:
echo.
echo set R2_ACCESS_KEY_ID=your_access_key
echo set R2_SECRET_ACCESS_KEY=your_secret_key
echo set R2_BUCKET_NAME=your_bucket_name
echo set R2_ACCOUNT_ID=your_account_id
echo.
pause

echo.
echo Uploading to R2...
python r2_upload.py

echo.
echo ===================================
echo Process complete!
echo ===================================
echo.
echo Open summary_table.html in your browser and click "Load Data from JSON"
echo Or deploy to Vercel for online access
echo.
pause
