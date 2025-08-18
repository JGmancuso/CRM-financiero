// src/components/tabs/SummaryTab.js

import React, { useState, useMemo } from 'react';
import { Mail, Phone, Briefcase, Gift, FileText, Globe, ShoppingCart, Users, Building, User, Link as LinkIcon, MapPin, Fingerprint } from 'lucide-react';
import InfoItem from '../common/InfoItem';

// Componente auxiliar para el texto expandible
const ExpandableText = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const snippetLength = 150;

    if (!text) {
        return <p className="font-normal text-gray-500 bg-gray-50 p-3 rounded-md mt-1">No hay notas.</p>;
    }

    const isLongText = text.length > snippetLength;

    return (
        <div className="font-normal text-gray-800 bg-gray-50 p-3 rounded-md mt-1">
            <p style={{ whiteSpace: 'pre-wrap' }}>
                {isExpanded ? text : `${text.substring(0, snippetLength)}${isLongText ? '...' : ''}`}
            </p>
            {isLongText && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="text-blue-600 hover:underline text-sm mt-2"
                >
                    {isExpanded ? 'Ver menos' : 'Ver más'}
                </button>
            )}
        </div>
    );
};


export default function SummaryTab({ client, allClients }) {
    const participations = useMemo(() => {
        if (!allClients || client.type !== 'fisica') return [];
        return allClients.filter(c => c.type === 'juridica' && c.partners?.some(p => p.cuil === client.cuil))
                         .map(c => ({ companyName: c.name, companyId: c.id, share: c.partners.find(p => p.cuil === client.cuil).share }));
    }, [client, allClients]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Información de Contacto</h3>
                <InfoItem icon={<Mail size={20} />} label="Email" value={client.email} />
                <InfoItem icon={<Phone size={20} />} label="Teléfono" value={client.phone} />
                <InfoItem icon={<MapPin size={20} />} label="Ubicación" value={client.location} />
                <InfoItem icon={client.type === 'juridica' ? <Briefcase size={20} /> : <User size={20} />} label={client.type === 'juridica' ? 'CUIT' : 'CUIL'} value={client.type === 'juridica' ? client.cuit : client.cuil} />
                {/* --- LÍNEA AÑADIDA --- */}
                <InfoItem icon={<Fingerprint size={20} />} label="ID Interno" value={client.id ? client.id : 'sin numero'} />
                {client.type === 'fisica' && (
                    <>
                        <InfoItem icon={<Briefcase size={20} />} label="Actividad Independiente" value={client.hasIndependentActivity ? 'Sí' : 'No'} />
                        <InfoItem icon={<Gift size={20} />} label="Fecha de Nacimiento" value={client.birthDate ? new Date(client.birthDate).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-'} />
                    </>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalles Comerciales</h3>
                <InfoItem icon={<FileText size={20} />} label="Relevamiento">
                    <ExpandableText text={client.relevamiento} />
                </InfoItem>
                <InfoItem icon={<FileText size={20} />} label="Reseña">
                    <ExpandableText text={client.review} />
                </InfoItem>
                <InfoItem icon={<Globe size={20} />} label="Comercio Exterior" value={client.hasForeignTrade ? 'Sí' : 'No'} />
                <InfoItem icon={<ShoppingCart size={20} />} label="Vende a Consumidor Final" value={client.sellsToFinalConsumer ? 'Sí' : 'No'} />
                {client.type === 'juridica' && client.partners && client.partners.length > 0 && (
                     <InfoItem icon={<Users size={20} />} label="Socios">
                        <ul className="mt-2 space-y-2">
                            {client.partners.map((p, i) => (
                                <li key={i} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      {p.type === 'juridica' ? <Building size={16} className="mr-2 text-gray-500" /> : <User size={16} className="mr-2 text-gray-500" />}
                                      <span className="font-medium text-gray-800">{p.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600">{p.share}%</span>
                                </li>
                            ))}
                        </ul>
                    </InfoItem>
                )}
                {client.type === 'fisica' && participations.length > 0 && (
                    <InfoItem icon={<LinkIcon size={20} />} label="Participaciones en Empresas">
                        <ul className="mt-2 space-y-2">
                            {participations.map((p, i) => (
                                <li key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                    <span className="font-medium text-gray-800">{p.companyName}</span>
                                    <span className="text-sm font-semibold text-blue-600">{p.share}%</span>
                                </li>
                            ))}
                        </ul>
                    </InfoItem>
                )}
            </div>
        </div>
    );
};