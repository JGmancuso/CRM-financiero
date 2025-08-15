const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Define la ruta donde se guardará la base de datos de forma segura
const userDataPath = app.getPath('userData');
const dbFolderPath = path.join(userDataPath, 'crm-data');
const dbPath = path.join(dbFolderPath, 'database.json');

// Asegurarse de que el directorio de la base de datos exista
if (!fs.existsSync(dbFolderPath)) {
    fs.mkdirSync(dbFolderPath);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // --- CORRECCIÓN ---
    // Carga la URL del servidor de desarrollo de React cuando no está empaquetado.
    // Carga el archivo build/index.html cuando es una aplicación instalada.
    if (!app.isPackaged) {
        win.loadURL('http://localhost:3000');
        // Abre las herramientas de desarrollador automáticamente en modo de desarrollo
        win.webContents.openDevTools();
    } else {
        win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
    }
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- API para interactuar con el sistema de archivos ---

ipcMain.handle('load-data', async () => {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
        return null; // No hay archivo guardado
    } catch (error) {
        console.error('Failed to load data:', error);
        return null;
    }
});

ipcMain.handle('save-data', async (event, data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return { success: true, path: dbPath };
    } catch (error) {
        console.error('Failed to save data:', error);
        return { success: false, error: error.message };
    }
});
