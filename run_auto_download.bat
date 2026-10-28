@echo off
echo ===================================
echo Green TN Mission Auto-Download Script
echo ===================================
echo.
echo This script will:
echo 1. Login to greentnmission.com
echo 2. Download all export files
echo 3. Convert them to JSON format
echo 4. Update the dashboard data
echo.
echo Username: CMD
echo Password: cf@23
echo.
pause

echo.
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Running auto-download script...
python auto_download.py

echo.
echo ===================================
echo Process complete!
echo ===================================
echo.
echo Open summary_table.html in your browser and click "Load Data from JSON"
echo.
pause
