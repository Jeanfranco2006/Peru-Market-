import type{ AlmacenFormData } from '../../types/inventario/almacen';

const API_URL = '/almacenes';

export const almacenService = {
    create: async (data: AlmacenFormData): Promise<void> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            // Lanzamos el error con la estructura que espera el hook
            throw {
                status: response.status,
                message: errorBody.message,
                errors: errorBody.errors // Para validaciones de campos específicos
            };
        }
    }
};