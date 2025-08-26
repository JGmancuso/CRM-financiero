import React from 'react';
import { useData } from '../context/DataContext';
import ClientForm from '../components/clients/ClientForm';
import CuitQuickCheck from '../components/clients/CuitQuickCheck';

export default function AnalisisNoClientesView() {
    // Obtenemos la función dispatch de nuestro contexto para poder agregar clientes
    const { dispatch } = useData();
    
    // Estado para manejar los pasos: 'check' (verificar CUIT) o 'form' (llenar formulario)
    const [step, setStep] = React.useState('check');
    
    // Estado para guardar el CUIT verificado y pasarlo al formulario
    const [cuitForForm, setCuitForForm] = React.useState('');

    // Esta función se ejecuta cuando el CUIT es verificado con éxito
    const handleCuitCheckSuccess = (cuit) => {
        setCuitForForm(cuit);
        setStep('form'); // Avanzamos al paso del formulario
    };

    // Esta función se ejecuta cuando se guarda el cliente desde el formulario
    const handleSaveClient = (clientFormData) => {
        // Creamos el objeto completo del nuevo cliente
        const newClient = {
            ...clientFormData,
            id: `client-${Date.now()}`,
            qualifications: [],
            activities: [],
            documents: [],
            financing: [],
            history: [{ date: new Date().toISOString(), type: 'Creación de Cliente', reason: 'Alta inicial desde Análisis No Cliente.' }]
        };

        // Usamos dispatch para enviar la acción de agregar el cliente al estado global
        dispatch({ type: 'ADD_CLIENT', payload: newClient });

        alert(`Cliente "${newClient.nombre}" fue creado con éxito.`);
        
        // Volvemos al primer paso para poder analizar otro CUIT
        handleCancel(); 
    };
    
    // Función para cancelar y volver al paso inicial
    const handleCancel = () => {
        setCuitForForm('');
        setStep('check');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Análisis y Alta de No Clientes</h1>
                
                {step === 'check' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Paso 1: Consulta Rápida por CUIT</h2>
                        <CuitQuickCheck onCheckSuccess={handleCuitCheckSuccess} />
                    </div>
                )}
                
                {step === 'form' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Paso 2: Cargar Datos del Cliente</h2>
                        <ClientForm 
                            onSave={handleSaveClient} 
                            onCancel={handleCancel}
                            initialCuit={cuitForForm}
                            clientToEdit={null} // Siempre es un cliente nuevo en esta vista
                        />
                    </div>
                )}
            </div>
        </div>
    );
}