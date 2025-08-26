import React, { useState } from 'react';
import DebtorStatusTab from '../components/tabs/DebtorStatusTab';
import ClientForm from '../components/clients/ClientForm';
import { ArrowRight } from 'lucide-react';

export default function AnalisisNoClientesView({ onAddClient }) {
    // Estado para saber qué CUIT se consultó exitosamente
    const [cuitConsultado, setCuitConsultado] = useState(null);
    // Estado para cambiar a la vista de creación de cliente
    const [modo, setModo] = useState('analisis'); // 'analisis' o 'crearCliente'

    // Esta función la llamará DebtorStatusTab cuando tenga datos exitosos
    const handleDataLoaded = (data, cuit) => {
        // Si la consulta devuelve datos (no es un error), guardamos el CUIT
        if (data && data.totalDebt !== undefined) {
            setCuitConsultado(cuit);
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
        onAddClient(clientData); // Llama a la función de App.js para guardar el cliente
        alert(`Cliente ${clientData.nombre} creado con éxito.`);
        setModo('analisis');
        setCuitConsultado(null);
    };

    // Si estamos en modo 'crearCliente', mostramos el formulario
    if (modo === 'crearCliente') {
        return (
            <div className="p-8 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Cargar Nuevo Cliente</h2>
                <ClientForm 
                    initialCuit={cuitConsultado}
                    onSave={handleSaveClient}
                    onCancel={() => setModo('analisis')}
                />
            </div>
        );
    }

    // Por defecto, mostramos el panel de análisis
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