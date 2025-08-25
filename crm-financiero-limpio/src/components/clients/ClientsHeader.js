import React from 'react';
import { Search, PlusCircle } from 'lucide-react';

export default function ClientsHeader({ searchTerm, onSearchChange, onNewClientClick }) {
    return (
        <div className="p-4 border-b flex items-center space-x-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar cliente por nombre o CUIT..." 
                    value={searchTerm} 
                    onChange={onSearchChange} 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" 
                />
            </div>
            <button 
                onClick={onNewClientClick} 
                className="flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700" 
                title="Nuevo Cliente"
            >
                <PlusCircle />
            </button>
        </div>
    );
}