// src/components/tabs/DebtorStatusTab.js

import React, { useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useBcraApi } from '../../hooks/useBcraApi';
import Accordion from '../common/Accordion';
import { getStatusColor } from '../../services/bcraService';
import HistoryGrid from '../debtor-status/HistoryGrid'; // <-- Nuevo
import DebtEvolutionChart from '../debtor-status/DebtEvolutionChart'; // <-- Nuevo
//import { registerClient } from '../../services/clientService';  



// Base de datos simulada de respuestas de la API del BCRA (ampliada)
const mockApiResponses = {
    // Kennbal SRL
    "30715277014": { "results": { "identificacion": "30715277014", "denominacion": "Kennbal SRL", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 1, "monto": 115029 }, { "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 72231 }] }] }},
    // M y M SAS
    "30717345882": { "results": { "identificacion": "30717345882", "denominacion": "M y M SAS", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "BANCO BBVA ARGENTINA S.A.", "situacion": 1, "monto": 41861 }, { "entidad": "BANCO DE SANTA CRUZ S.A.", "situacion": 1, "monto": 24491 }] }] }},
    // Borgarello Gustavo Claudio
    "20238991294": { "results": { "identificacion": "20238991294", "denominacion": "Borgarello Gustavo Claudio", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "BANCO MACRO S.A.", "situacion": 1, "monto": 56322 }] }] }},
    // Tecno Fundaciones SRL
    "30716089599": { "results": { "identificacion": "30716089599", "denominacion": "Tecno Fundaciones SRL", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "JALIN S.A.", "situacion": 1, "monto": 214322 }, { "entidad": "BANCO DE LA PROVINCIA DE CORDOBA S.A.", "situacion": 1, "monto": 57982 }] }] }},
};

const mockRejectedChecks = {
    "30715277014": { "results": { "causales": [] } },
    "30717345882": { "results": { "causales": [] } },
    "20238991294": { "results": { "causales": [{ "causal": "SIN FONDOS", "entidades": [{ "detalle": [{ "fechaRechazo": "2025-07-15", "monto": 50000 }] }] }] } },
    "30716089599": { "results": { "causales": [] } },
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

export default function DebtorStatusTab({ client }) {
    // Usamos nuestro Hook personalizado, pasándole el CUIT del cliente si existe
    const { cuitInput, setCuitInput, data, loading, error, handleConsult } = useBcraApi(client?.cuit);

    // Sincronizamos el input si la prop 'client' cambia
    useEffect(() => {
        if (client?.cuit) {
            setCuitInput(client.cuit);
        }
    }, [client, setCuitInput]);
    

    // Preparamos los datos para los componentes de presentación
    // Usamos useMemo para optimizar y evitar recálculos innecesarios
    const preparedData = useMemo(() => {
        if (!data?.allPeriods?.length) {
            return { uniqueBanks: [], uniquePeriods: [], situationGrid: {}, chartData: [], maxTotalDebt: 0 };
        }

        const uniquePeriods = data.allPeriods.map(p => p.period).reverse();
        const uniqueBanksSet = new Set();
        data.allPeriods.forEach(p => p.entities.forEach(e => uniqueBanksSet.add(e.entidad)));
        const uniqueBanks = Array.from(uniqueBanksSet);

        // 1. Datos para el Cuadro de Doble Entrada
        const situationGrid = {};
        uniqueBanks.forEach(bank => {
            situationGrid[bank] = {};
            data.allPeriods.forEach(p => {
                const entity = p.entities.find(e => e.entidad === bank);
                if (entity) {
                    situationGrid[bank][p.period] = entity.situacion;
                }
            });
        });

        // 2. Datos para el Gráfico de Barras Acumuladas
        let maxTotalDebt = 0;
        const chartData = uniquePeriods.map(period => {
            const periodData = data.allPeriods.find(p => p.period === period);
            let periodTotalDebt = 0;
            const debts = {};
            uniqueBanks.forEach(bank => {
                const entity = periodData?.entities.find(e => e.entidad === bank);
                const monto = entity?.monto || 0;
                debts[bank] = monto;
                periodTotalDebt += monto;
            });
            if (periodTotalDebt > maxTotalDebt) {
                maxTotalDebt = periodTotalDebt;
            }
            return { period, ...debts, total: periodTotalDebt };
        });

        return { uniqueBanks, uniquePeriods, situationGrid, chartData, maxTotalDebt };
    }, [data]);

    const { uniqueBanks, uniquePeriods, situationGrid, chartData, maxTotalDebt } = preparedData;
    const latestPeriodData = data?.allPeriods?.[0];

    return (
        <div>
            {/* --- Panel de Búsqueda --- */}
            <div className="flex items-center space-x-2 mb-6 p-4 bg-gray-50 rounded-lg">
                <input
                    type="text"
                    value={cuitInput}
                    onChange={(e) => setCuitInput(e.target.value)}
                    placeholder="Ingresa un CUIT/CUIL para consultar"
                    className="w-full px-4 py-2 border rounded-lg"
                    disabled={loading}
                />
                <button
                    onClick={handleConsult}
                    disabled={loading || !cuitInput}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                    <Search size={18} className="mr-2"/>
                    {loading ? 'Consultando...' : 'Consultar'}
                </button>
            </div>

            {/* --- Panel de Resultados --- */}
            {loading && <p className="text-center text-gray-500 py-8">Consultando...</p>}
            {error && <p className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</p>}

           {data && !loading && (
                <div className="space-y-4 animate-fade-in">
                    
                    {/* Sección de la Situación Actual de Deuda */}
                    <Accordion title="Situación Actual" startOpen={true}>
                        {(latestPeriodData && latestPeriodData.entities.length > 0) ? (
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-3 border-b text-left font-semibold text-gray-600">Entidad</th>
                                        <th className="py-2 px-3 border-b text-center font-semibold text-gray-600">Situación</th>
                                        <th className="py-2 px-3 border-b text-right font-semibold text-gray-600">Monto Adeudado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestPeriodData.entities.filter(sit => sit.monto > 0).map((sit, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="py-2 px-3 border-b">{sit.entidad}</td>
                                            <td className="py-2 px-3 border-b text-center">
                                                <div className={`w-5 h-5 rounded-full mx-auto ${getStatusColor(sit.situacion)}`} title={`Situación ${sit.situacion}`}></div>
                                            </td>
                                            <td className="py-2 px-3 border-b text-right font-mono">${(sit.monto || 0).toLocaleString('es-AR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-gray-500">No hay datos de deudas para el último período.</p>}
                    </Accordion>
                    
                    {/* Acordeón para la Situación Histórica (Tabla) */}
                    <Accordion title="Situación de Deuda - Historial 24 Meses (Tabla)" startOpen={true}>
                        <HistoryGrid
                            uniquePeriods={uniquePeriods}
                            uniqueBanks={uniqueBanks}
                            situationGrid={situationGrid}
                        />
                    </Accordion>

                    {/* Acordeón para la Evolución de Deuda (Gráfico) */}
                    <Accordion title="Evolución de Deuda (Gráfico)" startOpen={true}>
                        <DebtEvolutionChart
                            chartData={chartData}
                            uniqueBanks={uniqueBanks}
                            maxTotalDebt={maxTotalDebt}
                        />
                    </Accordion>
                    
                    {/* Acordeón para Cheques Rechazados */}
                    <Accordion title="Cheques Rechazados" startOpen={data.rejectedChecks && data.rejectedChecks.length > 0}>
                        {(data.rejectedChecks && data.rejectedChecks.length > 0) ? (
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-3 border-b text-left font-semibold text-gray-600">Fecha Rechazo</th>
                                        <th className="py-2 px-3 border-b text-left font-semibold text-gray-600">Causal</th>
                                        <th className="py-2 px-3 border-b text-right font-semibold text-gray-600">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rejectedChecks.map((check, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="py-2 px-3 border-b">{new Date(check.fechaRechazo).toLocaleDateString('es-AR', {timeZone:'UTC'})}</td>
                                            <td className="py-2 px-3 border-b">{check.causal}</td>
                                            <td className="py-2 px-3 border-b text-right font-mono">${(check.monto || 0).toLocaleString('es-AR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-gray-500">No se registran cheques rechazados.</p>}
                    </Accordion>
                </div>
            )}
        </div>
    );
}