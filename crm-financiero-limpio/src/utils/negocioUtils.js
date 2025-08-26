// src/utils/negocioUtils.js

// Calcula los días desde una fecha hasta hoy
export const daysSince = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const pastDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    pastDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today - pastDate);
    // Sumamos 1 para que el mismo día cuente como '1 día'
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Encuentra la fecha del último cambio de estado real en el historial
export const findLastStageChangeDate = (negocio) => {
    if (!negocio) return null;
    if (!negocio.history || negocio.history.length === 0) {
        return negocio.creationDate;
    }
    const reversedHistory = [...negocio.history].reverse();
    const lastChange = reversedHistory.find(item => item.type && item.type.includes('Cambio de estado a:'));
    
    // Si encuentra un cambio de estado, devuelve su fecha. Si no, devuelve la fecha de creación.
    return lastChange ? lastChange.date : negocio.creationDate;
};