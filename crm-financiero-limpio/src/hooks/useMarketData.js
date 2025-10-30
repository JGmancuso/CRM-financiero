import { useState, useEffect } from 'react';
import { getMarketData } from '../services/marketDataService';

export function useMarketData() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [marketData, setMarketData] = useState(null); // Un solo estado para todos los datos

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const data = await getMarketData();
                setMarketData(data);
            } catch (err) {
                setError(err);
                console.error("Error al obtener datos de mercado:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    return { loading, error, data: marketData }; // Devolvemos un solo objeto 'data'
}
