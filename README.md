# Cursor AI Reset Tool

A desktop application to manage Cursor AI installations and reset trial periods.

## Features

- Reset Cursor AI identity to refresh trial period
- Complete uninstallation and reinstallation of Cursor AI
- System compatibility checks
- Modern and user-friendly interface
- Cross-platform support (macOS and Windows)

## Screenshots

![Cursor Reset Tool Screenshot](screenshots/app-screenshot.png)

## Installation

### macOS

Download the latest DMG file from the [Releases](https://github.com/fisapool/Cursor-AI-Reset-Tool/releases) page and drag the application to your Applications folder.

### Windows

Download the installer from the [Releases](https://github.com/fisapool/Cursor-AI-Reset-Tool/releases) page and run it to install the application.

A portable version is also available if you prefer not to install.

## Building from Source

```bash
# Clone the repository
git clone https://github.com/fisapool/Cursor-AI-Reset-Tool.git
cd Cursor-AI-Reset-Tool

# Install dependencies
npm install

# Run the application
npm start

# Build for macOS
npm run build:mac

# Build for Windows
npm run build:win
```

## Technology

This application is built with:

- Electron
- Node.js
- cursor-reset-tool npm package

## License

MIT 