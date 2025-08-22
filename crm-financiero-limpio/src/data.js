// src/data.js

// 1. Importamos el archivo JSON con los datos transformados por el script de Python.
//    Asegúrate de que 'crm_negocios.json' esté en la carpeta 'src/'.
import transformedData from './crm_negocios.json';

// 2. Mantenemos las constantes que son fijas en la aplicación.
export const industries = ["Agropecuario", "Industria Manufacturera", "Comercio", "Servicios", "Construcción", "Tecnología", "Salud", "Transporte y Logística", "Otro"];

export const sgrChecklists = {
    fisica: [ "Reseña con la actividad de la empresa (*)", "Certificado Pyme vigente", "Constancia de Inscripción", "Foto del DNI de socios y/o fiadores", "última DDJJ y presentación de SUSS", "última DDJJ y presentación de IVA", "últimos 2 Est. de sit patrimonial", "últimas 2 DDJJ de ganancias de los socios / fiadores", "Papeles de trabajo o bien MMBB firmada por contador", "Detalle de empresas para descuento de cheques" ],
    juridica: [ "Reseña con la actividad de la empresa (*)", "Certificado Pyme vigente", "Constancia de Inscripción", "Acta designación de autoridades (asamblea/directorio)", "SA última página del registro de accionistas", "Estatuto", "Foto del DNI de socios y/o fiadores", "última DDJJ y presentación de SUSS", "última DDJJ y presentación de IVA", "últimos 2 EECC certificados", "últimas 2 DDJJ de ganancias de los socios / fiadores", "últimas 2 DDJJ de BBPP de socios/fiadores con Papeles de trabajo o bien MMBB firmada por contador", "Detalle de empresas para descuento de cheques" ]
};

export const initialSGRs = [
    { id: 'sgr-1', name: 'Garantizar SGR', totalQuota: 5000000, checklist: JSON.parse(JSON.stringify(sgrChecklists)) },
    { id: 'sgr-2', name: 'Acindar Pymes SGR', totalQuota: 8000000, checklist: JSON.parse(JSON.stringify(sgrChecklists)) },
    { id: 'sgr-3', name: 'Aval Federal SGR', totalQuota: 3000000, checklist: JSON.parse(JSON.stringify(sgrChecklists)) }
];



export const FUNNEL_STAGES = {
    'PROSPECTO': 'Prospecto',
    'INFO_SOLICITADA': 'Info Solicitada',
    'EN_ARMADO': 'En Armado',
    'EN_CALIFICACION': 'En Calificación',
    'PROPUESTA_FIRMADA': 'Propuesta Firmada',
    'GANADO': 'Ganado',
    'PERDIDO': 'Perdido',
};



// 3. Creamos y exportamos el objeto 'initialData' que toda la aplicación usará.
export const initialData = {
    // La lista de negocios viene directamente del JSON.
    negocios: transformedData.data.negocios || [],

    // Para mantener la consistencia, creamos la lista de clientes a partir de la lista de negocios.
    // Esto asegura que cada negocio tenga su cliente correspondiente.
    clients: transformedData.data.negocios.map(negocio => ({
        // Usamos un Set para evitar clientes duplicados si un cliente tiene varios negocios
        ...negocio.cliente, 
        status: negocio.estado, // Sincronizamos el estado
    })).filter((client, index, self) => 
        index === self.findIndex((c) => c.id === client.id)
    ),

    // El resto de los datos también viene del JSON.
    clients: transformedData.data.clients || [],
    sgrs: transformedData.data.sgrs || [],
    campaigns: transformedData.data.campaigns || [],
    products: transformedData.data.products || [],
};