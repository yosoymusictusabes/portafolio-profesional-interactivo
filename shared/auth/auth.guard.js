/**
 * Guardia de autenticacion
 * Protege rutas y valida permisos antes de permitir acceso
 */

import { AuthService } from './auth.service.js';

export class AuthGuard {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Validar si el usuario puede acceder a una ruta
   */
  validarAcceso(rutaRequerida = null) {
    // Verificar si hay sesion activa
    if (!this.authService.validarSesion()) {
      this.redirigirLogin();
      return false;
    }

    // Si no se especifica ruta, solo validar sesion
    if (!rutaRequerida) {
      return true;
    }

    return true;
  }

  /**
   * Validar si el usuario tiene permiso para un modulo y accion
   */
  validarPermiso(modulo, accion) {
    if (!this.authService.validarSesion()) {
      this.redirigirLogin();
      return false;
    }

    const tienePermiso = this.authService.tienePermiso(modulo, accion);
    
    if (!tienePermiso) {
      this.mostrarErrorAccesoDenegado();
      return false;
    }

    return true;
  }

  /**
   * Validar si el usuario tiene un rol especifico
   */
  validarRol(rolesPermitidos = []) {
    if (!this.authService.validarSesion()) {
      this.redirigirLogin();
      return false;
    }

    const rolActual = this.authService.obtenerRolActual();
    
    if (!rolesPermitidos.includes(rolActual)) {
      this.mostrarErrorAccesoDenegado();
      return false;
    }

    return true;
  }

  /**
   * Redirigir a login
   */
  redirigirLogin() {
    const rutaActual = window.location.pathname;
    window.location.href = `/index.html?redirect=${encodeURIComponent(rutaActual)}`;
  }

  /**
   * Mostrar error de acceso denegado
   */
  mostrarErrorAccesoDenegado() {
    alert('Acceso denegado. No tienes permisos para realizar esta accion.');
    window.history.back();
  }

  /**
   * Proteger elemento del DOM segun permisos
   */
  protegerElemento(elemento, modulo, accion) {
    if (!this.authService.tienePermiso(modulo, accion)) {
      elemento.style.display = 'none';
      elemento.disabled = true;
    }
  }

  /**
   * Proteger multiples elementos
   */
  protegerElementos(selector, modulo, accion) {
    const elementos = document.querySelectorAll(selector);
    elementos.forEach(elemento => {
      this.protegerElemento(elemento, modulo, accion);
    });
  }
}
