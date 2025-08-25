// src/views/ConsultasView.js

import React, { useState } from 'react';
import CuitQuickCheck from '../components/clients/CuitQuickCheck';
import ClientForm from '../components/clients/ClientForm';

export default function ConsultasView() {
    const [viewMode, setViewMode] = useState('consultas'); // 'consultas' o 'crearCliente'
    const [cuitParaNuevoCliente, setCuitParaNuevoCliente] = useState('');

    // Esta función se activará cuando hagas clic en "Avanzar con la Carga"
    const handleConvertToClient = (cuit) => {
        setCuitParaNuevoCliente(cuit);
        setViewMode('crearCliente');
    };

    // Esta función te devolverá a la pantalla de consulta
    const handleCancelCreation = () => {
        setCuitParaNuevoCliente('');
        setViewMode('consultas');
    };

    // Función para manejar el guardado del cliente
    const handleSaveClient = (newClient) => {
        console.log("Cliente guardado:", newClient);
        // Aquí iría tu lógica para añadir el cliente al estado global en App.js
        alert(`Cliente ${newClient.nombre} guardado con éxito.`);
        handleCancelCreation(); // Volvemos a la vista de consultas
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {viewMode === 'consultas' ? (
                <CuitQuickCheck onConvertToClient={handleConvertToClient} />
            ) : (
                <ClientForm 
                    initialCuit={cuitParaNuevoCliente}
                    onSave={handleSaveClient}
                    onCancel={handleCancelCreation}
                />
            )}
        </div>
    );
}