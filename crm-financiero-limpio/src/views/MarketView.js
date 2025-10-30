import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import AgroPanel from '../components/market/AgroPanel';
import FinancialPanel from '../components/market/FinancialPanel';
import SectorPanel from '../components/market/SectorPanel';
import WeeklyVolumeChart from '../components/charts/WeeklyVolumeChart';

export default function MarketView() {
    const { loading, error, data } = useMarketData();

    if (loading) {
        return <div className="p-8 font-semibold">Cargando datos de mercado...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-500">Error al cargar los datos.</div>;
    }
    // Si no hay datos (incluso después de cargar), muestra un mensaje
    if (!data) {
        return <div className="p-8">No se encontraron datos de mercado.</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Información de Mercado</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pasamos la porción correcta de 'data' a cada panel */}
                <FinancialPanel data={data.financial} />
                <AgroPanel data={data.agro} />
                <div className="lg:col-span-2">
                    <SectorPanel data={data.sectors} />
                </div>
            </div>
        </div>
    );
}