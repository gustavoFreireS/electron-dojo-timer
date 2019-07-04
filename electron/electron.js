const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
    },
    width: 300,
    height: 130,
    show: false,
    titleBarStyle: 'hiddenInset',
    alwaysOnTop: true,
  });
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    if (frameName === 'modal') {
      // open window as modal
      event.preventDefault()
      Object.assign(options, {
        parent: mainWindow,
        width: 800,
        titleBarStyle: 'native',
        height: 300,
      })
      event.newGuest = new BrowserWindow(options)
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../dist/index.html')}`);
  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.show();
  });
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});