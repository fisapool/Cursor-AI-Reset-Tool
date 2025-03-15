#!/bin/bash

# Create directories
mkdir -p assets/icons

# Download a sample icon (you can replace this URL with your own icon)
curl -o assets/icons/icon.png https://raw.githubusercontent.com/getcursor/cursor/main/packages/cursor/icons/png/512x512.png

# For Windows, we need to create an .ico file
# This requires ImageMagick to be installed
# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "Creating Windows icon using ImageMagick..."
    
    # Create a multi-resolution ICO file
    convert assets/icons/icon.png -define icon:auto-resize=16,24,32,48,64,128,256 assets/icons/icon.ico
    
    echo "Windows icon created successfully at assets/icons/icon.ico"
else
    echo "ImageMagick is not installed. Cannot create Windows icon."
    echo "To install ImageMagick on macOS, run: brew install imagemagick"
    echo "To install ImageMagick on Windows, download from: https://imagemagick.org/script/download.php"
    
    # Create an empty file as a placeholder
    touch assets/icons/icon.ico
fi 