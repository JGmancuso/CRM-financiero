import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';

// Dependencias
import { initialData } from '../data';
import { createTaskForStageChange } from '../services/TaskAutomationService';
import { clientReducer } from './reducers/clientReducer';
import { negocioReducer } from './reducers/negocioReducer';
import { taskReducer } from './reducers/taskReducer';
import { entityReducer } from './reducers/entityReducer'; 
import { handleStageChangeAutomation } from '../services/TaskAutomationService';
import { clientActivitiesReducer } from './reducers/clientActivitiesReducer';
import { campaignReducer } from './reducers/campaignReducer';


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

        case 'UPDATE_NEGOCIO_CALIFICACIONES': {
            const updatedNegocio = action.payload;
            const originalNegocio = state.negocios.find(n => n.id === updatedNegocio.id);
            
            console.log("PASO 1 (Guardado): Se está despachando este objeto de negocio actualizado:", updatedNegocio);
            
            const updatedNegociosState = negocioReducer(state.negocios, action);

            console.log("PASO 2 (Procesamiento): El reducer recibió los datos del negocio:", updatedNegocio);
            console.log("PASO 2.1: Se encontró el negocio original:", originalNegocio);

            const originalApprovedIds = (originalNegocio?.calificaciones || []).filter(c => c.estado === 'Aprobada').map(c => c.id);
            const newApprovals = (updatedNegocio.calificaciones || []).filter(c => c.estado === 'Aprobada' && !originalApprovedIds.includes(c.id));
            
            console.log("PASO 2.2: Se detectaron estas nuevas aprobaciones:", newApprovals);

            let updatedClientsState = state.clients;
            if (newApprovals.length > 0) {
                updatedClientsState = state.clients.map(client => {
                    if (client.id === updatedNegocio.cliente.id) {
                        const newQualifications = newApprovals.map(approval => ({
                            id: `client-qual-${approval.id}`,
                            name: approval.entidad,
                            lineAmount: parseFloat(approval.montoAprobado) || 0,
                            destination: approval.destino,
                            lineExpiryDate: approval.vencimiento,
                            type: 'SGR',
                        }));
                        return { 
                            ...client, 
                            qualifications: [...(client.qualifications || []), ...newQualifications] 
                        };
                    }
                    return client;
                });
                console.log("PASO 2.3: El estado de los clientes se actualizó. El cliente modificado es:", updatedClientsState.find(c => c.id === updatedNegocio.cliente.id));
            }
            return { ...state, negocios: updatedNegociosState, clients: updatedClientsState };
        }
        
        case 'UPDATE_NEGOCIO_STAGE': {
            const updatedNegocioData = action.payload;
            const originalNegocio = state.negocios.find(n => n.id === updatedNegocioData.id);

            // Si por alguna razón no se encuentra el negocio, hacemos una actualización simple para evitar un error.
            if (!originalNegocio) {
                return {
                    ...state,
                    negocios: negocioReducer(state.negocios, action),
                };
            }
            
            // 1. Llamamos SIEMPRE a nuestro servicio de automatización.
            const { updatedTasks, newNegocio } = handleStageChangeAutomation(
                originalNegocio,
                updatedNegocioData,
                state.tasks
            );

            // 2. Actualizamos el negocio en la lista (el reducer ya sabe si fue cambio de estado o de detalle).
            const newNegociosList = negocioReducer(state.negocios, { ...action, payload: newNegocio });

            // 3. Retornamos el nuevo estado con la lista de negocios y la lista de tareas actualizadas.
            return {
                ...state,
                negocios: newNegociosList,
                tasks: updatedTasks,
            };
        }

        case 'ADD_TASK':
        case 'UPDATE_TASK': {
            // 1. Actualizamos la lista de tareas como siempre
            const updatedTasks = taskReducer(state.tasks, action);
            const taskPayload = action.payload;

            // 2. Si la tarea no tiene un ID de negocio o no tiene notas, no hacemos nada más
            if (!taskPayload.businessId || !taskPayload.details) {
                return { ...state, tasks: updatedTasks };
            }

            // 3. Si tiene ID y notas, las añadimos al historial del negocio correspondiente
            const updatedNegocios = state.negocios.map(negocio => {
                if (negocio.id === taskPayload.businessId) {
                    const newHistoryEntry = {
                        date: new Date().toISOString(),
                        type: 'Nota de Agenda', // Nuevo tipo de historial
                        reason: taskPayload.details
                    };
                    return { ...negocio, history: [...(negocio.history || []), newHistoryEntry] };
                }
                return negocio;
            });

            // 4. Devolvemos el estado con ambas listas (tareas y negocios) actualizadas
            return { ...state, tasks: updatedTasks, negocios: updatedNegocios };
        }
        // --- 👆 FIN DE LA LÓGICA DE HISTORIAL 👆 ---
        case 'IMPORT_DATA': {
            const saneados = sanitizeNegociosData(action.payload.negocios || []);
            return { ...state, ...action.payload, negocios: saneados };
        }

        default:
            const updatedClients = clientActivitiesReducer(state.clients, action);
            
            return {
                clients: clientReducer(updatedClients, action),
                negocios: negocioReducer(state.negocios, action),
                tasks: taskReducer(state.tasks, action),
                sgrs: entityReducer(state.sgrs, action),
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