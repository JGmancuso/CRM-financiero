import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import SGRModal from '../components/modals/SGRModal';
import { useData } from '../context/DataContext';
import { ENTITY_TYPES } from '../data'; // Importamos los tipos para mostrar la etiqueta

// Los componentes ChecklistItem y ChecklistManager no necesitan cambios.
const ChecklistItem = ({ item, index, onUpdate, onDelete }) => { /* ... */ };
const ChecklistManager = ({ title, items, onAddItem, onUpdateItem, onDeleteItem }) => { /* ... */ };

export default function EntidadesView() { // Renombramos el componente
    const { state, dispatch } = useData();
    const { sgrs: entities } = state; // Renombramos 'sgrs' a 'entities' para más claridad

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entityToEdit, setEntityToEdit] = useState(null);

    const handleAddNew = () => { setEntityToEdit(null); setIsModalOpen(true); };
    const handleEdit = (entity) => { setEntityToEdit(entity); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEntityToEdit(null); };

    // --- 👇 AQUÍ USAMOS LAS NUEVAS ACCIONES GENÉRICAS 👇 ---
    const handleSave = (entityData) => {
        if (entityToEdit) {
            dispatch({ type: 'UPDATE_ENTITY', payload: { ...entityToEdit, ...entityData } });
        } else {
            dispatch({ type: 'ADD_ENTITY', payload: entityData });
        }
        closeModal();
    };
    
    const handleDelete = (entityId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta entidad?')) {
            dispatch({ type: 'DELETE_ENTITY', payload: entityId });
        }
    };
    
    // Las acciones de checklist siguen igual por ahora
    const handleAddItemToChecklist = (sgrId, type, item) => dispatch({ type: 'ADD_SGR_CHECKLIST_ITEM', payload: { sgrId, type, item } });
    const handleUpdateChecklistItem = (sgrId, type, index, text) => dispatch({ type: 'UPDATE_SGR_CHECKLIST_ITEM', payload: { sgrId, type, index, text } });
    const handleDeleteChecklistItem = (sgrId, type, index) => dispatch({ type: 'DELETE_SGR_CHECKLIST_ITEM', payload: { sgrId, type, index } });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Entidades Financieras</h1>
                <button onClick={handleAddNew} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nueva Entidad
                </button>
            </div>
            <div className="space-y-8">
                {(entities || []).map(entity => (
                    <div key={entity.id} className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <h2 className="text-2xl font-bold text-gray-700">{entity.name}</h2>
                                {/* Mostramos una etiqueta con el tipo de entidad */}
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-800">
                                    {ENTITY_TYPES[entity.type] || entity.type}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleEdit(entity)} className="text-gray-500 hover:text-blue-600 transition"><Edit size={20} /></button>
                                <button onClick={() => handleDelete(entity.id)} className="text-gray-500 hover:text-red-600 transition"><Trash2 size={20} /></button>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {entity.checklist?.juridica && ( <ChecklistManager title="Checklist - Persona Jurídica" items={entity.checklist.juridica} onAddItem={(newItem) => handleAddItemToChecklist(entity.id, 'juridica', newItem)} onUpdateItem={(index, newText) => handleUpdateChecklistItem(entity.id, 'juridica', index, newText)} onDeleteItem={(index) => handleDeleteChecklistItem(entity.id, 'juridica', index)} /> )}
                            {entity.checklist?.fisica && ( <ChecklistManager title="Checklist - Persona Física" items={entity.checklist.fisica} onAddItem={(newItem) => handleAddItemToChecklist(entity.id, 'fisica', newItem)} onUpdateItem={(index, newText) => handleUpdateChecklistItem(entity.id, 'fisica', index, newText)} onDeleteItem={(index) => handleDeleteChecklistItem(entity.id, 'fisica', index)} /> )}
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <SGRModal onClose={closeModal} onSave={handleSave} existingSGR={entityToEdit} />}
        </div>
    );
}