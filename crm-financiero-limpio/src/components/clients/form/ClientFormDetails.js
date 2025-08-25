import React from 'react';
import InputField from '../../common/InputField';

export default function ClientFormDetails({ data, onChange }) {
    return (
        <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700 mb-2">Detalles Comerciales y Notas</h3>
            <InputField name="lastFiscalClose" label="Último Cierre Fiscal" type="date" value={data.lastFiscalClose || ''} onChange={onChange} />
            <div className="flex items-center">
                <input type="checkbox" name="hasForeignTrade" checked={data.hasForeignTrade || false} onChange={onChange} className="rounded mr-2" />
                <span className="text-sm text-gray-600">¿Realiza Comercio Exterior?</span>
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="sellsToFinalConsumer" checked={data.sellsToFinalConsumer || false} onChange={onChange} className="rounded mr-2" />
                <span className="text-sm text-gray-600">¿Vende a Consumidor Final?</span>
            </div>
            <InputField name="relevamiento" label="Relevamiento" value={data.relevamiento || ''} onChange={onChange} as="textarea" />
            <InputField name="review" label="Reseña" value={data.review || ''} onChange={onChange} as="textarea" />
        </div>
    );
}