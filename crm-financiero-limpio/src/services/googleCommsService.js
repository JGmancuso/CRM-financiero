/**
 * Busca en Gmail todos los correos intercambiados con un cliente.
 * @param {string} clientEmail - La dirección de correo del cliente.
 * @returns {Promise<Array>} Una lista de correos (asunto, fecha, remitente).
 */
export const getEmailsForClient = async (clientEmail) => {
  console.log(`Buscando correos de ${clientEmail} en Gmail (a implementar)...`);
  // Aquí iría la lógica para usar la API de Gmail y buscar correos.
  // Devolvería una lista de objetos, cada uno representando un email.
  return [
    { id: 'mail1', subject: 'Consulta sobre calificación', from: clientEmail, date: '2025-08-24' },
    { id: 'mail2', subject: 'RE: Documentación pendiente', from: 'tú', date: '2025-08-25' },
  ];
};

/**
 * Redirige al usuario a la interfaz de Gmail para redactar un nuevo correo.
 * @param {string} clientEmail - La dirección del destinatario.
 */
export const openGmailCompose = (clientEmail) => {
  console.log(`Abriendo Gmail para escribir a ${clientEmail}...`);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${clientEmail}`;
  window.open(gmailUrl, '_blank', 'noopener,noreferrer');
};


/**
 * Crea un evento de seguimiento en Google Calendar para un correo.
 * @param {object} emailInfo - Información del correo (asunto, enlace al correo).
 */
export const createFollowUpEvent = async (emailInfo) => {
  console.log(`Creando evento de seguimiento en Calendar para: '${emailInfo.subject}' (a implementar)...`);
  
  // 1. Calcular la fecha de "3 días hábiles en el futuro".
  const followUpDate = new Date();
  // (Aquí iría la lógica para sumar 3 días hábiles, saltando fines de semana).
  followUpDate.setDate(followUpDate.getDate() + 3); 

  // 2. Preparar el evento para la API de Calendar.
  const event = {
    summary: `Hacer seguimiento: ${emailInfo.subject}`,
    description: `Recordatorio para hacer seguimiento del correo. Link al correo: ${emailInfo.link}`,
    start: { date: followUpDate.toISOString().split('T')[0] },
    end: { date: followUpDate.toISOString().split('T')[0] },
  };

  // 3. Llamar a la API de Google Calendar para crear el evento.
  console.log("Evento a crear:", event);
  return { success: true, eventSummary: event.summary };
};

/**
 * Crea un evento en Google Calendar a partir de una tarea del CRM.
 * @param {object} task - La tarea de tu agenda.
 */
export const createCalendarEventFromTask = async (task) => {
  console.log(`Creando evento en Calendar para: '${task.title}'...`);
  
  if (!window.gapi.client.calendar) {
    console.error("La API de Google Calendar no está cargada.");
    return null;
  }

  // Preparamos el evento para la API de Calendar.
  const event = {
    summary: task.title,
    description: `Tarea del CRM. Cliente: ${task.clientName}\n\nNotas: ${task.details || 'Sin notas.'}`,
    start: {
      date: task.dueDate, // Usamos la fecha de la tarea
      timeZone: 'America/Argentina/Buenos_Aires',
    },
    end: {
      date: task.dueDate,
      timeZone: 'America/Argentina/Buenos_Aires',
    },
  };

  try {
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary', // 'primary' se refiere al calendario principal del usuario
      resource: event,
    });
    console.log("Evento creado:", response.result);
    return response.result;
  } catch (error) {
    console.error("Error al crear el evento en Calendar:", error);
    return null;
  }
};