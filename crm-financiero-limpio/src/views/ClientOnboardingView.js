// src/views/ClientOnboardingView.js

import React, { useState } from 'react';
import CuitQuickCheck from '../components/clients/CuitQuickCheck';
import ClientForm from '../components/clients/ClientForm'; // Asumimos que este componente ya existe

export default function ClientOnboardingView() {
    const [onboardingStep, setOnboardingStep] = useState('checkCuit'); // 'checkCuit' | 'fillForm'
    const [checkedCuit, setCheckedCuit] = useState(null);

    const handleProceed = (cuit) => {
        console.log(`Aprobado preanálisis para CUIT: ${cuit}. Avanzando a la carga.`);
        setCheckedCuit(cuit);
        setOnboardingStep('fillForm');
    };

    const handleCancel = () => {
        console.log('Proceso de alta cancelado.');
        setCheckedCuit(null);
        setOnboardingStep('checkCuit');
    };
    
    const handleSaveClient = (clientData) => {
        console.log('Cliente guardado:', clientData);
        // Aquí iría la lógica para guardar el cliente en el estado global (App.js)
        // y luego resetear la vista.
        handleCancel(); 
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {onboardingStep === 'checkCuit' && (
                <CuitQuickCheck 
                    onProceed={handleProceed} 
                    onCancel={handleCancel} 
                />
            )}

            {onboardingStep === 'fillForm' && (
                <ClientForm 
                    initialCuit={checkedCuit} 
                    onSave={handleSaveClient}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}