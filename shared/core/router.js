/**
 * Router - Sistema de navegacion con guardias
 * Maneja rutas y proteccion de acceso
 */

import { AuthGuard } from '../auth/auth.guard.js';

export class Router {
  constructor() {
    this.rutas = new Map();
    this.guardias = new Map();
    this.authGuard = new AuthGuard();
    this.rutaActual = null;
    this.rutaAnterior = null;
  }

  /**
   * Registrar una ruta
   */
  registrarRuta(path, componente, opciones = {}) {
    this.rutas.set(path, {
      componente,
      requiereAuth: opciones.requiereAuth || false,
      roles: opciones.roles || [],
      permisos: opciones.permisos || null
    });
  }

  /**
   * Navegar a una ruta
   */
  async navegar(path, datos = {}) {
    const configuracionRuta = this.rutas.get(path);
    
    if (!configuracionRuta) {
      console.error(`Ruta no encontrada: ${path}`);
      this.navegarError404();
      return false;
    }

    // Validar autenticacion si es requerida
    if (configuracionRuta.requiereAuth) {
      if (!this.authGuard.validarAcceso()) {
        return false;
      }
    }

    // Validar roles si estan especificados
    if (configuracionRuta.roles.length > 0) {
      if (!this.authGuard.validarRol(configuracionRuta.roles)) {
        return false;
      }
    }

    // Validar permisos si estan especificados
    if (configuracionRuta.permisos) {
      const { modulo, accion } = configuracionRuta.permisos;
      if (!this.authGuard.validarPermiso(modulo, accion)) {
        return false;
      }
    }

    // Guardar ruta anterior
    this.rutaAnterior = this.rutaActual;
    this.rutaActual = path;

    // Renderizar componente
    try {
      await configuracionRuta.componente(datos);
      this.actualizarHistorial(path);
      return true;
    } catch (error) {
      console.error('Error al renderizar componente:', error);
      this.navegarError500();
      return false;
    }
  }

  /**
   * Obtener ruta actual
   */
  obtenerRutaActual() {
    return this.rutaActual;
  }

  /**
   * Obtener ruta anterior
   */
  obtenerRutaAnterior() {
    return this.rutaAnterior;
  }

  /**
   * Volver a la ruta anterior
   */
  volver() {
    if (this.rutaAnterior) {
      this.navegar(this.rutaAnterior);
    } else {
      window.history.back();
    }
  }

  /**
   * Actualizar historial del navegador
   */
  actualizarHistorial(path) {
    window.history.pushState({ path }, '', path);
  }

  /**
   * Navegar a error 404
   */
  navegarError404() {
    console.error('Pagina no encontrada');
    // Aqui se podria renderizar una pagina 404 personalizada
  }

  /**
   * Navegar a error 500
   */
  navegarError500() {
    console.error('Error interno del servidor');
    // Aqui se podria renderizar una pagina 500 personalizada
  }

  /**
   * Inicializar router
   */
  inicializar() {
    // Manejar navegacion con botones atras/adelante
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.path) {
        this.navegar(event.state.path);
      }
    });

    // Manejar clicks en enlaces
    document.addEventListener('click', (event) => {
      const enlace = event.target.closest('a[data-route]');
      if (enlace) {
        event.preventDefault();
        const path = enlace.getAttribute('data-route');
        this.navegar(path);
      }
    });
  }

  /**
   * Obtener parametros de la URL
   */
  obtenerParametrosUrl() {
    const params = new URLSearchParams(window.location.search);
    const resultado = {};
    
    for (const [clave, valor] of params) {
      resultado[clave] = valor;
    }
    
    return resultado;
  }

  /**
   * Construir URL con parametros
   */
  construirUrl(path, params = {}) {
    const url = new URL(path, window.location.origin);
    
    Object.keys(params).forEach(clave => {
      url.searchParams.append(clave, params[clave]);
    });
    
    return url.toString();
  }
}

// Instancia singleton
export const router = new Router();
