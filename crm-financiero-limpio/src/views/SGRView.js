// src/views/SGRView.js

import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Send, Check, X } from 'lucide-react';
import SGRModal from '../components/modals/SGRModal';

// ++ NUEVO SUB-COMPONENTE PARA CADA ITEM INDIVIDUAL DEL CHECKLIST ++
const ChecklistItem = ({ item, index, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item);

    const handleSave = () => {
        if (editText.trim()) {
            onUpdate(index, editText.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditText(item); // Resetea el texto al original
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <li className="flex items-center space-x-2 py-1">
                <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
                <button onClick={handleSave} className="text-green-600 hover:text-green-800"><Check size={18} /></button>
                <button onClick={handleCancel} className="text-red-600 hover:text-red-800"><X size={18} /></button>
            </li>
        );
    }

    return (
        <li className="flex items-center justify-between py-1 group">
            <span>{item}</span>
            <div className="hidden group-hover:flex items-center space-x-2">
                <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                <button onClick={() => onDelete(index)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
        </li>
    );
};

// Componente ChecklistManager actualizado para usar ChecklistItem
const ChecklistManager = ({ title, items, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAddItem(newItem.trim());
            setNewItem('');
        }
    };

    return (
        <div>
            <h3 className="font-semibold text-gray-600 mb-2">{title}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
                {items.map((item, index) => (
                    <ChecklistItem 
                        key={index}
                        item={item}
                        index={index}
                        onUpdate={onUpdateItem}
                        onDelete={onDeleteItem}
                    />
                ))}
            </ul>
            <form onSubmit={handleAddItem} className="mt-4 flex items-center space-x-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Añadir nuevo requisito..."
                    className="flex-grow border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300">
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default function SGRView({ sgrs, onAddSgr, onUpdateSgr, onDeleteSgr, onAddItemToChecklist, onUpdateChecklistItem, onDeleteChecklistItem }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sgrToEdit, setSgrToEdit] = useState(null);

    // ... (Las funciones handleAddNew, handleEdit, handleSave, handleDelete, closeModal no cambian)
    const handleAddNew = () => { setSgrToEdit(null); setIsModalOpen(true); };
    const handleEdit = (sgr) => { setSgrToEdit(sgr); setIsModalOpen(true); };
    const handleSave = (sgrData) => { if (sgrToEdit) { onUpdateSgr({ ...sgrToEdit, ...sgrData }); } else { onAddSgr(sgrData); } closeModal(); };
    const handleDelete = (sgrId) => { if (window.confirm('¿Estás seguro?')) { onDeleteSgr(sgrId); } };
    const closeModal = () => { setIsModalOpen(false); setSgrToEdit(null); };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Perfiles de SGR</h1>
                <button onClick={handleAddNew} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nueva SGR
                </button>
            </div>
            <div className="space-y-8">
                {sgrs.map(sgr => (
                    <div key={sgr.id} className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-700">{sgr.name}</h2>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleEdit(sgr)} className="text-gray-500 hover:text-blue-600 transition"><Edit size={20} /></button>
                                <button onClick={() => handleDelete(sgr.id)} className="text-gray-500 hover:text-red-600 transition"><Trash2 size={20} /></button>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {sgr.checklist && sgr.checklist.juridica && (
                                <ChecklistManager 
                                    title="Checklist - Persona Jurídica"
                                    items={sgr.checklist.juridica}
                                    onAddItem={(newItem) => onAddItemToChecklist(sgr.id, 'juridica', newItem)}
                                    onUpdateItem={(index, newText) => onUpdateChecklistItem(sgr.id, 'juridica', index, newText)}
                                    onDeleteItem={(index) => onDeleteChecklistItem(sgr.id, 'juridica', index)}
                                />
                            )}
                            {sgr.checklist && sgr.checklist.fisica && (
                                <ChecklistManager 
                                    title="Checklist - Persona Física"
                                    items={sgr.checklist.fisica}
                                    onAddItem={(newItem) => onAddItemToChecklist(sgr.id, 'fisica', newItem)}
                                    onUpdateItem={(index, newText) => onUpdateChecklistItem(sgr.id, 'fisica', index, newText)}
                                    onDeleteItem={(index) => onDeleteChecklistItem(sgr.id, 'fisica', index)}
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