// authService.ts
import axios from 'axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  rol: string;
  email: string;
  almacenId?:number;
}

export interface ModuleInfo {
  id: number;
  nombre: string;
  descripcion: string;
  ruta: string;
}

export interface AuthData {
  success: boolean;
  message: string;
  token: string;
  user: UserInfo;
  modules: ModuleInfo[];
}

const API_URL = "http://localhost:8080/api/auth/login";

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthData> {
    try {
      console.log('🔐 Intentando login con:', credentials);
      
      const response = await axios.post<AuthData>(API_URL, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });

      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        this.storeAuthData(response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error en el login');
      }
    } catch (error: any) {
      console.error('❌ Error en authService.login:', error);
      
      if (error.response) {
        throw new Error(error.response.data?.message || `Error ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error(error.message || 'Error de configuración');
      }
    }
  },

  storeAuthData(data: AuthData) {
    try {
      localStorage.setItem("auth", JSON.stringify(data));
      localStorage.setItem("logged", "true");
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("userRole", data.user.rol);
      
      console.log('💾 Datos de autenticación guardados:', {
        user: data.user.username,
        role: data.user.rol,
        modules: data.modules.length
      });
    } catch (storageError) {
      console.error('❌ Error guardando en localStorage:', storageError);
    }
  },

  getAuthData(): AuthData | null {
    try {
      const data = localStorage.getItem("auth");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Error leyendo auth data:', error);
      return null;
    }
  },

  logout() {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("logged");
      localStorage.removeItem("username");
      localStorage.removeItem("userRole");
      console.log('🚪 Sesión cerrada');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
    }
  },

  isAuthenticated(): boolean {
    const authData = this.getAuthData();
    const isLogged = localStorage.getItem("logged") === "true";
    return !!(authData && authData.token && isLogged);
  },

  getCurrentUser(): UserInfo | null {
    const authData = this.getAuthData();
    return authData?.user || null;
  },

  getUserModules(): ModuleInfo[] {
    const authData = this.getAuthData();
    return authData?.modules || [];
  }
};