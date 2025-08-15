import React, { useState } from 'react';
import InputField from '../common/InputField';

export default function FinancingModal({ onClose, onSave, clientQualifications, clientFinancing }) {
    const [instrument, setInstrument] = useState({
        instrument: 'Cheque', details: '', amount: 0,
        sgr: { isQualified: false, qualificationId: clientQualifications[0]?.id || null },
        schedule: [{ type: 'Vencimiento', date: new Date().toISOString().split('T')[0], amount: 0 }]
    });

    const calculateUsedAmount = (lineId) => {
        const today = new Date().toISOString().split('T')[0];
        return (clientFinancing || [])
            .filter(f => {
                if (!f.sgr.isQualified || f.sgr.qualificationId !== lineId) return false;
                const lastPayment = f.schedule[f.schedule.length - 1];
                return lastPayment.date >= today;
            })
            .reduce((sum, f) => {
                if (f.instrument === 'ON') {
                    return sum + f.schedule.filter(p => p.type === 'Amortización').reduce((subSum, p) => subSum + p.amount, 0);
                }
                return sum + f.amount;
            }, 0);
    };

    const handleInstrumentTypeChange = (e) => {
        const newType = e.target.value;
        const newSchedule = newType === 'ON' 
            ? [{ type: 'Intereses', date: '', amount: 0 }] 
            : [{ type: 'Vencimiento', date: new Date().toISOString().split('T')[0], amount: instrument.amount }];
        setInstrument(prev => ({ ...prev, instrument: newType, schedule: newSchedule }));
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setInstrument(prev => ({ ...prev, [name]: val }));
        if (name === 'amount' && instrument.instrument !== 'ON') {
            setInstrument(prev => ({ ...prev, schedule: [{ ...prev.schedule[0], amount: val }] }));
        }
    };
    
    const handleSGRChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'isQualified') {
            setInstrument(prev => ({ ...prev, sgr: { ...prev.sgr, isQualified: checked, qualificationId: checked ? (clientQualifications[0]?.id || null) : null } }));
        } else {
            setInstrument(prev => ({ ...prev, sgr: { ...prev.sgr, [name]: value } }));
        }
    };
    
    const handleScheduleChange = (index, e) => {
        const { name, value, type } = e.target;
        const list = [...instrument.schedule];
        list[index][name] = type === 'number' ? parseFloat(value) || 0 : value;
        setInstrument(prev => ({ ...prev, schedule: list }));
    };
    
    const handleBulletDateChange = (e) => {
        const { value } = e.target;
        const list = [...instrument.schedule];
        list[0]['date'] = value;
        setInstrument(prev => ({ ...prev, schedule: list }));
    };

    const addScheduleRow = () => {
        setInstrument(prev => ({...prev, schedule: [...prev.schedule, { type: 'Intereses', date: '', amount: 0 }]}));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (instrument.sgr.isQualified) {
            const line = clientQualifications.find(q => q.id === instrument.sgr.qualificationId);
            if (!line) {
                alert("Error: Línea de calificación no encontrada.");
                return;
            }
            const usedAmount = calculateUsedAmount(line.id);
            const availableAmount = line.lineAmount - usedAmount;
            
            let amountToValidate = instrument.amount;
            if(instrument.instrument === 'ON') {
                amountToValidate = instrument.schedule.filter(p => p.type === 'Amortización').reduce((sum, p) => sum + p.amount, 0);
            }

            if (amountToValidate > availableAmount) {
                alert(`Error: El monto a imputar ($${amountToValidate.toLocaleString('es-AR')}) supera el cupo disponible ($${availableAmount.toLocaleString('es-AR')}) en la línea seleccionada.`);
                return;
            }
        }
        onSave(instrument);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-screen">
                <h2 className="text-xl font-bold mb-6">Nuevo Instrumento de Financiación</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="instrument" label="Tipo de Instrumento" value={instrument.instrument} onChange={handleInstrumentTypeChange} select>
                            <option>Cheque</option><option>Pagaré</option><option>FCE</option><option>ON</option>
                        </InputField>
                        <InputField name="amount" label="Monto Total" type="number" value={instrument.amount} onChange={handleChange} />
                    </div>
                    <InputField name="details" label="Detalles (N°, Clase, etc.)" value={instrument.details} onChange={handleChange} />
                    
                    <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
                        <label className="flex items-center">
                            <input type="checkbox" name="isQualified" checked={instrument.sgr.isQualified} onChange={handleSGRChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm font-medium text-gray-700">Utiliza Calificación</span>
                        </label>
                        {instrument.sgr.isQualified && (
                            <InputField name="qualificationId" label="Seleccionar Línea de Crédito" value={instrument.sgr.qualificationId} onChange={handleSGRChange} select>
                                {clientQualifications.length > 0 ? clientQualifications.map(q => 
                                    <option key={q.id} value={q.id}>
                                        {q.name} ({q.type}) - Cupo: ${q.lineAmount.toLocaleString('es-AR')} - Vto: {new Date(q.lineExpiryDate).toLocaleDateString('es-AR', {timeZone: 'UTC'})}
                                    </option>
                                ) : <option disabled>No hay líneas de calificación para este cliente</option>}
                            </InputField>
                        )}
                    </div>
                    
                    {instrument.instrument === 'ON' ? (
                        <div>
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Esquema de Pagos</h3>
                            {instrument.schedule.map((item, i) => (
                                <div key={i} className="grid grid-cols-3 gap-2 mb-2 items-center">
                                    <InputField name="type" label={i===0?"Tipo":""} value={item.type} onChange={e => handleScheduleChange(i, e)} select><option>Amortización</option><option>Intereses</option></InputField>
                                    <InputField name="date" label={i===0?"Fecha":""} type="date" value={item.date} onChange={e => handleScheduleChange(i, e)} />
                                    <InputField name="amount" label={i===0?"Monto":""} type="number" value={item.amount} onChange={e => handleScheduleChange(i, e)} />
                                </div>
                            ))}
                            <button type="button" onClick={addScheduleRow} className="text-sm text-blue-600 hover:text-blue-800">+ Agregar fila</button>
                        </div>
                    ) : (
                        <InputField label="Fecha de Vencimiento" type="date" value={instrument.schedule[0].date} onChange={handleBulletDateChange} />
                    )}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}