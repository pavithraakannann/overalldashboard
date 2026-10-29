@echo off
echo ===================================
echo Green TN Mission Auto-Download Script
echo ===================================
echo.
echo This script will:
echo 1. Login to greentnmission.com
echo 2. Download all export files
echo 3. Convert them to JSON format
echo 4. Upload to Cloudflare R2 (if configured)
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
echo Please set your R2 credentials (optional):
echo.
echo set R2_ACCESS_KEY_ID=your_access_key
echo set R2_SECRET_ACCESS_KEY=your_secret_key
echo set R2_BUCKET_NAME=your_bucket_name
echo set R2_ACCOUNT_ID=your_account_id
echo.
pause

echo.
echo Running auto-download script...
python auto_download_template.py

echo.
echo ===================================
echo Process complete!
echo ===================================
echo.
echo To deploy to Vercel:
echo 1. npm install -g vercel
echo 2. vercel login
echo 3. vercel
echo.
pause
