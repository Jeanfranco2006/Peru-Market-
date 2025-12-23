// almacenService.ts
import type { AlmacenFormData } from "../../types/inventario/almacen";

// 1. CAMBIO IMPORTANTE: Pon la URL completa de tu backend aquí.
// Ejemplo: si tu backend es SpringBoot/Node/Python en el puerto 8080:
const BASE_URL = 'http://localhost:8080'; // CAMBIA ESTO POR TU PUERTO REAL
const API_URL = `${BASE_URL}/api/almacenes`; // Asegúrate si lleva '/api' o no

export const almacenService = {
    create: async (data: AlmacenFormData): Promise<void> => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // 2. PROTECCIÓN CONTRA EL ERROR JSON
                // Intentamos leer el texto primero para ver si es JSON o HTML
                const text = await response.text();
                let errorBody;
                
                try {
                    errorBody = JSON.parse(text);
                } catch {
                    // Si falla el parseo, es que no recibimos JSON (probablemente error 404 o 500 HTML)
                    throw { 
                        status: response.status, 
                        message: `Error del servidor (${response.status}): No se pudo conectar con el backend.` 
                    };
                }

                throw {
                    status: response.status,
                    message: errorBody.message || 'Error desconocido al guardar',
                    errors: errorBody.errors
                };
            }
        } catch (error: any) {
            // Re-lanzamos el error para que el componente lo capture
            throw error;
        }
    }
};