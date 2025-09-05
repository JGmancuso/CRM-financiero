// src/services/googleAuthService.js

// 👇 Pega aquí tus credenciales 👇
const GOOGLE_CLIENT_ID = "NN"; // Este ya está correcto.
const GOOGLE_API_KEY = "NN";   // Pega la API Key que creaste en Google Cloud.


// Simplificamos los scopes a lo esencial por ahora
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar.events";

let tokenClient;

export const initGoogleClient = (updateSignInStatus) => {
    // Carga de script para la autenticación (GIS)
    const scriptGis = document.createElement('script');
    scriptGis.src = 'https://accounts.google.com/gsi/client';
    scriptGis.async = true;
    scriptGis.defer = true;
    scriptGis.onload = () => {
        try {
            tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        window.gapi.client.setToken(tokenResponse);
                        updateSignInStatus(true);
                    }
                },
            });
        } catch (error) {
            console.error("Error al inicializar el cliente de token de Google:", error);
            alert("Error al inicializar la autenticación de Google. Revisa la consola.");
        }
    };
    document.body.appendChild(scriptGis);

    // Carga de script para las APIs (GAPI)
    const scriptGapi = document.createElement('script');
    scriptGapi.src = 'https://apis.google.com/js/api.js';
    scriptGapi.async = true;
    scriptGapi.defer = true;
    scriptGapi.onload = () => {
        window.gapi.load('client', () => {
            window.gapi.client.init({
                apiKey: GOOGLE_API_KEY,
                discoveryDocs: [
                    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
                    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
                ],
            }).then(
                () => console.log("GAPI client inicializado con éxito."),
                (error) => {
                    console.error("Error al inicializar el cliente GAPI:", error);
                    alert(`Error al conectar con las APIs de Google. Detalles en la consola. Error: ${error.details}`);
                }
            );
        });
    };
    document.body.appendChild(scriptGapi);
};

export const signIn = () => {
    if (!tokenClient) {
        alert("El cliente de autenticación de Google aún no está listo. Intenta de nuevo.");
        return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
};

export const signOut = () => {
    const token = window.gapi.client.getToken();
    if (token) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
            window.gapi.client.setToken('');
            window.location.reload(); // Recargamos para refrescar el estado en toda la app
        });
    }
};
