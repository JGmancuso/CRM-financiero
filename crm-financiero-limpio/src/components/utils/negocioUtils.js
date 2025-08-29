// src/utils/negocioUtils.js

export const daysSince = (dateString) => {
    if (!dateString) return 0; // Devolvemos 0 si no hay fecha
    const today = new Date();
    const pastDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    pastDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today - pastDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const findLastStageChangeDate = (negocio) => {
    if (!negocio) return null;
    if (!negocio.history || negocio.history.length === 0) return negocio.creationDate;
    const reversedHistory = [...negocio.history].reverse();
    const lastChange = reversedHistory.find(item => item.type && item.type.includes('Cambio de estado a:'));
    return lastChange ? lastChange.date : negocio.creationDate;
};