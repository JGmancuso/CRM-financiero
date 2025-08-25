// src/hooks/useBcraApi.js

import { useState } from 'react';
import { fetchBcraData } from '../services/bcraService';

export const useBcraApi = (initialCuit = '') => {
    const [cuitInput, setCuitInput] = useState(initialCuit);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConsult = async () => {
        if (!cuitInput || cuitInput.length < 11) {
            setError("Por favor, ingresa un CUIT válido de 11 dígitos.");
            return;
        }
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const result = await fetchBcraData(cuitInput);
            setData(result);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        cuitInput,
        setCuitInput,
        data,
        loading,
        error,
        handleConsult
    };
};