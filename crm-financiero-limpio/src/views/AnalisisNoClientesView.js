// src/views/AnalisisNoClientesView.js

import React, { useState } from 'react';
import DebtorStatusTab from '../components/tabs/DebtorStatusTab';
import ClientForm from '../components/clients/ClientForm';
import { ArrowRight } from 'lucide-react'; // Y cualquier otro import que tengas

export default function AnalisisNoClientesView({ onAddClient }) {
    // Estado para saber qué CUIT se consultó exitosamente
    const [cuitConsultado, setCuitConsultado] = useState(null);
    // Estado para cambiar a la vista de creación de cliente
    const [modo, setModo] = useState('analisis'); // 'analisis' o 'crearCliente'

    // Esta función la llamará DebtorStatusTab cuando tenga datos exitosos
    const handleDataLoaded = (data, cuit) => {
        if (data && data.totalDebt !== undefined) {
            setCuitConsultado(cuit); // Guardamos el CUIT que se consultó
        } else {
            setCuitConsultado(null);
        }
    };

    // Cambia al modo de creación de formulario
    const handleCargarComoCliente = () => {
        if (cuitConsultado) {
            setModo('crearCliente');
        }
    };

    // Lógica para guardar y volver a la pantalla de análisis
    const handleSaveClient = (clientData) => {
        onAddClient(clientData); // Llama a la función de App.js
        alert(`Cliente ${clientData.nombre} creado con éxito.`);
        setModo('analisis');
        setCuitConsultado(null);
    };

    if (modo === 'crearCliente') {
        return (
            <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Cargar Nuevo Cliente</h2>
                <ClientForm 
                    initialCuit={cuitConsultado}
                    onSave={handleSaveClient}
                    onCancel={() => setModo('analisis')}
                />
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Análisis No Clientes</h1>
            <p className="text-gray-600 mb-4">
                Ingresa un CUIT para realizar una consulta de situación crediticia. Si el perfil es adecuado, podrás cargarlo como un nuevo cliente.
            </p>
            
            {/* El componente de consulta ahora nos notifica cuando carga datos */}
            <DebtorStatusTab onDataLoaded={handleDataLoaded} />

            {/* Este botón solo aparece si una consulta fue exitosa */}
            {cuitConsultado && (
                <div className="mt-8 pt-6 border-t flex justify-center">
                    <button 
                        onClick={handleCargarComoCliente}
                        className="flex items-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-all text-lg"
                    >
                        <ArrowRight size={20} className="mr-2" />
                        Cargar como Nuevo Cliente
                    </button>
                </div>
            )}
        </div>
    );
}