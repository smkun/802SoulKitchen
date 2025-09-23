@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo           Image Optimization Script
echo ===============================================

REM Navigate to project root (scripts are now in tools/scripts/)
cd /d "%~dp0..\.."

REM Set PATH to include ImageMagick and WebP tools
set "MAGICK_PATH=C:\Program Files\ImageMagick-7.1.2-Q16-HDRI"
set "WEBP_PATH=C:\Users\Owner\AppData\Local\Microsoft\WinGet\Packages\Google.Libwebp_Microsoft.Winget.Source_8wekyb3d8bbwe\libwebp-1.6.0-windows-x64\bin"
set "PATH=%MAGICK_PATH%;%WEBP_PATH%;%PATH%"

REM Create output directories
if not exist "optimized" mkdir "optimized"
if not exist "optimized\webp" mkdir "optimized\webp"
if not exist "optimized\thumbnails" mkdir "optimized\thumbnails"
if not exist "optimized\medium" mkdir "optimized\medium"

echo Creating optimized versions of your images...
echo.

REM Initialize counters
set /a processed=0
set /a original_size=0
set /a optimized_size=0

REM Process each JPG file in PHOTOS directory
for %%f in (PHOTOS\*.jpg) do (
    echo Processing: %%~nxf

    REM Get original file size
    for %%s in ("%%f") do set /a original_size+=%%~zs

    REM 1. Create optimized JPEG (85% quality, strip metadata)
    magick "%%f" -quality 85 -strip "optimized\%%~nxf"
    if !errorlevel! equ 0 (
        echo   ✓ Optimized JPEG created
        for %%s in ("optimized\%%~nxf") do set /a optimized_size+=%%~zs
    ) else (
        echo   ✗ Failed to create optimized JPEG
    )

    REM 2. Create WebP version (80% quality)
    cwebp -q 80 "%%f" -o "optimized\webp\%%~nf.webp" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   ✓ WebP version created
    ) else (
        echo   ✗ Failed to create WebP version
    )

    REM 3. Create thumbnail (300x300)
    magick "%%f" -resize 300x300^ -gravity center -extent 300x300 -quality 85 "optimized\thumbnails\%%~nxf" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   ✓ Thumbnail created
    ) else (
        echo   ✗ Failed to create thumbnail
    )

    REM 4. Create medium size (800px max width/height)
    magick "%%f" -resize 800x800^> -quality 85 "optimized\medium\%%~nxf" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   ✓ Medium size created
    ) else (
        echo   ✗ Failed to create medium size
    )

    set /a processed+=1
    echo.
)

REM Calculate space savings
set /a savings=original_size-optimized_size
set /a percent_saved=savings*100/original_size

echo ===============================================
echo                  Summary
echo ===============================================
echo Images processed: %processed%
echo Original total size: %original_size% bytes
echo Optimized total size: %optimized_size% bytes
echo Space saved: %savings% bytes (%percent_saved%%% reduction)
echo.
echo Output directories:
echo   optimized/           - Optimized JPEG files (85%% quality)
echo   optimized/webp/      - WebP versions (80%% quality)
echo   optimized/thumbnails/ - 300x300 thumbnails
echo   optimized/medium/    - 800px max dimension versions
echo ===============================================

pause