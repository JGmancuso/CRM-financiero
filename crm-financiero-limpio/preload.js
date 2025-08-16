// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Le cambiamos el nombre para que sea más claro: ahora pide los datos
  onRequestDataForQuit: (callback) => ipcRenderer.on('request-data-for-quit', callback),
  
  // NUEVA FUNCIÓN: React la usará para enviar el backup a Electron
  sendQuitData: (data) => ipcRenderer.send('quit-data', data)
});