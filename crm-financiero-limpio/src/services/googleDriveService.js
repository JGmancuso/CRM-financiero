// src/services/googleDriveService.js

const GRANDPARENT_FOLDER_NAME = "EdgeCapital"; // 1. Carpeta de primer nivel
const PARENT_FOLDER_NAME = "Empresas";       // 2. Carpeta de segundo nivel

let empresasFolderIdCache = null; // Guardamos el ID de la carpeta "Empresas" para ser más eficientes

/**
 * Busca una carpeta por nombre DENTRO de una carpeta padre específica.
 * @param {string} folderName - El nombre de la carpeta a buscar.
 * @param {string|null} parentId - ID de la carpeta padre. Si es null, busca en "Mi Unidad".
 * @returns {Promise<string|null>} El ID de la carpeta si se encuentra.
 */
async function findFolder(folderName, parentId = null) {
    let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    // Si se especifica un padre, la búsqueda es DENTRO de esa carpeta.
    // Si no, 'root' significa que la búsqueda es en "Mi Unidad".
    query += ` and '${parentId || 'root'}' in parents`;

    try {
        const response = await window.gapi.client.drive.files.list({
            q: query,
            fields: 'files(id, name)',
        });
        const files = response.result.files;
        if (files && files.length > 0) {
            console.log(`Carpeta encontrada: "${folderName}" con ID: ${files[0].id}`);
            return files[0].id;
        }
        console.warn(`Carpeta NO encontrada: "${folderName}"`);
        return null;
    } catch (error) {
        console.error(`Error crítico al buscar la carpeta "${folderName}":`, error);
        alert("Error al comunicarse con Google Drive. Revisa la consola.");
        return null;
    }
}

/**
 * Crea una nueva carpeta dentro de una carpeta padre.
 * @param {string} folderName - Nombre de la nueva carpeta.
 * @param {string} parentId - ID de la carpeta donde se creará.
 * @returns {Promise<string|null>} El ID de la carpeta creada.
 */
async function createFolder(folderName, parentId) {
    try {
        const resource = { name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] };
        const response = await window.gapi.client.drive.files.create({ resource, fields: 'id' });
        console.log(`Carpeta creada: "${folderName}", ID: ${response.result.id}`);
        return response.result.id;
    } catch (error) {
        console.error(`Error al crear la carpeta "${folderName}":`, error);
        return null;
    }
}

/**
 * Obtiene el ID de la carpeta "Empresas" que está dentro de "EdgeCapital".
 * @returns {Promise<string|null>} El ID de la carpeta "Empresas".
 */
async function getEmpresasFolderId() {
    if (empresasFolderIdCache) return empresasFolderIdCache;

    // 1. Busca la carpeta "EdgeCapital" en "Mi Unidad"
    const grandParentId = await findFolder(GRANDPARENT_FOLDER_NAME);
    if (!grandParentId) {
        console.error(`La carpeta raíz "${GRANDPARENT_FOLDER_NAME}" no existe en "Mi Unidad".`);
        alert(`Error: La carpeta "${GRANDPARENT_FOLDER_NAME}" no fue encontrada en tu Google Drive.`);
        return null;
    }

    // 2. Busca la carpeta "Empresas" DENTRO de "EdgeCapital"
    const parentId = await findFolder(PARENT_FOLDER_NAME, grandParentId);
    if (!parentId) {
        console.error(`La carpeta "${PARENT_FOLDER_NAME}" no existe dentro de "${GRANDPARENT_FOLDER_NAME}".`);
        alert(`Error: La carpeta "${PARENT_FOLDER_NAME}" no fue encontrada dentro de "${GRANDPARENT_FOLDER_NAME}".`);
        return null;
    }
    
    empresasFolderIdCache = parentId;
    return parentId;
}

/**
 * Busca o crea la carpeta de un cliente DENTRO de la ruta especificada.
 * @param {string} clientName - El nombre del cliente.
 * @returns {Promise<string|null>} El ID de la carpeta del cliente.
 */
export const getOrCreateClientFolder = async (clientName) => {
    const parentFolderId = await getEmpresasFolderId();
    if (!parentFolderId) return null;

    let clientFolderId = await findFolder(clientName, parentFolderId);
    if (!clientFolderId) {
        console.log(`Creando carpeta para '${clientName}'...`);
        clientFolderId = await createFolder(clientName, parentFolderId);
    }
    
    return clientFolderId;
};

/**
 * Convierte un objeto File a una cadena Base64.
 * @param {File} file El archivo a convertir.
 * @returns {Promise<string>} La cadena Base64 del contenido del archivo.
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Extraemos solo la parte de Base64
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

/**
 * Sube un archivo a una carpeta específica, usando el método de Base64.
 * @param {File} file - El archivo original.
 * @param {string} customName - El nuevo nombre para el archivo.
 * @param {string} folderId - El ID de la carpeta de destino.
 * @returns {Promise<object|null>}
 */
export const uploadDocumentToFolder = async (file, customName, folderId) => {
    try {
        const base64Content = await fileToBase64(file);
        
        const metadata = {
            name: customName || file.name,
            parents: [folderId],
        };
        
        const boundary = '-------314159265358979323846';
        const delimiter = `\r\n--${boundary}\r\n`;
        const close_delim = `\r\n--${boundary}--`;

        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + file.type + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Content +
            close_delim;

        const response = await window.gapi.client.request({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params: { uploadType: 'multipart' },
            headers: {
                'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartRequestBody,
        });

        console.log("Archivo subido con éxito:", response.result);
        return response.result;
    } catch (error) {
        console.error("Error al subir archivo:", error);
        alert("Error al subir el archivo. Revisa la consola para más detalles.");
        return null;
    }
};

/**
 * Lista todos los archivos dentro de una carpeta específica.
 * @param {string} folderId - El ID de la carpeta.
 * @returns {Promise<Array|null>} Una lista de archivos.
 */
export const listFilesInFolder = async (folderId) => {
    if (!folderId) return [];
    try {
        const response = await window.gapi.client.drive.files.list({
            q: `'${folderId}' in parents and trashed=false`,
            fields: 'files(id, name, webViewLink, createdTime)',
            orderBy: 'createdTime desc',
        });
        return response.result.files;
    } catch (error) { console.error("Error al listar archivos:", error); return []; }
};
/**
 * Busca un archivo por nombre DENTRO de una carpeta específica.
 * @param {string} fileName - El nombre del archivo a buscar.
 * @param {string} folderId - El ID de la carpeta donde buscar.
 * @returns {Promise<boolean>} Devuelve true si el archivo existe, false si no.
 */
export async function findFile(fileName, folderId) {
    if (!folderId) return false;
    try {
        const q = `'${folderId}' in parents and name = '${fileName}' and trashed = false`;
        const response = await window.gapi.client.drive.files.list({
            q: q,
            fields: 'files(id)',
        });
        return response.result.files.length > 0;
    } catch (error) {
        console.error("Error al buscar el archivo:", error);
        return false; // Asumimos que no existe si hay un error
    }
}
/**
 * Elimina un archivo de Google Drive por su ID.
 * @param {string} fileId - El ID del archivo a eliminar.
 * @returns {Promise<boolean>} Devuelve true si la eliminación fue exitosa.
 */
export const deleteFile = async (fileId) => {
    try {
        await window.gapi.client.drive.files.delete({
            fileId: fileId,
        });
        console.log(`Archivo con ID ${fileId} eliminado con éxito.`);
        return true;
    } catch (error) {
        console.error("Error al eliminar el archivo:", error);
        return false;
    }
};
