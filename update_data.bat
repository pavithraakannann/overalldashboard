@echo off
echo ===================================
echo Green TN Mission Data Updater
echo ===================================
echo.
echo This script will:
echo 1. Read CSV files from Downloads folder
echo 2. Convert them to JSON format
echo 3. Update the dashboard data
echo.
echo Make sure you have these files in Downloads:
echo - planting_export_*.csv (Forest Department)
echo - coastal_habitat_export_*.csv (Coastal Habitat)
echo - other_department_export_*.csv (Other Department)
echo - plant_a_tree_export_*.csv (Plant a Tree)
echo - agriculture_dept_export_*.csv (Agriculture Department)
echo.
pause

echo.
echo Converting CSV files to JSON...
node convert_excel_to_json.js

echo.
echo ===================================
echo Data update complete!
echo ===================================
echo.
echo Open summary_table.html in your browser to view the updated data.
echo.
pause
