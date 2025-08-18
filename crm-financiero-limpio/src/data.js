// src/data.js

export const sgrChecklists = {
    fisica: [
        "Reseña con la actividad de la empresa (*)",
        "Certificado Pyme vigente",
        "Constancia de Inscripción",
        "Foto del DNI de socios y/o fiadores",
        "última DDJJ y presentación de SUSS",
        "última DDJJ y presentación de IVA",
        "últimos 2 Est. de sit patrimonial",
        "últimas 2 DDJJ de ganancias de los socios / fiadores",
        "Papeles de trabajo o bien MMBB firmada por contador",
        "Detalle de empresas para descuento de cheques"
    ],
    juridica: [
        "Reseña con la actividad de la empresa (*)",
        "Certificado Pyme vigente",
        "Constancia de Inscripción",
        "Acta designación de autoridades (asamblea/directorio)",
        "SA última página del registro de accionistas",
        "Estatuto",
        "Foto del DNI de socios y/o fiadores",
        "última DDJJ y presentación de SUSS",
        "última DDJJ y presentación de IVA",
        "últimos 2 EECC certificados",
        "últimas 2 DDJJ de ganancias de los socios / fiadores",
        "últimas 2 DDJJ de BBPP de socios/fiadores con Papeles de trabajo o bien MMBB firmada por contador",
        "Detalle de empresas para descuento de cheques"
    ]
};

export const initialSGRs = [
    { 
        id: 'sgr-1', 
        name: 'Garantizar SGR', 
        totalQuota: 5000000,
        checklist: JSON.parse(JSON.stringify(sgrChecklists))
    },
    { 
        id: 'sgr-2', 
        name: 'Acindar Pymes SGR', 
        totalQuota: 8000000,
        checklist: JSON.parse(JSON.stringify(sgrChecklists))
    },
    { 
        id: 'sgr-3', 
        name: 'Aval Federal SGR', 
        totalQuota: 3000000,
        checklist: JSON.parse(JSON.stringify(sgrChecklists))
    }
];

export const FUNNEL_STAGES = {
    PROSPECTO: 'PROSPECTO',
    INFO_SOLICITADA: 'INFO SOLICITADA',
    EN_ARMADO: 'EN ARMADO',
    EN_CALIFICACION: 'EN CALIFICACION',
    APERTURA_CUENTA_COMITENTE: 'APERTURA CUENTA COMITENTE',
    GANADO: 'GANADO',
    PERDIDO: 'PERDIDO',
};

export const initialProducts = [
    { id: 'prod-1', name: 'Cheque', type: 'Financiación', features: 'Descuento de cheques de pago diferido.' },
    { id: 'prod-2', name: 'Pagaré', type: 'Financiación', features: 'Financiación a corto plazo contra pagaré.' },
    { id: 'prod-3', name: 'FCE', type: 'Financiación', features: 'Descuento de Factura de Crédito Electrónica.' },
    { id: 'prod-4', name: 'ON Simple', type: 'Financiación', features: 'Emisión de Obligación Negociable bajo régimen simple.' },
];

export const industries = ["Agropecuario", "Industria Manufacturera", "Comercio", "Servicios", "Construcción", "Tecnología", "Salud", "Transporte y Logística", "Otro"];

export const initialClients = [
    {
        id: 'client-1',
        type: 'juridica',
        name: 'Soluciones Tech S.A.',
        cuit: '30-12345678-9',
        activity: 'Desarrollo de Software',
        email: 'contacto@solucionestech.com',
        phone: '+54 9 11 1234-5678',
        review: 'Cliente estratégico con alto potencial de crecimiento en el sector tecnológico.',
        relevamiento: 'Contacto inicial realizado el 10/08. Mostraron interés en ONs.',
        industry: 'Tecnología',
        location: 'Buenos Aires, CABA',
        provincia: 'CABA',
        contactPerson: { name: 'Laura Martinez', role: 'Gerente Financiera', email: 'laura.martinez@solucionestech.com', phone: '+54 9 11 8765-4321' },
        hasForeignTrade: true,
        sellsToFinalConsumer: false,
        creationDate: '2024-01-15T10:00:00.000Z',
        lastUpdate: '2025-08-10T11:30:00.000Z',
        partners: [
            { id: 'p-1', type: 'fisica', name: 'Ana Pérez', cuil: '27-98765432-1', share: 60 },
            { id: 'p-2', type: 'juridica', name: 'Inversiones Futuro S.R.L.', cuit: '30-87654321-0', share: 40 }
        ],
        financing: [],
        activities: [],
        documents: [],
        history: [],
        campaignInteractions: {}
    },
    {
        id: 'client-2',
        type: 'fisica',
        name: 'Carlos Gómez',
        cuit: '20-23456789-3',
        email: 'carlos.gomez@email.com',
        phone: '+54 9 351 9876-5432',
        industry: 'Consultoría',
    },
];

export const initialCampaigns = [
    {
        id: 'camp-1',
        name: 'Campaña Saldos Disponibles Q3',
        isArchived: false,
        filters: {
            location: 'Buenos Aires',
            activity: '',
            hasForeignTrade: 'any',
            sellsToFinalConsumer: 'any',
            minAvailableCredit: '100000',
            sgrName: 'any',
            instrument: 'any',
            investmentProfile: 'any'
        }
    },
    {
        id: 'camp-2',
        name: 'Inversores Agresivos Comex',
        isArchived: false,
        filters: {
            location: '',
            activity: '',
            hasForeignTrade: 'true',
            sellsToFinalConsumer: 'any',
            minAvailableCredit: '',
            sgrName: 'any',
            instrument: 'any',
            investmentProfile: 'Agresivo'
        }
    }
];
