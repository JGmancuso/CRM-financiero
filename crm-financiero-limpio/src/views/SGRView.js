import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Send, Check, X } from 'lucide-react';
import SGRModal from '../components/modals/SGRModal';
import { useData } from '../context/DataContext'; // <-- 1. Importamos useData

// Los componentes ChecklistItem y ChecklistManager no necesitan cambios,
// pero los incluimos aquí para que el archivo esté completo.

const ChecklistItem = ({ item, index, onUpdate, onDelete }) => { /* ... (código sin cambios) ... */ };
const ChecklistManager = ({ title, items, onAddItem, onUpdateItem, onDeleteItem }) => { /* ... (código sin cambios) ... */ };


// 👇 2. Eliminamos los props, ahora todo viene del contexto
export default function SGRView() {
    const { state, dispatch } = useData(); // <-- 3. Obtenemos estado y dispatch
    const { sgrs } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sgrToEdit, setSgrToEdit] = useState(null);

    const handleAddNew = () => { setSgrToEdit(null); setIsModalOpen(true); };
    const handleEdit = (sgr) => { setSgrToEdit(sgr); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setSgrToEdit(null); };

    // 👇 4. Reescribimos las funciones de manejo para que usen dispatch
    const handleSave = (sgrData) => {
        if (sgrToEdit) {
            dispatch({ type: 'UPDATE_SGR', payload: { ...sgrToEdit, ...sgrData } });
        } else {
            dispatch({ type: 'ADD_SGR', payload: sgrData });
        }
        closeModal();
    };
    
    const handleDelete = (sgrId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta entidad?')) {
            dispatch({ type: 'DELETE_SGR', payload: sgrId });
        }
    };
    
    const handleAddItemToChecklist = (sgrId, type, item) => dispatch({ type: 'ADD_SGR_CHECKLIST_ITEM', payload: { sgrId, type, item } });
    const handleUpdateChecklistItem = (sgrId, type, index, text) => dispatch({ type: 'UPDATE_SGR_CHECKLIST_ITEM', payload: { sgrId, type, index, text } });
    const handleDeleteChecklistItem = (sgrId, type, index) => dispatch({ type: 'DELETE_SGR_CHECKLIST_ITEM', payload: { sgrId, type, index } });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Entidades de Garantía/Crediticias</h1>
                <button onClick={handleAddNew} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nueva Entidad
                </button>
            </div>
            <div className="space-y-8">
                {(sgrs || []).map(sgr => (
                    <div key={sgr.id} className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-700">{sgr.name}</h2>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleEdit(sgr)} className="text-gray-500 hover:text-blue-600 transition"><Edit size={20} /></button>
                                <button onClick={() => handleDelete(sgr.id)} className="text-gray-500 hover:text-red-600 transition"><Trash2 size={20} /></button>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* 👇 5. Pasamos las nuevas funciones al ChecklistManager */}
                            {sgr.checklist && sgr.checklist.juridica && (
                                <ChecklistManager 
                                    title="Checklist - Persona Jurídica"
                                    items={sgr.checklist.juridica}
                                    onAddItem={(newItem) => handleAddItemToChecklist(sgr.id, 'juridica', newItem)}
                                    onUpdateItem={(index, newText) => handleUpdateChecklistItem(sgr.id, 'juridica', index, newText)}
                                    onDeleteItem={(index) => handleDeleteChecklistItem(sgr.id, 'juridica', index)}
                                />
                            )}
                            {sgr.checklist && sgr.checklist.fisica && (
                                <ChecklistManager 
                                    title="Checklist - Persona Física"
                                    items={sgr.checklist.fisica}
                                    onAddItem={(newItem) => handleAddItemToChecklist(sgr.id, 'fisica', newItem)}
                                    onUpdateItem={(index, newText) => handleUpdateChecklistItem(sgr.id, 'fisica', index, newText)}
                                    onDeleteItem={(index) => handleDeleteChecklistItem(sgr.id, 'fisica', index)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <SGRModal onClose={closeModal} onSave={handleSave} existingSGR={sgrToEdit} />}
        </div>
    );
}