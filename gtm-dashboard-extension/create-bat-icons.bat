@echo off
echo Creating placeholder icons...
echo.

REM Create simple colored squares using PowerShell
powershell -Command "
$size = 16
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.FillRectangle([System.Drawing.Brushes]::FromArgb(102, 126, 234), 0, 0, $size, $size)
$bitmap.Save('icons\icon16.png', [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
Write-Host 'Created icon16.png'
"

powershell -Command "
$size = 48
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.FillRectangle([System.Drawing.Brushes]::FromArgb(102, 126, 234), 0, 0, $size, $size)
$bitmap.Save('icons\icon48.png', [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
Write-Host 'Created icon48.png'
"

powershell -Command "
$size = 128
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.FillRectangle([System.Drawing.Brushes]::FromArgb(102, 126, 234), 0, 0, $size, $size)
$bitmap.Save('icons\icon128.png', [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
Write-Host 'Created icon128.png'
"

echo.
echo Icons created successfully!
pause
