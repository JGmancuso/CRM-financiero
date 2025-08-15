import React, { useState, useMemo } from 'react';
import InputField from '../components/common/InputField';
import { PlusCircle, Trash2, Archive } from 'lucide-react';
import { initialSGRs } from '../data';
import CampaignLogModal from '../components/modals/CampaignLogModal';

export default function CampaignsView({ allClients, onUpdateClient, campaigns, setCampaigns, onNavigateToClient }) {
    const [selectedCampaign, setSelectedCampaign] = useState(campaigns.find(c => !c.isArchived) || campaigns[0]);
    const [loggingClient, setLoggingClient] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const updatedCampaign = { ...selectedCampaign, filters: { ...selectedCampaign.filters, [name]: value } };
        setSelectedCampaign(updatedCampaign);
        setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    };

    const addCampaign = () => {
        const newCampaign = {
            id: `camp-${Date.now()}`,
            name: 'Nueva Campaña',
            isArchived: false,
            filters: { location: '', activity: '', hasForeignTrade: 'any', sellsToFinalConsumer: 'any', minAvailableCredit: '', sgrName: 'any', instrument: 'any', investmentProfile: 'any' }
        };
        setCampaigns([...campaigns, newCampaign]);
        setSelectedCampaign(newCampaign);
    };

    const deleteCampaign = (campaignId) => {
        if (window.confirm("¿Seguro que quieres eliminar esta campaña?")) {
            const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
            setCampaigns(updatedCampaigns);
            if (selectedCampaign.id === campaignId) {
                setSelectedCampaign(updatedCampaigns.find(c => c.isArchived === showArchived) || updatedCampaigns[0] || null);
            }
        }
    };
    
    const archiveCampaign = (campaignId) => {
        const updatedCampaigns = campaigns.map(c => c.id === campaignId ? {...c, isArchived: true} : c);
        setCampaigns(updatedCampaigns);
        if (selectedCampaign.id === campaignId) {
            setSelectedCampaign(updatedCampaigns.find(c => !c.isArchived) || updatedCampaigns[0] || null);
        }
    };

    const handleSaveLog = (logData) => {
        const { contacted, response, newStatus } = logData;
        
        const newInteraction = {
            ...loggingClient.campaignInteractions,
            [selectedCampaign.id]: { contacted, response }
        };

        const newHistoryEntry = {
            date: new Date().toISOString(),
            type: `Campaña: ${selectedCampaign.name}`,
            reason: `Contacto: ${contacted}. Respuesta: ${response}`,
        };
        
        const updatedClient = {
            ...loggingClient,
            status: newStatus || loggingClient.status,
            campaignInteractions: newInteraction,
            history: [...(loggingClient.history || []), newHistoryEntry],
            lastUpdate: new Date().toISOString()
        };
        
        onUpdateClient(updatedClient);
        setLoggingClient(null);
    };

    const calculateAvailableAmount = (client) => {
        const today = new Date().toISOString().split('T')[0];
        let totalAvailable = 0;
        (client.qualifications || []).forEach(line => {
            if (line.lineExpiryDate >= today) {
                const usedAmount = (client.financing || [])
                    .filter(f => f.sgr.isQualified && f.sgr.qualificationId === line.id && f.schedule[f.schedule.length - 1].date >= today)
                    .reduce((sum, f) => {
                        if (f.instrument === 'ON') return sum + f.schedule.filter(p => p.type === 'Amortización').reduce((subSum, p) => subSum + p.amount, 0);
                        return sum + f.amount;
                    }, 0);
                totalAvailable += (line.lineAmount - usedAmount);
            }
        });
        return totalAvailable;
    };

    const filteredClients = useMemo(() => {
        if (!selectedCampaign) return [];
        const filters = selectedCampaign.filters;
        return allClients.filter(client => {
            if (filters.location && !client.province?.toLowerCase().includes(filters.location.toLowerCase())) return false;
            if (filters.activity && !client.activity?.toLowerCase().includes(filters.activity.toLowerCase())) return false;
            if (filters.hasForeignTrade !== 'any' && String(client.hasForeignTrade) !== filters.hasForeignTrade) return false;
            if (filters.sellsToFinalConsumer !== 'any' && String(client.sellsToFinalConsumer) !== filters.sellsToFinalConsumer) return false;
            if (filters.minAvailableCredit && calculateAvailableAmount(client) < parseFloat(filters.minAvailableCredit)) return false;
            if (filters.sgrName !== 'any' && !(client.qualifications || []).some(q => q.name === filters.sgrName)) return false;
            if (filters.instrument !== 'any' && !(client.financing || []).some(f => f.instrument === filters.instrument)) return false;
            if (filters.investmentProfile !== 'any' && client.investment?.profile !== filters.investmentProfile) return false;
            return true;
        });
    }, [allClients, selectedCampaign]);

    const visibleCampaigns = campaigns.filter(c => c.isArchived === showArchived);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Campañas Comerciales</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2 border-b">
                    <button onClick={() => setShowArchived(false)} className={`px-4 py-2 ${!showArchived ? 'border-b-2 border-blue-600 font-semibold text-blue-600' : 'text-gray-500'}`}>Activas</button>
                    <button onClick={() => setShowArchived(true)} className={`px-4 py-2 ${showArchived ? 'border-b-2 border-blue-600 font-semibold text-blue-600' : 'text-gray-500'}`}>Históricas</button>
                </div>
                <button onClick={addCampaign} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center"><PlusCircle size={18} className="mr-2"/> Nueva Campaña</button>
            </div>
            <div className="flex space-x-4 mb-8 pb-4 items-center">
                {visibleCampaigns.map(c => (
                    <div key={c.id} className="relative group">
                        <button onClick={() => setSelectedCampaign(c)} className={`px-4 py-2 rounded-lg ${selectedCampaign?.id === c.id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>
                            {c.name}
                        </button>
                        <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!c.isArchived && <button onClick={() => archiveCampaign(c.id)} title="Archivar" className="bg-yellow-500 text-white rounded-full p-0.5"><Archive size={12} /></button>}
                            <button onClick={() => deleteCampaign(c.id)} title="Eliminar" className="bg-red-500 text-white rounded-full p-0.5"><Trash2 size={12} /></button>
                        </div>
                    </div>
                ))}
            </div>
            
            {selectedCampaign && (
                <>
                    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Filtros de Campaña: {selectedCampaign.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InputField label="Provincia" name="location" value={selectedCampaign.filters.location} onChange={handleFilterChange} />
                            <InputField label="Actividad" name="activity" value={selectedCampaign.filters.activity} onChange={handleFilterChange} />
                            <InputField label="Saldo Mínimo Disponible" name="minAvailableCredit" type="number" value={selectedCampaign.filters.minAvailableCredit} onChange={handleFilterChange} placeholder="Ej: 500000" />
                            <InputField label="Comercio Exterior" name="hasForeignTrade" value={selectedCampaign.filters.hasForeignTrade} onChange={handleFilterChange} select>
                                <option value="any">Cualquiera</option><option value="true">Sí</option><option value="false">No</option>
                            </InputField>
                            <InputField label="Vende a Consumidor Final" name="sellsToFinalConsumer" value={selectedCampaign.filters.sellsToFinalConsumer} onChange={handleFilterChange} select>
                                <option value="any">Cualquiera</option><option value="true">Sí</option><option value="false">No</option>
                            </InputField>
                            <InputField label="Calificación SGR" name="sgrName" value={selectedCampaign.filters.sgrName} onChange={handleFilterChange} select>
                                <option value="any">Cualquiera</option>
                                {initialSGRs.map(sgr => <option key={sgr.id} value={sgr.name}>{sgr.name}</option>)}
                            </InputField>
                            <InputField label="Instrumento" name="instrument" value={selectedCampaign.filters.instrument} onChange={handleFilterChange} select>
                                <option value="any">Cualquiera</option><option>Cheque</option><option>Pagaré</option><option>FCE</option><option>ON</option>
                            </InputField>
                             <InputField label="Perfil de Inversión" name="investmentProfile" value={selectedCampaign.filters.investmentProfile} onChange={handleFilterChange} select>
                                <option value="any">Cualquiera</option><option>Conservador</option><option>Moderado</option><option>Agresivo</option>
                            </InputField>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Resultados ({filteredClients.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-4 border-b text-left">Nombre</th>
                                        <th className="py-2 px-4 border-b text-left">Contacto</th>
                                        <th className="py-2 px-4 border-b text-left">Respuesta Campaña</th>
                                        <th className="py-2 px-4 border-b text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map(client => {
                                        const interaction = client.campaignInteractions?.[selectedCampaign.id];
                                        return (
                                            <tr key={client.id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border-b"><button onClick={() => onNavigateToClient(client)} className="text-blue-600 hover:underline">{client.name}</button></td>
                                                <td className="py-2 px-4 border-b">{client.email}</td>
                                                <td className="py-2 px-4 border-b">{interaction ? `Contactado: ${interaction.contacted}. Respuesta: ${interaction.response}` : 'Pendiente'}</td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    <button onClick={() => setLoggingClient(client)} className="text-blue-600 hover:underline text-sm">Registrar Contacto</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            {loggingClient && <CampaignLogModal client={loggingClient} campaign={selectedCampaign} onClose={() => setLoggingClient(null)} onSave={handleSaveLog} />}
        </div>
    );
} 