// src/components/common/InfoItem.js
import React from 'react';

export default function InfoItem({ icon, label, value, children }) {
    // Si no hay valor ni contenido hijo, no mostramos nada.
    if (!value && !children) {
        return null;
    }

    return (
        <div className="flex items-start py-2">
            <div className="flex-shrink-0 w-8 text-gray-500 mt-1">
                {icon}
            </div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                {value && <p className="text-base text-gray-900">{value}</p>}
                {children}
            </div>
        </div>
    );
}