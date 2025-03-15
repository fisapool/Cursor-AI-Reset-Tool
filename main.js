const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const cursorReset = require('cursor-reset-tool');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const remote = require('@electron/remote/main');

// Initialize remote module
remote.initialize();

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

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

  // Enable remote module for this window
  remote.enable(mainWindow.webContents);

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
app.whenReady().then(() => {
  createWindow();
  
  // Check for updates after app is ready
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Handle restart and install (for auto-updater)
ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'checking');
  }
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'available', info);
  }
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'not-available');
  }
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'error', err.toString());
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
  log.info(logMessage);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'progress', progressObj);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'downloaded');
    // Prompt user to install update
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'A new version has been downloaded. Restart the application to apply the updates.',
      buttons: ['Restart', 'Later']
    }).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  }
});

// Manual check for updates
ipcMain.handle('check-for-updates', async () => {
  if (process.env.NODE_ENV === 'development') {
    return { status: 'dev-mode' };
  }
  
  try {
    await autoUpdater.checkForUpdates();
    return { status: 'checking' };
  } catch (error) {
    log.error('Failed to check for updates:', error);
    return { status: 'error', message: error.toString() };
  }
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