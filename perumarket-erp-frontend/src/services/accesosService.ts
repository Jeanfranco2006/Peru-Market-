// accesosService.ts
import { api } from './api';

export interface Usuario {
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

export interface CreateUsuarioRequest {
  username: string;
  password: string;
  estado: string;
  idRol: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
}

export interface UpdateUsuarioRequest {
  username: string;
  password?: string;
  estado: string;
  idRol: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  usuariosCount?: number;
  modulosActivosCount?: number;
}

export interface RolForDropdown {
  id: number;
  nombre: string;
}

export interface Modulo {
  id: number;
  nombre: string;
  descripcion: string;
  ruta: string;
}

export interface RolePermission {
  idModulo: number;
  nombreModulo?: string;
  hasAccess: boolean;
}

export interface UpdatePermissionsRequest {
  idRol: number;
  permissions: RolePermission[];
}

export const accesosService = {
  // ========== USUARIOS ==========
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const response = await api.get('/accesos/usuarios');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo usuarios:', error);
      throw new Error('Error al cargar usuarios: ' + error.message);
    }
  },

  async testConnection(): Promise<string> {
    try {
      console.log('🔍 Probando conexión con backend...');
      const response = await api.get('/accesos/test');
      console.log('✅ Respuesta del backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error de conexión:', error);
      if (error.response) {
        throw new Error(`Error ${error.response.status}: ${error.response.data}`);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else {
        throw new Error(`Error de configuración: ${error.message}`);
      }
    }
  },

  async getUsuarioById(id: number): Promise<Usuario> {
    const response = await api.get(`/accesos/usuarios/${id}`);
    return response.data;
  },

  async createUsuario(usuario: CreateUsuarioRequest): Promise<Usuario> {
    try {
      const response = await api.post('/accesos/usuarios', usuario);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando usuario:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Error al crear usuario: ' + error.message);
    }
  },

  async updateUsuario(id: number, usuario: UpdateUsuarioRequest): Promise<Usuario> {
    try {
      const response = await api.put(`/accesos/usuarios/${id}`, usuario);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error actualizando usuario:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Error al actualizar usuario: ' + error.message);
    }
  },

  async deleteUsuario(id: number): Promise<void> {
    try {
      await api.delete(`/accesos/usuarios/${id}`);
    } catch (error: any) {
      console.error('❌ Error eliminando usuario:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Error al eliminar usuario: ' + error.message);
    }
  },

  // ========== ROLES ==========
  async getRoles(): Promise<Rol[]> {
    try {
      const response = await api.get('/accesos/roles');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo roles:', error);
      throw new Error('Error al cargar roles: ' + error.message);
    }
  },

  async getRolesForDropdown(): Promise<RolForDropdown[]> {
    try {
      const response = await api.get('/accesos/roles/dropdown');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo roles para dropdown:', error);
      throw new Error('Error al cargar roles: ' + error.message);
    }
  },

  async getRolById(id: number): Promise<Rol> {
    try {
      const response = await api.get(`/accesos/roles/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo rol:', error);
      throw new Error('Error al cargar rol: ' + error.message);
    }
  },

  async createRol(rol: Omit<Rol, 'id'>): Promise<Rol> {
    try {
      const response = await api.post('/accesos/roles', rol);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando rol:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Error al crear rol: ' + error.message);
    }
  },

  async updateRol(id: number, rol: Omit<Rol, 'id'>): Promise<Rol> {
    try {
      const response = await api.put(`/accesos/roles/${id}`, rol);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error actualizando rol:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Error al actualizar rol: ' + error.message);
    }
  },

  async deleteRol(id: number): Promise<void> {
    try {
      await api.delete(`/accesos/roles/${id}`);
    } catch (error: any) {
      console.error('❌ Error eliminando rol:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Error al eliminar rol: ' + error.message);
    }
  },

  // ========== MÓDULOS ==========
  async getModulos(): Promise<Modulo[]> {
    const response = await api.get('/accesos/modulos');
    return response.data;
  },

  async getModuloById(id: number): Promise<Modulo> {
    const response = await api.get(`/accesos/modulos/${id}`);
    return response.data;
  },

  async createModulo(modulo: Omit<Modulo, 'id'>): Promise<Modulo> {
    const response = await api.post('/accesos/modulos', modulo);
    return response.data;
  },

  async updateModulo(id: number, modulo: Omit<Modulo, 'id'>): Promise<Modulo> {
    const response = await api.put(`/accesos/modulos/${id}`, modulo);
    return response.data;
  },

  async deleteModulo(id: number): Promise<void> {
    await api.delete(`/accesos/modulos/${id}`);
  },

  // ========== PERMISOS ==========
  async getPermissionsByRol(rolId: number): Promise<RolePermission[]> {
    try {
      const response = await api.get(`/accesos/roles/${rolId}/permisos`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo permisos:', error);
      throw new Error('Error al cargar permisos: ' + error.message);
    }
  },

  async updatePermissions(request: UpdatePermissionsRequest): Promise<void> {
    try {
      await api.put('/accesos/roles/permisos', request);
    } catch (error: any) {
      console.error('❌ Error actualizando permisos:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw new Error('Error al actualizar permisos: ' + error.message);
    }
  },

  // ========== RENIEC ==========
  // En accesosService.ts - actualiza la función consultarReniec
async consultarReniec(dni: string): Promise<{
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: string;
}> {
  try {
    console.log('🔍 Consultando RENIEC para DNI:', dni);
    
    // Validar formato DNI
    if (!dni || dni.length !== 8 || !/^\d+$/.test(dni)) {
      throw new Error('DNI debe tener exactamente 8 dígitos numéricos');
    }

    const response = await api.get(`/accesos/personas/consulta-reniec/${dni}`);
    
    console.log('✅ Respuesta RENIEC completa:', response.data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error en la consulta RENIEC');
    }

    if (!response.data.data) {
      throw new Error('No se recibieron datos del servidor');
    }

    return {
      nombres: response.data.data.nombres || '',
      apellidoPaterno: response.data.data.apellidoPaterno || '',
      apellidoMaterno: response.data.data.apellidoMaterno || '',
      direccion: response.data.data.direccion || ''
    };
  } catch (error: any) {
    console.error('❌ Error consultando RENIEC:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Mensajes de error específicos
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message.includes('Network Error')) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error al consultar RENIEC: ' + error.message);
    }
  }
},

  // ========== DEPENDENCIAS ==========
  async checkRolDependencies(id: number): Promise<{usuariosAsociados: number, permisosAsociados: number}> {
    try {
      const response = await api.get(`/accesos/roles/${id}/dependencies`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error verificando dependencias del rol:', error);
      throw new Error('Error al verificar dependencias: ' + error.message);
    }
  }
};