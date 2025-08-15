import React from 'react';
import { Upload, FilePlus } from 'lucide-react';

export default function ImportOnStartupModal({ onImport, onStartNew }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Bienvenido a tu CRM</h2>
                <p className="text-gray-600 mb-8">No hemos encontrado datos guardados. ¿Qué te gustaría hacer?</p>
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={onImport} 
                        className="flex items-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Upload size={20} className="mr-2" />
                        Importar Backup
                    </button>
                    <button 
                        onClick={onStartNew}
                        className="flex items-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
                    >
                        <FilePlus size={20} className="mr-2" />
                        Empezar de Cero
                    </button>
                </div>
            </div>
        </div>
    );
}
