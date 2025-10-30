// src/services/marketDataService.js

const mockMarketData = {
    agro: {
        grains: [
            { name: 'Soja', price: 350, trend: 'up', cycle: 'Cosecha' },
            { name: 'Maíz', price: 220, trend: 'down', cycle: 'Siembra' },
        ],
        impliedRates: { soja: [5, 6, 7, 8], maiz: [4, 5, 5.5, 6] },
    },
    financial: {
        dolar: { value: 1050.50, trend: 'up' },
        impliedRates: {
            rofex: [10, 12, 15, 18],
            cer: [8, 9, 11, 13],
            lecap: [11, 13, 14, 15],
        },
    },
    sectors: {
        list: [
            { name: 'Energía', volume: 1500, volumeChange: 0.15, return: 0.05, mervalReturn: 0.02 },
            { name: 'Banca', volume: 2200, volumeChange: -0.05, return: 0.01, mervalReturn: 0.02 },
        ],
        weeklyVolume: {
            current: [100, 120, 110, 130, 150, 140, 160],
            historicalMax: 400,
            lastYearMax: 350,
        },
    },
};

// Una sola función para obtener todos los datos
export const getMarketData = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockMarketData);
        }, 800); // Simula retraso de red
    });
};