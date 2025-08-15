import React, { useState } from 'react';
import InputField from '../common/InputField';
import DebtorStatusTab from '../tabs/DebtorStatusTab';

export default function PreConsultationModal({ onClose, onProceed }) {
    const [id, setId] = useState('');
    const [consultedData, setConsultedData] = useState(null);
    const [clientProxy, setClientProxy] = useState(null);

    const handleIdChange = (e) => {
        setId(e.target.value);
        setConsultedData(null); // Reset on new ID
    };
    
    const handleConsult = () => {
        if (id.length === 11 || id.length === 13) {
            const formattedId = id.replace(/-/g, '');
            const type = formattedId.startsWith('30') ? 'juridica' : 'fisica';
            setClientProxy({ id: `temp-${Date.now()}`, type, cuit: type === 'juridica' ? id : '', cuil: type === 'fisica' ? id : '' });
        } else {
            alert("Por favor, ingrese un CUIT/CUIL válido.");
        }
    };

    const handleUpdateDebtorStatus = (debtorData) => {
        const type = (clientProxy.cuit || clientProxy.cuil).startsWith('30') ? 'juridica' : 'fisica';
        setConsultedData({ debtorStatus: debtorData, id: clientProxy.cuit || clientProxy.cuil, type });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Paso 1: Consulta Previa de CUIT/CUIL</h2>
                <div className="flex items-start space-x-4 mb-6">
                    <InputField label="CUIT / CUIL" value={id} onChange={handleIdChange} placeholder="XX-XXXXXXXX-X" />
                    <button onClick={handleConsult} className="mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Consultar</button>
                </div>

                {clientProxy && (
                    <DebtorStatusTab client={clientProxy} onUpdateDebtorStatus={handleUpdateDebtorStatus} />
                )}

                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button type="button" onClick={() => onProceed(consultedData)} disabled={!consultedData} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                        Avanzar con la Carga
                    </button>
                </div>
            </div>
        </div>
    );
}
