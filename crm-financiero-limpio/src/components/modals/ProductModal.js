import React, { useState, useEffect } from 'react';
import InputField from '../common/InputField';

export default function ProductModal({ onClose, onSave, productToEdit }) {
    const [product, setProduct] = useState(productToEdit || { name: '', type: 'Financiación', defaultRate: 0 });

    useEffect(() => {
        setProduct(productToEdit || { name: '', type: 'Financiación', defaultRate: 0 });
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProduct(prev => ({...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(product);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-6">{productToEdit ? 'Editar' : 'Nuevo'} Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Nombre del Producto" name="name" value={product.name} onChange={handleChange} required />
                    <InputField label="Tipo" name="type" value={product.type} onChange={handleChange} select>
                        <option>Financiación</option>
                        <option>Inversión</option>
                    </InputField>
                    <InputField label="Tasa / Rendimiento de Referencia (%)" name="defaultRate" type="number" value={product.defaultRate} onChange={handleChange} />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar Producto</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
