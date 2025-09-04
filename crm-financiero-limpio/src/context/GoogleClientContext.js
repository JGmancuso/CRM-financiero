// src/context/GoogleClientContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { initGoogleClient, signIn, signOut } from '../services/googleAuthService';

const GoogleClientContext = createContext();

export const GoogleClientProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    // Al cargar el componente por primera vez, inicializamos el cliente de Google.
    useEffect(() => {
        // La función initGoogleClient ahora nos avisará cuando el estado de login cambie,
        // y nosotros actualizaremos nuestro estado de React con setIsSignedIn.
        initGoogleClient(setIsSignedIn);
    }, []);

    // Ponemos a disposición de toda la app el estado de la sesión y las funciones para cambiarlo.
    const value = {
        isSignedIn,
        signIn,
        signOut,
    };

    return (
        <GoogleClientContext.Provider value={value}>
            {children}
        </GoogleClientContext.Provider>
    );
};

// Hook personalizado para que cualquier componente pueda acceder fácilmente a este contexto.
export const useGoogle = () => {
    const context = useContext(GoogleClientContext);
    if (context === undefined) {
        throw new Error('useGoogle debe ser usado dentro de un GoogleClientProvider');
    }
    return context;
};