import React from 'react';

export default function InputField({ name, label, value, onChange, type = 'text', required = false, select = false, children, placeholder }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {select ? (
                <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">{children}</select>
            ) : (
                <input type={type} name={name} id={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            )}
        </div>
    );
}