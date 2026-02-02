import { api } from '../api';

export type EnvioResponse = {
  id: number;
  idVenta: number | null;
  idPedido: number | null;
  estado: string;
  direccionEnvio: string;
  fechaEnvio: string | null;
  fechaEntrega: string | null;
  costoTransporte: number | null;
  observaciones: string | null;
  fechaCreacion: string;
  placaVehiculo: string | null;
  marcaVehiculo: string | null;
  nombreConductor: string | null;
  licenciaConductor: string | null;
  nombreRuta: string | null;
  origenRuta: string | null;
  destinoRuta: string | null;
  totalVenta: number | null;
  nombreCliente: string | null;
  estadoVenta: string | null;
};

export type EnvioRequest = {
  idVenta?: number;
  idPedido?: number;
  idVehiculo?: number;
  idConductor?: number;
  idRuta?: number;
  direccionEnvio: string;
  fechaEnvio?: string;
  fechaEntrega?: string;
  costoTransporte?: number;
  observaciones?: string;
};

export type Vehiculo = {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  capacidadKg: number;
  estado: string;
};

export type Conductor = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  numeroDocumento: string;
  licencia: string;
  categoriaLicencia: string;
  estado: string;
};

export type Ruta = {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
  distanciaKm: number;
  tiempoEstimadoHoras: number;
  costoBase: number;
};

export type VentaResumen = {
  id: number;
  nombreCliente: string;
  total: number;
  estado: string;
  fecha: string | null;
};

export const envioService = {
  // Envios
  async fetchEnvios(): Promise<EnvioResponse[]> {
    const { data } = await api.get('/envios');
    return data;
  },

  async fetchEnvio(id: number): Promise<EnvioResponse> {
    const { data } = await api.get(`/envios/${id}`);
    return data;
  },

  async crearEnvio(envio: EnvioRequest): Promise<EnvioResponse> {
    const { data } = await api.post('/envios', envio);
    return data;
  },

  async actualizarEnvio(id: number, envio: EnvioRequest): Promise<EnvioResponse> {
    const { data } = await api.put(`/envios/${id}`, envio);
    return data;
  },

  async actualizarEstado(id: number, estado: string): Promise<EnvioResponse> {
    const { data } = await api.patch(`/envios/${id}/estado`, { estado });
    return data;
  },

  async eliminarEnvio(id: number): Promise<void> {
    await api.delete(`/envios/${id}`);
  },

  // Vehiculos
  async fetchVehiculos(): Promise<Vehiculo[]> {
    const { data } = await api.get('/vehiculos');
    return data;
  },

  async crearVehiculo(vehiculo: Partial<Vehiculo>): Promise<Vehiculo> {
    const { data } = await api.post('/vehiculos', vehiculo);
    return data;
  },

  async actualizarVehiculo(id: number, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> {
    const { data } = await api.put(`/vehiculos/${id}`, vehiculo);
    return data;
  },

  async eliminarVehiculo(id: number): Promise<void> {
    await api.delete(`/vehiculos/${id}`);
  },

  // Conductores
  async fetchConductores(): Promise<Conductor[]> {
    const { data } = await api.get('/conductores');
    return data;
  },

  async crearConductor(conductor: Partial<Conductor>): Promise<Conductor> {
    const { data } = await api.post('/conductores', conductor);
    return data;
  },

  async actualizarConductor(id: number, conductor: Partial<Conductor>): Promise<Conductor> {
    const { data } = await api.put(`/conductores/${id}`, conductor);
    return data;
  },

  async eliminarConductor(id: number): Promise<void> {
    await api.delete(`/conductores/${id}`);
  },

  // Rutas
  async fetchRutas(): Promise<Ruta[]> {
    const { data } = await api.get('/rutas');
    return data;
  },

  async crearRuta(ruta: Partial<Ruta>): Promise<Ruta> {
    const { data } = await api.post('/rutas', ruta);
    return data;
  },

  async actualizarRuta(id: number, ruta: Partial<Ruta>): Promise<Ruta> {
    const { data } = await api.put(`/rutas/${id}`, ruta);
    return data;
  },

  async eliminarRuta(id: number): Promise<void> {
    await api.delete(`/rutas/${id}`);
  },

  // Ventas (para asociar al envio)
  async fetchVentas(): Promise<VentaResumen[]> {
    const { data } = await api.get('/ventas');
    return data;
  }
};
