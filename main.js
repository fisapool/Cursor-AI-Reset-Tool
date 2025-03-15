const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const cursorReset = require('cursor-reset-tool');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icons/icon.png')
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');

  // Open DevTools in development mode
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// IPC handlers for communication with renderer process

// Check system requirements
ipcMain.handle('check-system', async () => {
  try {
    const systemInfo = await cursorReset.systemCheck.checkSystem();
    return systemInfo;
  } catch (error) {
    return { error: error.message, passed: false };
  }
});

// Reset ID only
ipcMain.handle('reset-id', async () => {
  try {
    const result = await cursorReset.idModifier.resetCursorId();
    return { success: result };
  } catch (error) {
    return { error: error.message };
  }
});

// Install Cursor
ipcMain.handle('install-cursor', async () => {
  try {
    const result = await cursorReset.install.installCursor();
    return { success: result };
  } catch (error) {
    return { error: error.message };
  }
});

// Uninstall Cursor
ipcMain.handle('uninstall-cursor', async () => {
  try {
    const result = await cursorReset.uninstall.uninstallCursor();
    return { success: result };
  } catch (error) {
    return { error: error.message };
  }
});

// Full reset
ipcMain.handle('full-reset', async () => {
  try {
    // Check system
    const systemInfo = await cursorReset.systemCheck.checkSystem();
    if (!systemInfo.passed) {
      return { error: systemInfo.error, passed: false };
    }
    
    // Uninstall
    await cursorReset.uninstall.uninstallCursor();
    
    // Install
    const installSuccess = await cursorReset.install.installCursor();
    if (!installSuccess) {
      return { error: 'Installation failed', success: false };
    }
    
    // Reset ID
    const resetSuccess = await cursorReset.idModifier.resetCursorId();
    
    return { success: resetSuccess };
  } catch (error) {
    return { error: error.message };
  }
}); 