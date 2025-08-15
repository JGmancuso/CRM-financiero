import React from 'react';

export default function InfoItem({ icon, label, value, children }) {
    return (
        <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-gray-400">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                {value && <p className="font-semibold text-gray-800">{value}</p>}
                {children}
            </div>
        </div>
    );
}
