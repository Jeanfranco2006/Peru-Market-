import { api } from './api';

export interface ProfileData {
  id: number;
  username: string;
  estado: string;
  persona: {
    id: number;
    tipoDocumento: string;
    numeroDocumento: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    telefono: string;
    fechaNacimiento: string;
    direccion: string;
  };
  rol: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}

export interface UpdateProfileRequest {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SystemInfo {
  version: string;
  nombre: string;
  totalUsuarios: number;
  usuariosActivos: number;
}

export const configuracionService = {
  async getProfile(userId: number): Promise<ProfileData> {
    const response = await api.get(`/configuracion/perfil/${userId}`);
    return response.data;
  },

  async updateProfile(userId: number, data: UpdateProfileRequest): Promise<ProfileData> {
    const response = await api.put(`/configuracion/perfil/${userId}`, data);
    return response.data;
  },

  async changePassword(userId: number, data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
    const response = await api.put(`/configuracion/password/${userId}`, data);
    return response.data;
  },

  async getSystemInfo(): Promise<SystemInfo> {
    const response = await api.get('/configuracion/sistema');
    return response.data;
  }
};
