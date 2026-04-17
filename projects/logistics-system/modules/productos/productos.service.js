/**
 * Servicio de Productos
 * Maneja operaciones CRUD de productos
 */

import { apiMock } from '/shared/core/api.mock.js';
import { AuthService } from '/shared/auth/auth.service.js';

export class ProductosService {
  constructor() {
    this.endpoint = 'productos';
    this.authService = new AuthService();
  }

  async obtenerTodos(filtros = {}) {
    if (!this.authService.tienePermiso('productos', 'leer')) {
      throw new Error('No tienes permiso para ver productos');
    }

    const response = await apiMock.get(this.endpoint, filtros);
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async obtenerPorId(id) {
    if (!this.authService.tienePermiso('productos', 'leer')) {
      throw new Error('No tienes permiso para ver productos');
    }

    const response = await apiMock.getById(this.endpoint, id);
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async crear(datos) {
    if (!this.authService.tienePermiso('productos', 'crear')) {
      throw new Error('No tienes permiso para crear productos');
    }

    this.validarDatos(datos);

    const response = await apiMock.post(this.endpoint, {
      ...datos,
      activo: true
    });
    
    if (response.status === 201) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async actualizar(id, datos) {
    if (!this.authService.tienePermiso('productos', 'actualizar')) {
      throw new Error('No tienes permiso para actualizar productos');
    }

    this.validarDatos(datos, true);

    const response = await apiMock.put(this.endpoint, id, datos);
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  async eliminar(id) {
    if (!this.authService.tienePermiso('productos', 'eliminar')) {
      throw new Error('No tienes permiso para eliminar productos');
    }

    const response = await apiMock.delete(this.endpoint, id);
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  validarDatos(datos, esActualizacion = false) {
    if (!esActualizacion) {
      if (!datos.nombre || datos.nombre.trim() === '') {
        throw new Error('El nombre es requerido');
      }

      if (!datos.precio || datos.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      if (datos.stock === undefined || datos.stock < 0) {
        throw new Error('El stock debe ser mayor o igual a 0');
      }
    }

    if (datos.precio && datos.precio <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (datos.stock !== undefined && datos.stock < 0) {
      throw new Error('El stock debe ser mayor o igual a 0');
    }
  }

  async buscar(termino) {
    const productos = await this.obtenerTodos();
    
    if (!termino) return productos;
    
    const terminoLower = termino.toLowerCase();
    
    return productos.filter(producto => 
      producto.nombre.toLowerCase().includes(terminoLower) ||
      producto.categoria?.toLowerCase().includes(terminoLower)
    );
  }

  async filtrarPorCategoria(categoria) {
    if (!categoria) return this.obtenerTodos();
    
    return this.obtenerTodos({ categoria });
  }

  async filtrarPorStock(tipo) {
    const productos = await this.obtenerTodos();
    
    if (tipo === 'disponible') {
      return productos.filter(p => p.stock > 0);
    } else if (tipo === 'agotado') {
      return productos.filter(p => p.stock === 0);
    }
    
    return productos;
  }
}
