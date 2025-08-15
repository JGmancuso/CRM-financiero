const { contextBridge, ipcRenderer } = require('electron');

// Expone funciones seguras al frontend
contextBridge.exposeInMainWorld('electronAPI', {
    loadData: () => ipcRenderer.invoke('load-data'),
    saveData: (data) => ipcRenderer.invoke('save-data', data),
});
