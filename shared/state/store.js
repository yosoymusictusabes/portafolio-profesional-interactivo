/**
 * Store global para gestion de estado
 * Implementa patron Observer para notificar cambios
 */

export class Store {
  constructor() {
    this.estado = {
      usuario: null,
      cargando: false,
      error: null,
      notificaciones: []
    };
    
    this.suscriptores = new Map();
  }

  /**
   * Obtener estado completo
   */
  obtenerEstado() {
    return { ...this.estado };
  }

  /**
   * Obtener valor especifico del estado
   */
  obtenerValor(clave) {
    return this.estado[clave];
  }

  /**
   * Actualizar estado
   */
  actualizarEstado(clave, valor) {
    const valorAnterior = this.estado[clave];
    this.estado[clave] = valor;
    
    // Notificar a suscriptores de esta clave
    this.notificarSuscriptores(clave, valor, valorAnterior);
  }

  /**
   * Actualizar multiples valores del estado
   */
  actualizarMultiple(cambios) {
    Object.keys(cambios).forEach(clave => {
      this.actualizarEstado(clave, cambios[clave]);
    });
  }

  /**
   * Suscribirse a cambios en una clave especifica
   */
  suscribirse(clave, callback) {
    if (!this.suscriptores.has(clave)) {
      this.suscriptores.set(clave, []);
    }
    
    this.suscriptores.get(clave).push(callback);
    
    // Retornar funcion para desuscribirse
    return () => {
      const callbacks = this.suscriptores.get(clave);
      const indice = callbacks.indexOf(callback);
      if (indice > -1) {
        callbacks.splice(indice, 1);
      }
    };
  }

  /**
   * Notificar a todos los suscriptores de una clave
   */
  notificarSuscriptores(clave, valorNuevo, valorAnterior) {
    const callbacks = this.suscriptores.get(clave);
    
    if (callbacks) {
      callbacks.forEach(callback => {
        callback(valorNuevo, valorAnterior);
      });
    }
  }

  /**
   * Limpiar estado
   */
  limpiarEstado() {
    this.estado = {
      usuario: null,
      cargando: false,
      error: null,
      notificaciones: []
    };
    
    this.notificarSuscriptores('*', this.estado, null);
  }

  /**
   * Establecer estado de carga
   */
  establecerCargando(cargando) {
    this.actualizarEstado('cargando', cargando);
  }

  /**
   * Establecer error
   */
  establecerError(error) {
    this.actualizarEstado('error', error);
  }

  /**
   * Limpiar error
   */
  limpiarError() {
    this.actualizarEstado('error', null);
  }

  /**
   * Agregar notificacion
   */
  agregarNotificacion(notificacion) {
    const notificaciones = [...this.estado.notificaciones, {
      id: Date.now(),
      ...notificacion,
      timestamp: new Date().toISOString()
    }];
    
    this.actualizarEstado('notificaciones', notificaciones);
  }

  /**
   * Eliminar notificacion
   */
  eliminarNotificacion(id) {
    const notificaciones = this.estado.notificaciones.filter(n => n.id !== id);
    this.actualizarEstado('notificaciones', notificaciones);
  }

  /**
   * Limpiar todas las notificaciones
   */
  limpiarNotificaciones() {
    this.actualizarEstado('notificaciones', []);
  }
}

// Instancia singleton del store
export const store = new Store();
