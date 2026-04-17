/**
 * Servicio de autenticacion
 * Maneja login, logout, validacion de sesion y permisos
 */

import { usuariosMock, validarPermiso } from './roles.config.js';
import { Session } from '../state/session.js';

export class AuthService {
  constructor() {
    this.session = new Session();
  }

  /**
   * Iniciar sesion
   */
  login(usuario, password) {
    // Validar credenciales contra mock
    const usuarioEncontrado = usuariosMock.find(
      u => u.usuario === usuario && u.password === password && u.activo
    );

    if (!usuarioEncontrado) {
      throw new Error('Credenciales invalidas');
    }

    // Generar token simulado
    const token = this.generarTokenSimulado(usuarioEncontrado);

    // Guardar sesion
    this.session.guardarSesion({
      token,
      usuario: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        usuario: usuarioEncontrado.usuario,
        rol: usuarioEncontrado.rol
      }
    });

    return usuarioEncontrado;
  }

  /**
   * Cerrar sesion
   */
  logout() {
    this.session.limpiarSesion();
    window.location.href = '/index.html';
  }

  /**
   * Obtener usuario actual
   */
  obtenerUsuarioActual() {
    const sesion = this.session.obtenerSesion();
    return sesion?.usuario || null;
  }

  /**
   * Validar si hay sesion activa
   */
  validarSesion() {
    return this.session.validarSesion();
  }

  /**
   * Validar si el usuario tiene permiso para una accion
   */
  tienePermiso(modulo, accion) {
    const usuario = this.obtenerUsuarioActual();
    if (!usuario) return false;

    return validarPermiso(usuario.rol, modulo, accion);
  }

  /**
   * Obtener rol del usuario actual
   */
  obtenerRolActual() {
    const usuario = this.obtenerUsuarioActual();
    return usuario?.rol || null;
  }

  /**
   * Generar token simulado (en produccion seria JWT)
   */
  generarTokenSimulado(usuario) {
    const payload = {
      id: usuario.id,
      usuario: usuario.usuario,
      rol: usuario.rol,
      timestamp: Date.now()
    };

    // Simular JWT con base64
    return btoa(JSON.stringify(payload));
  }

  /**
   * Validar token simulado
   */
  validarToken(token) {
    try {
      const payload = JSON.parse(atob(token));
      
      // Validar que no haya expirado (24 horas)
      const tiempoExpiracion = 24 * 60 * 60 * 1000;
      const tiempoTranscurrido = Date.now() - payload.timestamp;
      
      if (tiempoTranscurrido > tiempoExpiracion) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refrescar sesion (renovar token)
   */
  refrescarSesion() {
    const usuario = this.obtenerUsuarioActual();
    if (!usuario) return false;

    const nuevoToken = this.generarTokenSimulado(usuario);
    this.session.actualizarToken(nuevoToken);
    
    return true;
  }
}
