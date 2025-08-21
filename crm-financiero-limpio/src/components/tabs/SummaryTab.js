// src/tabs/SummaryTab.js
import React, { useState, useMemo } from 'react';
import { Mail, Phone, Briefcase, Gift, FileText, Globe, ShoppingCart, Users, Building, User, Link as LinkIcon, MapPin, Fingerprint, CalendarCheck, UserSquare } from 'lucide-react';
import InfoItem from '../common/InfoItem';



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

const getRequiredFiscalYear = (lastCloseDateStr) => {
    if (!lastCloseDateStr) return 'No especificado';
    const closeDate = new Date(lastCloseDateStr + 'T00:00:00');
    const currentDate = new Date();
    const closeYear = closeDate.getUTCFullYear();
    const fiveMonthsAfter = new Date(closeDate);
    fiveMonthsAfter.setUTCMonth(fiveMonthsAfter.getUTCMonth() + 5);

    if (currentDate <= fiveMonthsAfter) {
        return `Aún es exigible el balance del año ${closeYear - 1}`;
    }
    return `Exigible el balance del año ${closeYear}`;
};


export default function SummaryTab({ client, allClients }) {
    const participations = useMemo(() => {
        const clientId = client.cuit || client.cuil;
        if (!allClients || !clientId || client.type !== 'fisica') return [];
        return allClients.filter(c => c.type === 'juridica' && c.partners?.some(p => p.cuil === clientId))
                         .map(c => ({ companyName: c.name, companyId: c.id, share: c.partners.find(p => p.cuil === clientId).share }));
    }, [client, allClients]);

    const requiredYearStatus = getRequiredFiscalYear(client.lastFiscalClose);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Información Principal</h3>
                <InfoItem icon={<Mail size={20} />} label="Email" value={client.email} />
                <InfoItem icon={<Phone size={20} />} label="Teléfono" value={client.phone} />
                <InfoItem icon={<MapPin size={20} />} label="Ubicación" value={client.location} />
                
                {/* --- CAMBIO REALIZADO AQUÍ --- */}
                <InfoItem 
                    icon={<Briefcase size={20} />} 
                    label="CUIT / CUIL" 
                    value={client.cuit || client.cuil} 
                />

                <InfoItem icon={<Fingerprint size={20} />} label="ID Interno" value={client.id || 'sin numero'} />
                {client.type === 'fisica' && (
                    <>
                        <InfoItem icon={<Briefcase size={20} />} label="Actividad Independiente" value={client.hasIndependentActivity ? 'Sí' : 'No'} />
                        <InfoItem icon={<Gift size={20} />} label="Fecha de Nacimiento" value={client.birthDate ? new Date(client.birthDate).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-'} />
                    </>
                )}
                
                {client.contactPerson && client.contactPerson.name && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Persona de Contacto</h3>
                        <InfoItem icon={<UserSquare size={20} />} label="Nombre" value={client.contactPerson.name} />
                        <InfoItem icon={<Briefcase size={20} />} label="Cargo" value={client.contactPerson.role} />
                        <InfoItem icon={<Mail size={20} />} label="Email Contacto" value={client.contactPerson.email} />
                        <InfoItem icon={<Phone size={20} />} label="Teléfono Contacto" value={client.contactPerson.phone} />
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalles Comerciales</h3>
                <InfoItem icon={<CalendarCheck size={20} />} label="Año Fiscal Exigible">
                    <p className="font-normal text-gray-800 bg-gray-50 p-3 rounded-md mt-1">{requiredYearStatus}</p>
                </InfoItem>
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