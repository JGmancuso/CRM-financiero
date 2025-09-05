// src/utils/historyUtils.js
import React from 'react';
import { Briefcase, CheckSquare, Shield } from 'lucide-react';

export const generateUnifiedHistory = (client, allNegocios = []) => {
    let history = [];

    // 1. Historial del propio cliente
    if (client && client.history) {
        history.push(...client.history.map(item => ({
            ...item,
            source: 'Cliente',
            icon: <Briefcase size={16} className="text-gray-500" />
        })));
    }

    // 2. Historial de los negocios asociados al cliente
    const clientNegocios = (allNegocios || []).filter(n => n.cliente?.id === client?.id);
    
    clientNegocios.forEach(negocio => {
        // 👇 CORRECCIÓN: Nos aseguramos de que 'negocio' y 'negocio.history' existan
        if (negocio && negocio.history) {
            history.push(...negocio.history.map(item => ({
                ...item,
                source: `Negocio: ${negocio.nombre}`,
                description: item.reason,
                icon: <Briefcase size={16} className="text-purple-500" />
            })));
        }
        // Añadimos las calificaciones
        if (negocio && negocio.calificaciones) {
            history.push(...negocio.calificaciones.map(cal => ({
                date: cal.analysisStartDate || cal.fechaPresentacion || new Date().toISOString(),
                type: `Calificación: ${cal.estado || cal.status}`,
                description: `Entidad: ${cal.sgrName || cal.entidad}. ${cal.notes || ''}`,
                source: `Negocio: ${negocio.nombre}`,
                icon: <Shield size={16} className="text-green-500" />
            })));
        }
    });

    // 3. Historial de la agenda (actividades del cliente)
    if (client && client.activities) {
        history.push(...client.activities.map(activity => ({
            date: activity.dueDate || activity.date,
            type: (activity.completed || activity.isCompleted) ? 'Actividad Completada' : 'Actividad Creada',
            description: activity.title || activity.description,
            source: 'Agenda',
            icon: <CheckSquare size={16} className="text-blue-500" />
        })));
    }

    // Ordenamos toda la historia por fecha
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
};