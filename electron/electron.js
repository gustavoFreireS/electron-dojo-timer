const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;
const createMenu = () => {
  const application = {
    label: 'Application',
    submenu: [
      {
        label: 'About Application',
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          electron.app.quit();
        },
      },
    ],
  };

  const edit = {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
      },
    ],
  };

  const template = [application, edit];

  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
};
global.sharedObject = { testPath: '', testCommand: '' };
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      webSecurity: false,
    },
    width: 300,
    height: 150,
    show: false,
    titleBarStyle: 'hiddenInset',
    alwaysOnTop: true,
  });
  mainWindow.webContents.on(
    'new-window',
    (event, url, frameName, disposition, options, additionalFeatures) => {
      if (frameName === 'modal') {
        // open window as modal
        event.preventDefault();
        Object.assign(options, {
          parent: mainWindow,
          width: 800,
          titleBarStyle: 'native',
          height: 300,
          webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true,
            webSecurity: false,
          },
        });
        event.newGuest = new BrowserWindow(options);
      }
    },
  );
  mainWindow.loadURL(
    isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../dist/index.html')}`,
  );
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

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
