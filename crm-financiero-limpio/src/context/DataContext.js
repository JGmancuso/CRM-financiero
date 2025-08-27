import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';

// Dependencias
import { initialData } from '../data';
import { createTaskForStageChange } from '../services/TaskAutomationService';
import { clientReducer } from './reducers/clientReducer';
import { negocioReducer } from './reducers/negocioReducer';
import { taskReducer } from './reducers/taskReducer';
import { sgrReducer } from './reducers/sgrReducer'; // <-- 1. Importa el nuevo reducer


const APP_DATA_VERSION = '3.0';

// Función para reparar datos de negocios antiguos
const sanitizeNegociosData = (negocios = []) => {
    return negocios.map(negocio => {
        if (negocio.creationDate) return negocio;
        if (negocio.history && negocio.history.length > 0 && negocio.history[0].date) {
            return { ...negocio, creationDate: negocio.history[0].date };
        }
        return { ...negocio, creationDate: new Date().toISOString() };
    });
};

const DataContext = createContext();

// --- ESTA ES LA FUNCIÓN CORREGIDA ---
const loadInitialState = () => {
    // 1. Se declara la variable `dataToLoad` al inicio.
    let dataToLoad = initialData; 

    try {
        const savedJSON = localStorage.getItem('crm-data');
        if (savedJSON) {
            const savedObject = JSON.parse(savedJSON);
            if (savedObject.version === APP_DATA_VERSION && savedObject.data) {
                // 2. Se le asignan los datos guardados.
                dataToLoad = savedObject.data;
            }
        }
    } catch (error) {
        console.error("Error al cargar datos desde localStorage:", error);
    }
    
    // 3. Se reparan los datos de negocios.
    const saneados = sanitizeNegociosData(dataToLoad.negocios);

    // 4. Se retorna el estado inicial usando la variable `dataToLoad`.
    return {
        clients: dataToLoad.clients || [],
        negocios: saneados,
        sgrs: dataToLoad.sgrs || [],
        campaigns: dataToLoad.campaigns || [],
        products: dataToLoad.products || [],
        tasks: dataToLoad.tasks || [],
    };
};

const initialState = loadInitialState();

const rootReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_CLIENT_AND_BUSINESS': {
            const { motivo, montoAproximado, observaciones, ...clientDetails } = action.payload;
            const newClient = {
                ...clientDetails,
                id: `client-${Date.now()}`,
                qualifications: [], activities: [], documents: [], financing: [],
                history: [{ date: new Date().toISOString(), type: 'Creación de Cliente', reason: 'Alta inicial en el sistema.' }]
            };
            const newBusiness = {
                id: `negocio-${newClient.id}`,
                nombre: `${clientDetails.name} - ${motivo || 'Nueva Oportunidad'}`,
                estado: 'PROSPECTO',
                montoSolicitado: parseFloat(montoAproximado) || 0,
                fechaProximoSeguimiento: new Date().toISOString(),
                history: [{ date: new Date().toISOString(), type: 'Creación de Negocio', reason: observaciones || 'Creación inicial.' }],
                cliente: { id: newClient.id, nombre: newClient.name, cuit: newClient.cuit }
            };
            return { ...state, clients: [...state.clients, newClient], negocios: [...state.negocios, newBusiness] };
        }
        case 'UPDATE_NEGOCIO_STAGE': {
            const updatedNegocio = action.payload;
            const taskData = createTaskForStageChange(updatedNegocio);
            const newNegocios = negocioReducer(state.negocios, {type: 'UPDATE_NEGOCIO_STAGE', payload: updatedNegocio});
            const newTasks = taskData ? taskReducer(state.tasks, {type: 'ADD_TASK', payload: taskData}) : state.tasks;
            return { ...state, negocios: newNegocios, tasks: newTasks };
        }
        case 'IMPORT_DATA': {
            const saneados = sanitizeNegociosData(action.payload.negocios || []);
            return { ...state, ...action.payload, negocios: saneados };
        }
        default:
            return {
                clients: clientReducer(state.clients, action),
                negocios: negocioReducer(state.negocios, action),
                tasks: taskReducer(state.tasks, action),
                sgrs: sgrReducer(state.sgrs, action), 
                campaigns: state.campaigns,
                products: state.products,
            };
    }
};

export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        const dataToSave = { version: APP_DATA_VERSION, data: state };
        localStorage.setItem('crm-data', JSON.stringify(dataToSave));
        setLastSaved(new Date());
    }, [state]);

    return (
        <DataContext.Provider value={{ state, dispatch, lastSaved }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData debe ser usado dentro de un DataProvider');
    }
    return context;
};