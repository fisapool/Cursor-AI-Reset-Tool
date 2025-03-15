#!/bin/bash

# Create directories
mkdir -p assets/icons/icon.iconset

# Download a sample icon (you can replace this URL with your own icon)
curl -o assets/icons/icon.png https://raw.githubusercontent.com/getcursor/cursor/main/packages/cursor/icons/png/512x512.png

# Create different sizes for macOS icon
sips -z 16 16 assets/icons/icon.png --out assets/icons/icon.iconset/icon_16x16.png
sips -z 32 32 assets/icons/icon.png --out assets/icons/icon.iconset/icon_16x16@2x.png
sips -z 32 32 assets/icons/icon.png --out assets/icons/icon.iconset/icon_32x32.png
sips -z 64 64 assets/icons/icon.png --out assets/icons/icon.iconset/icon_32x32@2x.png
sips -z 128 128 assets/icons/icon.png --out assets/icons/icon.iconset/icon_128x128.png
sips -z 256 256 assets/icons/icon.png --out assets/icons/icon.iconset/icon_128x128@2x.png
sips -z 256 256 assets/icons/icon.png --out assets/icons/icon.iconset/icon_256x256.png
sips -z 512 512 assets/icons/icon.png --out assets/icons/icon.iconset/icon_256x256@2x.png
sips -z 512 512 assets/icons/icon.png --out assets/icons/icon.iconset/icon_512x512.png
sips -z 1024 1024 assets/icons/icon.png --out assets/icons/icon.iconset/icon_512x512@2x.png

# Convert the iconset to icns
iconutil -c icns assets/icons/icon.iconset -o assets/icons/icon.icns

echo "Icon created successfully at assets/icons/icon.icns" 