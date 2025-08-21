// src/components/common/Accordion.js

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ title, children, startOpen = false }) {
    const [isOpen, setIsOpen] = useState(startOpen);

    return (
        <div className="border rounded-lg bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 hover:bg-gray-50"
            >
                <span>{title}</span>
                <ChevronDown
                    className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
}