// src/data.js

// Definimos los checklists primero para poder usarlos como plantilla
export const sgrChecklists = {
    fisica: ["DNI", "Constancia de Monotributo/Autónomo", "Última DDJJ de IIBB", "Manifestación de Bienes"],
    juridica: ["Estatuto Social", "Último Acta de Directorio", "Últimos 3 Balances", "Ventas post-balance"]
};

// Ahora, creamos las SGRs iniciales con su propio checklist
export const initialSGRs = [
    { 
        id: 'sgr-1', 
        name: 'Garantizar SGR', 
        totalQuota: 5000000,
        // Añadimos el checklist aquí, como una copia
        checklist: JSON.parse(JSON.stringify(sgrChecklists))
    },
    { 
        id: 'sgr-2', 
        name: 'Acindar Pymes SGR', 
        totalQuota: 8000000,
        // Y aquí también
        checklist: JSON.parse(JSON.stringify(sgrChecklists))
    }
];

export const FUNNEL_STAGES = {
    prospect: 'Prospecto',
    info_request: 'Solicitud de Información',
    folder_assembly: 'Armado de Carpeta',
    in_qualification: 'En Calificación',
    qualified: 'Calificado (Ganado)',
    unqualified: 'No Calificado (Perdido)',
    account_opening: 'Apertura Cuenta Comitente'
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
        status: FUNNEL_STAGES.qualified,
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
        qualifications: [
            { id: 'q-1', type: 'SGR', name: 'Garantizar SGR', lineAmount: 3000000, lineExpiryDate: '2026-12-31', destination: 'Capital de Trabajo' },
            { id: 'q-2', type: 'Banco', name: 'Banco Galicia', lineAmount: 10000000, lineExpiryDate: '2025-10-20', destination: 'Compra de Maquinaria' }
        ],
        financing: [
            { id: 'f1', instrument: 'ON Simple', details: 'Clase II', amount: 1000000, commission: 20000, sgr: { isQualified: false, qualificationId: null }, schedule: [{ date: '2025-09-15', amount: 50000, type: 'Intereses' }, { date: '2026-03-15', amount: 50000, type: 'Intereses' }, { date: '2026-09-15', amount: 1050000, type: 'Amortización' }] },
            { id: 'f2', instrument: 'Cheque', details: 'N° 12345', amount: 2500000, commission: 50000, sgr: { isQualified: true, qualificationId: 'q-1' }, schedule: [{ date: '2025-10-20', amount: 2500000, type: 'Vencimiento' }] }
        ],
        activities: [
            { id: 'a1', type: 'event', title: 'Reunión de seguimiento trimestral', date: new Date(Date.now() + 6 * 60 * 1000).toISOString(), note: 'Confirmar asistencia de todos los socios. Preparar reporte de rendimiento.', completed: false },
        ],
        documents: [
            { id: 'd1', type: 'file', name: 'Balance 2024.pdf', category: 'Balances', uploadDate: '2025-07-15' },
            { id: 'd2', type: 'link', name: 'Estatuto Social (Drive)', category: 'Legales', uploadDate: '2025-07-10', url: 'https://docs.google.com/document/d/example' }
        ],
        history: [],
        campaignInteractions: {}
    },
    {
        id: 'client-2',
        type: 'fisica',
        name: 'Carlos Gómez',
        cuil: '20-23456789-3',
        birthDate: '1985-05-20',
        email: 'carlos.gomez@email.com',
        phone: '+54 9 351 9876-5432',
        hasIndependentActivity: true,
        industry: 'Consultoría',
        review: 'Interesado en opciones de financiamiento para su consultora.',
        relevamiento: '',
        status: FUNNEL_STAGES.in_qualification,
        location: 'Córdoba, Capital',
        provincia: 'Córdoba',
        contactPerson: { name: 'Carlos Gómez', role: 'Titular', email: 'carlos.gomez@email.com', phone: '+54 9 351 9876-5432' },
        hasForeignTrade: false,
        sellsToFinalConsumer: true,
        creationDate: '2025-03-20T15:00:00.000Z',
        lastUpdate: '2025-07-22T09:00:00.000Z',
        qualifications: [
            { id: 'q-3', type: 'SGR', name: 'Acindar Pymes SGR', lineAmount: 500000, lineExpiryDate: '2025-09-02', destination: 'Facturas' }
        ],
        financing: [
            { id: 'f3', instrument: 'Pagaré', details: 'A 90 días', amount: 150000, commission: 3000, sgr: { isQualified: false, qualificationId: null }, schedule: [{ date: '2024-11-10', amount: 150000, type: 'Vencimiento' }] } 
        ],
        activities: [
            { id: 'a3', type: 'task', title: 'Analizar scoring crediticio', date: '2025-08-13T14:00:00', note: 'Revisar informe de Veraz y Nosis.', completed: true },
            { id: 'a4', type: 'task', title: 'RECORDATORIO Vto. Línea: Acindar Pymes SGR', date: '2025-08-13T09:00:00', note: 'La línea de calificación por $500,000 vence el 2/9/2025.', completed: false }
        ],
        documents: [
            { id: 'd3', type: 'file', name: 'DDJJ-IIBB-2024.pdf', category: 'Impuestos', uploadDate: '2025-08-01' }
        ],
        history: [],
        campaignInteractions: {}
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