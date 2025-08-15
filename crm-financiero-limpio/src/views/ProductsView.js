import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import InputField from '../components/common/InputField';
import ProductModal from '../components/modals/ProductModal';

// NOTA: La lógica de este componente no necesita grandes cambios.
// La tasa de referencia se elimina del producto y se gestiona en la simulación.
// El modal de producto ya usa un campo genérico "features", que es adecuado.

export default function ProductsView({ products, setProducts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleSaveProduct = (product) => {
        if (product.id) {
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            setProducts([...products, { ...product, id: `prod-${Date.now()}` }]);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };
    
    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (productId) => {
        if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
                <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
                    <PlusCircle size={18} className="mr-2"/> Nuevo Producto
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Nombre</th>
                            <th className="py-2 px-4 border-b text-left">Tipo</th>
                            <th className="py-2 px-4 border-b text-left">Características</th>
                            <th className="py-2 px-4 border-b text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{product.name}</td>
                                <td className="py-2 px-4 border-b">{product.type}</td>
                                <td className="py-2 px-4 border-b">{product.features}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button onClick={() => handleEdit(product)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(product.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ProductModal onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} productToEdit={editingProduct} />}
        </div>
    );
}
