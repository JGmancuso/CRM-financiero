// src/services/bcraService.js

// --- DATOS DE EJEMPLO (MOCKS) ---
const mockApiResponses = {
    "30715277014": { "results": { "identificacion": "30715277014", "denominacion": "Kennbal SRL", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "BANCO DE GALICIA Y BUENOS AIRES S.A.", "situacion": 1, "monto": 115029 }, { "entidad": "BANCO DE LA NACION ARGENTINA", "situacion": 1, "monto": 72231 }] }] }},
    "30717345882": { "results": { "identificacion": "30717345882", "denominacion": "M y M SAS", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "BANCO BBVA ARGENTINA S.A.", "situacion": 1, "monto": 41861 }, { "entidad": "BANCO DE SANTA CRUZ S.A.", "situacion": 1, "monto": 24491 }] }] }},
    "20238991294": { "results": { "identificacion": "20238991294", "denominacion": "Borgarello Gustavo Claudio", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "BANCO MACRO S.A.", "situacion": 2, "monto": 56322 }] }] }},
    "20309158955": { "results": { "identificacion": "20309158955", "denominacion": "Usuario de Prueba Nuevo", "periodos": [{ "periodo": "202508", "entidades": [{ "entidad": "BANCO SANTANDER ARGENTINA S.A.", "situacion": 1, "monto": 85000 }] }] }}
};

const mockRejectedChecks = {
    "30715277014": { "results": { "causales": [] } },
    "30717345882": { "results": { "causales": [] } },
    "20238991294": { "results": { "causales": [{ "causal": "SIN FONDOS", "entidades": [{ "detalle": [{ "fechaRechazo": "2025-07-15", "monto": 50000 }] }] }] } },
    "20309158955": { "results": { "causales": [] } }
};

// --- CONSTANTES Y HELPERS ---
const bankNameMapping = {
    'banco de la nacion argentina': 'BNA',
    'banco bbva argentina s.a.': 'BBVA',
    'industrial and commercial bank of china': 'ICBC',
    'banco santander argentina s.a.': 'Santander',
    'banco de galicia y buenos aires s.a.': 'Galicia',
    'banco ggal sa': 'GGAL',
    'banco comafi sociedad anonima': 'COMAFI',
    'banco macro s.a.': 'Macro',
    'banco de inversion y comercio exterior s.a.': 'BICE',
    'banco hipotecario s.a.': 'Hipotecario',
    'banco credicoop cooperativo limitado': 'CREDICOOP',
    'banco supervielle s.a.': 'Supervielle',
    'volkswagen financial services compañia financiera s.a.': 'Volkswagen',
    'toyota compañía financiera de argentina s.a.': 'Toyota Cred',
    'rombo compañía financiera s.a.': 'Renault Cred',
    'banco de santa cruz s.a.': 'Banco Sta Cruz',
    'mercadolibre s.r.l.': 'Mdo Libre',
    'banco patagonia s.a.': 'Patagonia',
    'john deere credit compañía financiera s.a.':'Deere',
    'banco de la provincia de buenos aires':'BAPRO',
};
const sortedBankKeys = Object.keys(bankNameMapping).sort((a, b) => b.length - a.length);


export const getShortBankName = (fullName) => {
    if (!fullName) return "N/A";
    const lowerCaseName = fullName.toLowerCase().trim();
    for (const key of sortedBankKeys) {
        if (lowerCaseName.includes(key)) return bankNameMapping[key];
    }
    return fullName;
};

export const getStatusColor = (status) => {
    const colors = ['bg-gray-300', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
    return colors[status] || colors[0];
};

// --- FUNCIÓN DE TRANSFORMACIÓN DE DATOS ---
export const transformBcraData = (apiData, checksData) => {
    const transformed = { totalDebt: 0, allPeriods: [], rejectedChecks: [] };
    const periodos = apiData?.results?.periodos;
    if (Array.isArray(periodos) && periodos.length > 0) {
        transformed.allPeriods = periodos.map(periodo => ({
            period: periodo.periodo,
            entities: (periodo.entidades || []).map(e => ({
                entidad: getShortBankName(e.entidad),
                situacion: e.situacion,
                monto: (e.monto || 0) * 1000
            }))
        }));
        const latestPeriodEntities = transformed.allPeriods[0]?.entities || [];
        transformed.totalDebt = latestPeriodEntities.reduce((sum, e) => sum + e.monto, 0);
    }
    const causales = checksData?.results?.causales;
    if (Array.isArray(causales) && causales.length > 0) {
        transformed.rejectedChecks = causales.flatMap(c => 
            Array.isArray(c?.entidades) ? c.entidades.flatMap(e => 
                Array.isArray(e?.detalle) ? e.detalle.map(d => ({...d, causal: c.causal})) : []
            ) : []
        );
    }
    return transformed;
};

// --- FUNCIÓN DE CONSULTA PRINCIPAL ---
export const fetchBcraData = async (cuit) => {
    const formattedId = cuit.replace(/-/g, '').trim();
    const urlDeudas = `https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/Historicas/${formattedId}`;
    const urlCheques = `https://api.bcra.gob.ar/CentralDeDeudores/v1.0/ChequesRechazados/${formattedId}`;

    try {
        const [resDeudas, resCheques] = await Promise.all([fetch(urlDeudas), fetch(urlCheques)]);
        let dataDeudas, dataCheques;

        if (resDeudas.ok) { 
            dataDeudas = await resDeudas.json();
        } else if (resDeudas.status === 404) {
            throw new Error("No se encontraron datos para el CUIT ingresado en la Central de Deudores del BCRA.");
        } else { 
            throw new Error(`Error en la API de Deudas: ${resDeudas.status}`); 
        }

        if (resCheques.ok) { 
            dataCheques = await resCheques.json(); 
        } else if (resCheques.status === 404) { 
            dataCheques = { results: { causales: [] } }; 
        } else { 
            throw new Error(`Error en la API de Cheques: ${resCheques.status}`); 
        }

        return transformBcraData(dataDeudas, dataCheques);

    } catch (error) {
        console.error("Falló la conexión con la API del BCRA:", error);
        throw new Error("No se pudo conectar con el servicio del BCRA. Verifica tu conexión y la configuración del proxy.");
    }
};