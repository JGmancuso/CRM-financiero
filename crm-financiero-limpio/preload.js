// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => {
      // Función para recibir respuestas
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      // Devuelve una función para limpiar el listener y evitar fugas de memoria
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  }
});