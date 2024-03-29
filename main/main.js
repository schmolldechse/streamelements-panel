const { app, BrowserWindow, ipcMain, shell } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const appServe = app.isPackaged ? serve({
    directory: path.join(__dirname, '../out')
}) : null;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 450,
        height: 950,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, './../src/app/favicon.ico'),
    });

    if (app.isPackaged) {
        appServe(win).then(() => {
            win.loadURL('app://-');
        });
    } else {
        win.loadURL('http://localhost:3000');
        //win.webContents.openDevTools(); //not needed in production
        win.webContents.on('did-fail-load', (e, code, desc) => {
            win.webContents.reloadIgnoringCache();
        });
    }
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('open-external-link', (event, url) => {
    shell.openExternal(url);
});