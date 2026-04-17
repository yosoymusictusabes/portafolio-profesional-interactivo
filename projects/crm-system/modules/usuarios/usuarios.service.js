/**
 * Servicio de Usuarios
 * Maneja operaciones CRUD de usuarios
 */

import { apiMock } from '/shared/core/api.mock.js';
import { AuthService } from '/shared/auth/auth.service.js';

export class UsuariosService {
  constructor() {
    this.endpoint = 'usuarios';
    this.authService = new AuthService();
  }

  /**
   * Obtener todos los usuarios
   */
  async obtenerTodos(filtros = {}) {
    // Validar permiso
    if (!this.authService.tienePermiso('usuarios', 'leer')) {
      throw new Error('No tienes permiso para ver usuarios');
    }

    const response = await apiMock.get(this.endpoint, filtros);
    
    if (response.status === 200) {
      // Filtrar datos sensibles
      return response.data.map(usuario => ({
        ...usuario,
        password: undefined
      }));
    }
    
    throw new Error(response.message);
  }

  /**
   * Obtener usuario por ID
   */
  async obtenerPorId(id) {
    if (!this.authService.tienePermiso('usuarios', 'leer')) {
      throw new Error('No tienes permiso para ver usuarios');
    }

    const response = await apiMock.getById(this.endpoint, id);
    
    if (response.status === 200) {
      const usuario = { ...response.data };
      delete usuario.password;
      return usuario;
    }
    
    throw new Error(response.message);
  }

  /**
   * Crear nuevo usuario
   */
  async crear(datos) {
    if (!this.authService.tienePermiso('usuarios', 'crear')) {
      throw new Error('No tienes permiso para crear usuarios');
    }

    // Validar datos
    this.validarDatos(datos);

    // Verificar que el email no exista
    const usuarios = await this.obtenerTodos();
    const emailExiste = usuarios.some(u => u.email === datos.email);
    
    if (emailExiste) {
      throw new Error('El email ya esta registrado');
    }

    const response = await apiMock.post(this.endpoint, {
      ...datos,
      activo: true
    });
    
    if (response.status === 201) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  /**
   * Actualizar usuario
   */
  async actualizar(id, datos) {
    if (!this.authService.tienePermiso('usuarios', 'actualizar')) {
      throw new Error('No tienes permiso para actualizar usuarios');
    }

    // Validar datos
    this.validarDatos(datos, true);

    const response = await apiMock.put(this.endpoint, id, datos);
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  /**
   * Eliminar usuario
   */
  async eliminar(id) {
    if (!this.authService.tienePermiso('usuarios', 'eliminar')) {
      throw new Error('No tienes permiso para eliminar usuarios');
    }

    // No permitir eliminar el usuario actual
    const usuarioActual = this.authService.obtenerUsuarioActual();
    if (usuarioActual.id === id) {
      throw new Error('No puedes eliminar tu propio usuario');
    }

    const response = await apiMock.delete(this.endpoint, id);
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(response.message);
  }

  /**
   * Validar datos de usuario
   */
  validarDatos(datos, esActualizacion = false) {
    if (!esActualizacion) {
      if (!datos.nombre || datos.nombre.trim() === '') {
        throw new Error('El nombre es requerido');
      }

      if (!datos.email || datos.email.trim() === '') {
        throw new Error('El email es requerido');
      }

      if (!datos.usuario || datos.usuario.trim() === '') {
        throw new Error('El usuario es requerido');
      }

      if (!datos.password || datos.password.length < 8) {
        throw new Error('La password debe tener minimo 8 caracteres');
      }

      if (!datos.rol) {
        throw new Error('El rol es requerido');
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (datos.email && !emailRegex.test(datos.email)) {
      throw new Error('Email invalido');
    }

    // Validar rol
    const rolesValidos = ['admin', 'cliente', 'publico'];
    if (datos.rol && !rolesValidos.includes(datos.rol)) {
      throw new Error('Rol invalido');
    }
  }

  /**
   * Buscar usuarios
   */
  async buscar(termino) {
    const usuarios = await this.obtenerTodos();
    
    if (!termino) return usuarios;
    
    const terminoLower = termino.toLowerCase();
    
    return usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(terminoLower) ||
      usuario.email.toLowerCase().includes(terminoLower) ||
      usuario.usuario.toLowerCase().includes(terminoLower)
    );
  }

  /**
   * Filtrar por rol
   */
  async filtrarPorRol(rol) {
    if (!rol) return this.obtenerTodos();
    
    return this.obtenerTodos({ rol });
  }
}
