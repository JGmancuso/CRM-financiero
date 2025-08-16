import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

// Base de datos simulada de respuestas de la API del BCRA
const mockApiResponses = {
    "30123456789": { // Soluciones Tech S.A.
        "results": {
            "identificacion": "30123456789",
            "denominacion": "Soluciones Tech S.A.",
            "periodos": [
                { "periodo": "202508", "entidades": [{ "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 585 }, { "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 2, "monto": 12000 }, { "entidad": "MERCADOLIBRE S.R.L.", "situacion": 1, "monto": 0 }] },
                { "periodo": "202507", "entidades": [{ "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 550 }, { "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 1, "monto": 11000 }] },
                { "periodo": "202506", "entidades": [{ "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 600 }, { "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 1, "monto": 10000 }] },
            ]
        }
    },
    "20309158955": { // CUIT de ejemplo corregido
        "results": {
            "identificacion": "20309158955",
            "denominacion": "Cliente Ejemplo",
             "periodos": [
                { "periodo": "202508", "entidades": [{ "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 350 }, { "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 2, "monto": 1500 }] },
                { "periodo": "202507", "entidades": [{ "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 300 }, { "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 1, "monto": 1200 }] },
                { "periodo": "202506", "entidades": [{ "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 250 }, { "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 1, "monto": 1000 }] },
            ]
        }
    }
};

const mockRejectedChecks = {
    "30123456789": {
        "results": { "causales": [] }
    },
    "20309158955": {
        "results": {
            "causales": []
        }
    }
};

const bankNameMapping = {
    'banco de la nacion argentina': 'BNA',
    'banco bbva argentina s.a.': 'BBVA',
    'industrial and commercial bank of china': 'ICBC',
    'banco santander argentina s.a.': 'Santander',
    'banco de galicia y buenos aires s.a.': 'Galicia',
    'banco ggal sa': 'GGAL',
    'banco comafi sociedad anonima': 'COMAFI',
    'banco macro s.a.': 'Macro',
    'banco de inversion y comercio exterior s.a.': 'BICE',
    'banco hipotecario s.a.': 'Hipotecario',
    'banco credicoop cooperativo limitado': 'CREDICOOP',
    'banco supervielle s.a.': 'Supervielle',
    'volkswagen financial services compañia financiera s.a.': 'Volkswagen',
    'toyota compañía financiera de argentina s.a.': 'Toyota Cred',
    'rombo compañía financiera s.a.': 'Renault Cred',
    'banco de santa cruz s.a.': 'Banco Sta Cruz',
    'mercadolibre s.r.l.': 'Mdo Libre',
    'banco patagonia s.a.': 'Patagonia',
    'john deere credit compañía financiera s.a.':'Deere',
    'banco de la provincia de buenos aires':'BAPRO',
};

// Ordenar las llaves por longitud descendente para que las más específicas coincidan primero
const sortedBankKeys = Object.keys(bankNameMapping).sort((a, b) => b.length - a.length);

const getShortBankName = (fullName) => {
    const lowerCaseName = fullName.toLowerCase().trim();
    for (const key of sortedBankKeys) {
        if (lowerCaseName.includes(key)) {
            return bankNameMapping[key];
        }
    }
    return fullName;
};


export default function DebtorStatusTab({ client, onUpdateDebtorStatus }) {
    const [data, setData] = useState(client.debtorStatus || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const transformBcraData = (apiData, checksData) => {
        const transformed = {
            totalDebt: 0,
            currentSituation: [],
            history: [],
            rejectedChecks: []
        };

        if (apiData && apiData.results && apiData.results.periodos && apiData.results.periodos.length > 0) {
            const latestPeriod = apiData.results.periodos[0];
            transformed.currentSituation = latestPeriod.entidades.map(e => ({
                entidad: getShortBankName(e.entidad),
                situacion: e.situacion,
                monto: e.monto * 1000
            }));
            transformed.totalDebt = transformed.currentSituation.reduce((sum, e) => sum + e.monto, 0);

            const entityHistory = {};
            apiData.results.periodos.forEach(p => {
                p.entidades.forEach(e => {
                    const shortName = getShortBankName(e.entidad);
                    if (!entityHistory[shortName]) {
                        entityHistory[shortName] = { entidad: shortName, periodos: {}, montoEvol: {} };
                    }
                    entityHistory[shortName].periodos[p.periodo] = e.situacion;
                    entityHistory[shortName].montoEvol[p.periodo] = e.monto;
                });
            });
            transformed.history = Object.values(entityHistory);
        }
        
        if (checksData && checksData.results && checksData.results.causales && checksData.results.causales.length > 0) {
            transformed.rejectedChecks = checksData.results.causales.flatMap(c => 
                c.entidades.flatMap(e => e.detalle.map(d => ({...d, causal: c.causal})))
            );
        }

        return transformed;
    };

    const handleConsult = async () => {
        setLoading(true);
        setError(null);
        setData(null);
        
        const clientId = client.cuit || client.cuil;
        const formattedId = clientId.replace(/-/g, '');

        try {
            const [debtResponse, checksResponse] = await Promise.all([
                fetch(`https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/Historicas/${formattedId}`),
                fetch(`https://api.bcra.gob.ar/CentralDeDeudores/v1.0/ChequesRechazados/${formattedId}`)
            ]);
	   

            let debtApiData, checksApiData;

            if (debtResponse.ok) {
                debtApiData = await debtResponse.json();
            } else if (debtResponse.status === 404) {
                 debtApiData = { results: { periodos: [] } }; // No hay deuda, es un caso válido
            } else {
                 const errorData = await debtResponse.json().catch(() => ({})); // Intenta parsear el error, si no puede, devuelve objeto vacío
                 throw new Error(`Error en Deudas: ${errorData.errorMessages?.[0] || debtResponse.status}`);
            }

            if (checksResponse.ok) {
                checksApiData = await checksResponse.json();
            } else if (checksResponse.status === 404) {
                checksApiData = { results: { causales: [] } }; // No hay cheques, es un caso válido
            } else {
                const errorData = await checksResponse.json().catch(() => ({}));
                throw new Error(`Error en Cheques: ${errorData.errorMessages?.[0] || checksResponse.status}`);
            }
            
            const transformedData = transformBcraData(debtApiData, checksApiData);
            onUpdateDebtorStatus(transformedData);
            setData(transformedData);

        } catch (e) {
            console.error("Error al contactar la API del BCRA (posiblemente CORS), usando datos de ejemplo.", e);
            setError(`Fallo la conexión con la API del BCRA. Se mostrarán datos de ejemplo. Detalle: ${e.message}`);
            
            const mockDebtData = mockApiResponses[formattedId];
            const mockChecksData = mockRejectedChecks[formattedId];

            if (mockDebtData) {
                const transformedData = transformBcraData(mockDebtData, mockChecksData);
                onUpdateDebtorStatus(transformedData);
                setData(transformedData);
            } else {
                setError("No se encontraron datos para la identificación ingresada (ni en API real ni en ejemplos).");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = ['bg-gray-300', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
        return colors[status] || colors[0];
    };

    const graphData = useMemo(() => {
        if (!data || !data.history) return { periods: [], entities: {}, maxTotal: 0 };

        const periods = [...new Set(data.history.flatMap(h => Object.keys(h.montoEvol)))].sort().reverse();
        const entities = {};
        const entityColors = ['bg-blue-500', 'bg-teal-500', 'bg-indigo-500', 'bg-pink-500', 'bg-sky-500'];
        let colorIndex = 0;

        data.history.forEach(h => {
            if (!entities[h.entidad]) {
                entities[h.entidad] = { color: entityColors[colorIndex % entityColors.length] };
                colorIndex++;
            }
        });

        const totalsByPeriod = periods.map(p => {
            return data.history.reduce((sum, h) => sum + (h.montoEvol[p] || 0), 0);
        });

        const maxTotal = Math.max(...totalsByPeriod, 0);

        return { periods, entities, maxTotal, totalsByPeriod };
    }, [data]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Consulta a Central de Deudores (BCRA)</h3>
                <button onClick={handleConsult} disabled={loading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center disabled:bg-gray-400">
                    <Search size={18} className="mr-2"/> {loading ? 'Consultando...' : 'Consultar'}
                </button>
            </div>

            {loading && <p className="text-center text-gray-500">Cargando...</p>}
            {error && <p className="text-center text-red-500 p-4 bg-red-50 rounded-lg">{error}</p>}

            {data && !loading && (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-bold text-gray-800">Resumen General</h4>
                        <p className="text-sm">Deuda Total Informada: <span className="font-semibold text-xl text-red-600">${data.totalDebt.toLocaleString('es-AR')}</span></p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-bold text-gray-800 mb-2">Situación Actual por Entidad</h4>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-1 px-2 border-b text-left">Entidad</th>
                                    <th className="py-1 px-2 border-b text-center">Situación</th>
                                    <th className="py-1 px-2 border-b text-right">Monto Adeudado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.currentSituation.filter(sit => sit.monto > 0).map((sit, i) => (
                                    <tr key={i}>
                                        <td className="py-1 px-2 border-b">{sit.entidad}</td>
                                        <td className="py-1 px-2 border-b text-center"><div className={`w-5 h-5 rounded-full mx-auto ${getStatusColor(sit.situacion)}`}></div></td>
                                        <td className="py-1 px-2 border-b text-right">${sit.monto.toLocaleString('es-AR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-bold text-gray-800 mb-2">Historial de Situación (Últimos 24m)</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <tbody>
                                    {data.history.map((ent, i) => (
                                        <tr key={i}>
                                            <td className="font-semibold pr-4 py-2">{ent.entidad}</td>
                                            <td className="flex space-x-1 py-2">
                                                {Object.entries(ent.periodos).map(([period, sit]) => (
                                                    <div key={period} title={`Período: ${period} - Sit: ${sit}`} className={`w-6 h-6 rounded ${getStatusColor(sit)}`}></div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-bold text-gray-800 mb-2">Evolución de Deuda Consolidada (en miles de $)</h4>
                        <div className="flex justify-center space-x-4 mb-4">
                            {Object.entries(graphData.entities).map(([name, {color}]) => (
                                <div key={name} className="flex items-center text-sm">
                                    <div className={`w-4 h-4 rounded mr-2 ${color}`}></div>
                                    <span>{name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end space-x-2 h-48 bg-gray-50 p-2 rounded">
                            {graphData.periods.map((period, i) => (
                                <div key={period} className="w-full flex flex-col-reverse items-center relative group" style={{ height: `${(graphData.totalsByPeriod[i] / graphData.maxTotal) * 100}%`}}>
                                    {data.history.map(ent => {
                                        const monto = ent.montoEvol[period] || 0;
                                        const percentOfTotal = graphData.totalsByPeriod[i] > 0 ? (monto / graphData.totalsByPeriod[i]) * 100 : 0;
                                        const tooltip = `Entidad: ${ent.entidad}\nMonto: $${(monto * 1000).toLocaleString('es-AR')}`;
                                        return <div key={ent.entidad} title={tooltip} className={`${graphData.entities[ent.entidad].color} w-full`} style={{ height: `${percentOfTotal}%`}}></div>
                                    })}
                                    <div className="absolute bottom-full mb-2 w-max p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <p className="font-bold">Período: {period}</p>
                                        <p>Total: ${(graphData.totalsByPeriod[i] * 1000).toLocaleString('es-AR')}</p>
                                        <hr className="my-1 border-gray-500"/>
                                        {data.history.map(ent => {
                                            const monto = ent.montoEvol[period] || 0;
                                            if (monto > 0) {
                                                return <p key={ent.entidad}>{ent.entidad}: ${(monto * 1000).toLocaleString('es-AR')}</p>
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-bold text-gray-800 mb-2">Cheques Rechazados</h4>
                        {data.rejectedChecks.length > 0 ? (
                             <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-1 px-2 border-b text-left">Fecha Rechazo</th>
                                        <th className="py-1 px-2 border-b text-left">Causal</th>
                                        <th className="py-1 px-2 border-b text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rejectedChecks.map((check, i) => (
                                        <tr key={i}>
                                            <td className="py-1 px-2 border-b">{new Date(check.fechaRechazo).toLocaleDateString('es-AR', {timeZone:'UTC'})}</td>
                                            <td className="py-1 px-2 border-b">{check.causal}</td>
                                            <td className="py-1 px-2 border-b text-right">${check.monto.toLocaleString('es-AR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-gray-500">No se registran cheques rechazados.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
