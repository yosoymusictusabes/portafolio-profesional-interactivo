/**
 * App - Inicializacion y configuracion de la aplicacion
 * Punto de entrada principal del sistema
 */

import { router } from './router.js';
import { store } from '../state/store.js';
import { AuthService } from '../auth/auth.service.js';
import { apiMock } from './api.mock.js';

export class App {
  constructor() {
    this.router = router;
    this.store = store;
    this.authService = new AuthService();
    this.apiMock = apiMock;
    this.inicializado = false;
  }

  /**
   * Inicializar aplicacion
   */
  async inicializar() {
    if (this.inicializado) {
      console.warn('La aplicacion ya esta inicializada');
      return;
    }

    try {
      console.log('Inicializando aplicacion...');

      // 1. Configurar API Mock
      this.configurarApiMock();

      // 2. Configurar Router
      this.configurarRouter();

      // 3. Configurar Store
      this.configurarStore();

      // 4. Restaurar sesion si existe
      this.restaurarSesion();

      // 5. Inicializar router
      this.router.inicializar();

      // 6. Configurar manejadores globales
      this.configurarManejadoresGlobales();

      this.inicializado = true;
      console.log('Aplicacion inicializada correctamente');

    } catch (error) {
      console.error('Error al inicializar aplicacion:', error);
      this.manejarErrorInicializacion(error);
    }
  }

  /**
   * Configurar API Mock
   */
  configurarApiMock() {
    this.apiMock.inicializarDatosPrueba();
    console.log('API Mock configurada');
  }

  /**
   * Configurar Router
   */
  configurarRouter() {
    // Las rutas se registran en cada proyecto individual
    console.log('Router configurado');
  }

  /**
   * Configurar Store
   */
  configurarStore() {
    // Suscribirse a cambios importantes
    this.store.suscribirse('usuario', (nuevoUsuario) => {
      console.log('Usuario actualizado:', nuevoUsuario);
    });

    this.store.suscribirse('error', (error) => {
      if (error) {
        this.mostrarError(error);
      }
    });

    console.log('Store configurado');
  }

  /**
   * Restaurar sesion si existe
   */
  restaurarSesion() {
    if (this.authService.validarSesion()) {
      const usuario = this.authService.obtenerUsuarioActual();
      this.store.actualizarEstado('usuario', usuario);
      console.log('Sesion restaurada:', usuario);
    }
  }

  /**
   * Configurar manejadores globales
   */
  configurarManejadoresGlobales() {
    // Manejar errores no capturados
    window.addEventListener('error', (event) => {
      console.error('Error no capturado:', event.error);
      this.store.establecerError({
        mensaje: 'Ha ocurrido un error inesperado',
        detalles: event.error?.message
      });
    });

    // Manejar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promesa rechazada:', event.reason);
      this.store.establecerError({
        mensaje: 'Error en operacion asincrona',
        detalles: event.reason
      });
    });

    // Actualizar actividad de sesion
    document.addEventListener('click', () => {
      if (this.authService.validarSesion()) {
        this.authService.refrescarSesion();
      }
    });

    console.log('Manejadores globales configurados');
  }

  /**
   * Mostrar error al usuario
   */
  mostrarError(error) {
    console.error('Error:', error);
    
    // Aqui se podria mostrar un toast o modal
    if (error.mensaje) {
      alert(error.mensaje);
    }
  }

  /**
   * Manejar error de inicializacion
   */
  manejarErrorInicializacion(error) {
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Error al inicializar la aplicacion</h1>
        <p>${error.message}</p>
        <button onclick="location.reload()">Recargar</button>
      </div>
    `;
  }

  /**
   * Obtener instancia del router
   */
  obtenerRouter() {
    return this.router;
  }

  /**
   * Obtener instancia del store
   */
  obtenerStore() {
    return this.store;
  }

  /**
   * Obtener instancia del auth service
   */
  obtenerAuthService() {
    return this.authService;
  }
}

// Instancia singleton
export const app = new App();
