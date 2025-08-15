import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import SGRModal from '../components/modals/SGRModal';
import { sgrChecklists } from '../data';

export default function SGRView({ sgrs, setSgrs, clients }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveSGR = (newSGR) => {
        setSgrs([...sgrs, { ...newSGR, id: `sgr-${Date.now()}` }]);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Perfiles de SGR</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nueva SGR
                </button>
            </div>
            <div className="space-y-8">
                {sgrs.map(sgr => (
                    <div key={sgr.id} className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-700">{sgr.name}</h2>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-2">Checklist - Persona Jurídica</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {sgrChecklists.juridica.map(item => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-2">Checklist - Persona Física</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {sgrChecklists.fisica.map(item => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <SGRModal onClose={() => setIsModalOpen(false)} onSave={handleSaveSGR} />}
        </div>
    );
}
