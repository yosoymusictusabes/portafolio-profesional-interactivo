/**
 * Servicio de Ordenes
 */

import { apiMock } from '/shared/core/api.mock.js';
import { AuthService } from '/shared/auth/auth.service.js';

export class OrdenesService {
  constructor() {
    this.endpoint = 'ordenes';
    this.authService = new AuthService();
  }

  async obtenerTodas(filtros = {}) {
    if (!this.authService.tienePermiso('ordenes', 'leer')) {
      throw new Error('No tienes permiso para ver ordenes');
    }

    const response = await apiMock.get(this.endpoint, filtros);
    
    if (response.status === 200) {
      const usuario = this.authService.obtenerUsuarioActual();
      
      // Si es cliente, solo mostrar sus propias ordenes
      if (usuario.rol === 'cliente') {
        return response.data.filter(orden => orden.clienteId === usuario.id);
      }
      
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async obtenerPorId(id) {
    if (!this.authService.tienePermiso('ordenes', 'leer')) {
      throw new Error('No tienes permiso para ver ordenes');
    }

    const response = await apiMock.getById(this.endpoint, id);
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async crear(datos) {
    if (!this.authService.tienePermiso('ordenes', 'crear')) {
      throw new Error('No tienes permiso para crear ordenes');
    }

    this.validarDatos(datos);

    const usuario = this.authService.obtenerUsuarioActual();
    const numeroOrden = this.generarNumeroOrden();

    const response = await apiMock.post(this.endpoint, {
      ...datos,
      numeroOrden,
      clienteId: usuario.id,
      clienteNombre: usuario.nombre,
      estado: 'pendiente'
    });
    
    if (response.status === 201) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async cambiarEstado(id, nuevoEstado) {
    if (!this.authService.tienePermiso('ordenes', 'actualizar')) {
      throw new Error('No tienes permiso para cambiar estados');
    }

    // Validar transicion de estado
    const orden = await this.obtenerPorId(id);
    if (!this.validarTransicion(orden.estado, nuevoEstado)) {
      throw new Error(`No se puede cambiar de ${orden.estado} a ${nuevoEstado}`);
    }

    const response = await apiMock.put(this.endpoint, id, {
      estado: nuevoEstado
    });
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async cancelar(id) {
    const orden = await this.obtenerPorId(id);
    
    if (orden.estado === 'entregado') {
      throw new Error('No se puede cancelar una orden entregada');
    }

    return this.cambiarEstado(id, 'cancelado');
  }

  validarDatos(datos) {
    if (!datos.productos || datos.productos.length === 0) {
      throw new Error('Debe agregar al menos un producto');
    }

    if (!datos.total || datos.total <= 0) {
      throw new Error('El total debe ser mayor a 0');
    }
  }

  validarTransicion(estadoActual, estadoNuevo) {
    const transicionesPermitidas = {
      pendiente: ['procesando', 'cancelado'],
      procesando: ['enviado', 'cancelado'],
      enviado: ['entregado', 'cancelado'],
      entregado: [],
      cancelado: []
    };

    return transicionesPermitidas[estadoActual]?.includes(estadoNuevo) || false;
  }

  generarNumeroOrden() {
    const fecha = new Date();
    const ano = fecha.getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${ano}-${numero}`;
  }

  async filtrarPorEstado(estado) {
    if (!estado) return this.obtenerTodas();
    
    return this.obtenerTodas({ estado });
  }
}
