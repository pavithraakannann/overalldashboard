@echo off
echo Checking git status...
git status

echo.
echo Adding all changes...
git add .

echo.
echo Creating commit...
git commit -m "Auto-commit: Dashboard updates on %date% %time%"

echo.
echo Pushing to remote...
git push

echo.
echo Done!
pause
