// src/types/auth.ts
export interface Module {
  id: number;
  nombre: string;
  descripcion: string;
  ruta: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  rol: string;
  email: string;
}

export interface AuthData {
  success: boolean;
  message: string;
  token: string;
  user: UserInfo;
  modules: Module[];
}

export interface LoginRequest {
  username: string;
  password: string;
}