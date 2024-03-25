const { contextBridge, ipcRenderer, ipcMain, shell } = require('electron');

contextBridge.exposeInMainWorld('api', {
    on: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
    send: (channel, args) => {
        ipcRenderer.send(channel, args);
    },
    openLink: (url) => {
        ipcRenderer.invoke('open-external-link', url);
    }
});