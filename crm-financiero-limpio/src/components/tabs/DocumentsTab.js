import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGoogle } from '../../context/GoogleClientContext';
import { getOrCreateClientFolder, uploadDocumentToFolder, listFilesInFolder, findFile, deleteFile } from '../../services/googleDriveService';
import { DOCUMENT_CATEGORIES } from '../../data';
import { UploadCloud, FileText, Download } from 'lucide-react';

export default function DocumentsTab({ client }) {
    const { isSignedIn } = useGoogle();
    const [uploading, setUploading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [fileToUpload, setFileToUpload] = useState(null);
    const [customFileName, setCustomFileName] = useState('');
    const [category, setCategory] = useState('CREDITO');
    const [clientFiles, setClientFiles] = useState([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(true);
    const fileInputRef = useRef(null); // Referencia al input de archivo

    const fetchClientFiles = useCallback(async () => {
        if (!isSignedIn || !client) return;
        setIsLoadingFiles(true);
        const folderId = await getOrCreateClientFolder(client.nombre || client.name);
        if (folderId) {
            const files = await listFilesInFolder(folderId);
            setClientFiles(files || []);
        }
        setIsLoadingFiles(false);
    }, [isSignedIn, client]);

    useEffect(() => { fetchClientFiles(); }, [fetchClientFiles]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileToUpload(file);
            setCustomFileName(file.name.replace(/\.[^/.]+$/, ""));
            setFeedback(''); // Limpia mensajes anteriores
        }
    };

    const resetForm = () => {
        setFileToUpload(null);
        setCustomFileName('');
        // Resetea el valor del input para permitir subir el mismo archivo de nuevo
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!fileToUpload) return alert("Por favor, selecciona un archivo.");
        setUploading(true);
        // 👇 3. Construimos el nombre del archivo con la categoría
        const finalFileName = `[${category}] - ${customFileName}.${fileToUpload.name.split('.').pop()}`;
        setFeedback(`Subiendo "${finalFileName}"...`);

        try {
            const folderId = await getOrCreateClientFolder(client.nombre || client.name);
            if (folderId) {
                const fileExists = await findFile(finalFileName, folderId);
                if (fileExists) {
                    if (!window.confirm(`Un archivo llamado "${finalFileName}" ya existe. ¿Deseas sobreescribirlo?`)) {
                        setUploading(false);
                        setFeedback("Subida cancelada.");
                        resetForm();
                        return;
                    }
                }
                
                const result = await uploadDocumentToFolder(fileToUpload, finalFileName, folderId);
                if (result) {
                    setFeedback(`¡Archivo "${result.name}" subido con éxito!`);
                    resetForm();
                    fetchClientFiles(); // Actualiza la lista
                } else {
                    setFeedback("Error al subir el archivo.");
                }
            } else {
                setFeedback("No se pudo obtener la carpeta del cliente en Drive.");
            }
        } finally {
            setUploading(false);
        }
    };
        
    const handleDeleteFile = async (fileId, fileName) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar el archivo "${fileName}" de Google Drive?`)) {
            const success = await deleteFile(fileId);
            if (success) {
                setFeedback(`Archivo "${fileName}" eliminado con éxito.`);
                fetchClientFiles(); // Actualizamos la lista de archivos
            } else {
                setFeedback(`Error al eliminar el archivo "${fileName}".`);
            }
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Documentos en Google Drive</h3>
            
            {isSignedIn ? (
                <div>
                    {/* Formulario de Subida */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <input type="file" id="file-input" onChange={handleFileSelect} className="hidden" />
                            <label htmlFor="file-input" className="cursor-pointer bg-white border border-gray-300 rounded-md p-2 text-sm font-semibold hover:bg-gray-100">
                                {fileToUpload ? `Archivo: ${fileToUpload.name}` : 'Seleccionar Archivo'}
                            </label>
                            {fileToUpload && (
                                <input
                                    type="text"
                                    value={customFileName}
                                    onChange={(e) => setCustomFileName(e.target.value)}
                                    placeholder="Nombre del archivo..."
                                    className="flex-grow border rounded-md px-2 py-1.5 text-sm"
                                />
                            )}
                        </div>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-md px-2 py-1.5 text-sm bg-white">
                            {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                        </select>
                        {fileToUpload && (
                            <button onClick={handleUpload} disabled={uploading} className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                <UploadCloud size={20} className="mr-2" />
                                {uploading ? 'Subiendo...' : `Subir como "${customFileName}"`}
                            </button>
                        )}
                        {feedback && <p className="mt-3 text-sm text-gray-600">{feedback}</p>}
                    </div>

                    {/* Lista de Archivos Subidos */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-700 mb-3">Archivos del Cliente</h4>
                        {isLoadingFiles ? <p>Cargando archivos...</p> : (
                            <div className="space-y-2">
                                {clientFiles.length > 0 ? clientFiles.map(file => (
                                    <div key={file.id} className="flex justify-between items-center bg-white p-2 rounded-md border">
                                        <div className="flex items-center">
                                            <FileText size={18} className="mr-3 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-800">{file.name}</span>
                                        </div>
                                        <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                            <Download size={16} className="mr-1" />
                                            Descargar
                                        </a>
                                    </div>
                                )) : <p className="text-sm text-gray-500 italic">No hay documentos para este cliente.</p>}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 bg-gray-50 p-4 rounded-md">
                    Inicia sesión con Google para gestionar documentos.
                </p>
            )}
        </div>
    );
}