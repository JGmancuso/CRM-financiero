import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';

// Dependencias de nuestro estado
import { initialData } from '../data';
import { createTaskForStageChange } from '../services/TaskAutomationService';

// Importamos los reductores especializados
import { clientReducer } from './reducers/clientReducer';
import { negocioReducer } from './reducers/negocioReducer';
import { taskReducer } from './reducers/taskReducer';

const APP_DATA_VERSION = '3.0';

// --- 1. Creación del Contexto ---
const DataContext = createContext();

// --- 2. Carga del Estado Inicial desde LocalStorage (o datos por defecto) ---
const loadInitialState = () => {
    try {
        const savedJSON = localStorage.getItem('crm-data');
        if (savedJSON) {
            const savedObject = JSON.parse(savedJSON);
            if (savedObject.version === APP_DATA_VERSION && savedObject.data) {
                return savedObject.data;
            }
        }
    } catch (error) {
        console.error("Error al cargar datos desde localStorage:", error);
    }
    // Fallback a los datos iniciales si no hay nada guardado
    return {
        clients: initialData.clients || [],
        negocios: initialData.negocios || [],
        sgrs: initialData.sgrs || [],
        campaigns: initialData.campaigns || [],
        products: initialData.products || [],
        tasks: initialData.tasks || [],
    };
};

const initialState = loadInitialState();

// --- 3. El Reductor Raíz (El Director de Orquesta) ---
const rootReducer = (state, action) => {
    
    // Primero, manejamos las acciones complejas que afectan a múltiples partes del estado
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
            // Retornamos el nuevo estado completo
            return {
                ...state,
                clients: [...state.clients, newClient],
                negocios: [...state.negocios, newBusiness],
            };
        }

        case 'UPDATE_NEGOCIO_STAGE': {
            const updatedNegocio = action.payload;
            const taskData = createTaskForStageChange(updatedNegocio);

            // Delegamos la actualización del negocio a su reducer
            const newNegocios = negocioReducer(state.negocios, {type: 'UPDATE_NEGOCIO', payload: updatedNegocio});
            
            // Si se generó una tarea, delegamos su creación al reducer de tareas
            const newTasks = taskData 
                ? taskReducer(state.tasks, {type: 'ADD_TASK', payload: taskData}) 
                : state.tasks;

            return {
                ...state,
                negocios: newNegocios,
                tasks: newTasks
            };
        }
        
        case 'IMPORT_DATA': {
            return { ...state, ...action.payload };
        }

        default:
            // Si no es una acción compleja, delegamos a cada reducer individual
            return {
                clients: clientReducer(state.clients, action),
                negocios: negocioReducer(state.negocios, action),
                tasks: taskReducer(state.tasks, action),
                // Los siguientes estados aún no tienen reducer, así que los pasamos tal cual
                sgrs: state.sgrs, 
                campaigns: state.campaigns,
                products: state.products,
            };
    }
};

// --- 4. El Componente Proveedor que envuelve la App ---
export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    const [lastSaved, setLastSaved] = useState(null);

    // Efecto para autoguardar en localStorage cada vez que el estado cambie
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

// --- 5. Hook Personalizado para un fácil acceso al contexto ---
export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData debe ser usado dentro de un DataProvider');
    }
    return context;
};