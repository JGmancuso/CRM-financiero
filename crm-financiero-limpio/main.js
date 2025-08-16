// main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let isQuitting = false; // La bandera para controlar el cierre

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  const startUrl = 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  mainWindow.on('close', (e) => {
    // Si ya estamos en proceso de cierre, no hacemos nada más.
    if (isQuitting) {
      return;
    }
    
    e.preventDefault();
    
    // IMPORTANTE: Activamos la bandera aquí, ANTES de hacer nada más.
    isQuitting = true;
    
    mainWindow.webContents.send('request-data-for-quit');
  });
}

ipcMain.on('quit-data', (event, data) => {
  const documentsPath = app.getPath('documents');
  const backupDir = path.join(documentsPath, 'CRM Backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const date = new Date();
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const filePath = path.join(backupDir, `crm_backup_${dateString}.json`);

  try {
    fs.writeFileSync(filePath, data, 'utf-8');
    console.log('Backup guardado exitosamente en:', filePath);
  } catch (err) {
    console.error('Falló el guardado del backup:', err);
  }
  
  // Ahora que el guardado terminó, podemos cerrar la app con seguridad.
  app.quit();
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});