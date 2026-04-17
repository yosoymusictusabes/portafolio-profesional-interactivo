/**
 * Gestion de sesion de usuario
 * Maneja persistencia en localStorage
 */

export class Session {
  constructor() {
    this.claveStorage = 'portafolio_sesion';
  }

  /**
   * Guardar sesion en localStorage
   */
  guardarSesion(datos) {
    const sesion = {
      token: datos.token,
      usuario: datos.usuario,
      fechaInicio: new Date().toISOString(),
      ultimaActividad: new Date().toISOString()
    };

    localStorage.setItem(this.claveStorage, JSON.stringify(sesion));
  }

  /**
   * Obtener sesion actual
   */
  obtenerSesion() {
    const sesionString = localStorage.getItem(this.claveStorage);
    
    if (!sesionString) {
      return null;
    }

    try {
      return JSON.parse(sesionString);
    } catch (error) {
      console.error('Error al parsear sesion:', error);
      return null;
    }
  }

  /**
   * Actualizar ultima actividad
   */
  actualizarActividad() {
    const sesion = this.obtenerSesion();
    
    if (sesion) {
      sesion.ultimaActividad = new Date().toISOString();
      localStorage.setItem(this.claveStorage, JSON.stringify(sesion));
    }
  }

  /**
   * Actualizar token
   */
  actualizarToken(nuevoToken) {
    const sesion = this.obtenerSesion();
    
    if (sesion) {
      sesion.token = nuevoToken;
      sesion.ultimaActividad = new Date().toISOString();
      localStorage.setItem(this.claveStorage, JSON.stringify(sesion));
    }
  }

  /**
   * Validar si la sesion es valida
   */
  validarSesion() {
    const sesion = this.obtenerSesion();
    
    if (!sesion) {
      return false;
    }

    // Validar que no haya expirado (24 horas de inactividad)
    const tiempoExpiracion = 24 * 60 * 60 * 1000;
    const ultimaActividad = new Date(sesion.ultimaActividad);
    const tiempoTranscurrido = Date.now() - ultimaActividad.getTime();

    if (tiempoTranscurrido > tiempoExpiracion) {
      this.limpiarSesion();
      return false;
    }

    // Actualizar ultima actividad
    this.actualizarActividad();

    return true;
  }

  /**
   * Limpiar sesion
   */
  limpiarSesion() {
    localStorage.removeItem(this.claveStorage);
  }

  /**
   * Obtener token actual
   */
  obtenerToken() {
    const sesion = this.obtenerSesion();
    return sesion?.token || null;
  }

  /**
   * Obtener usuario actual
   */
  obtenerUsuario() {
    const sesion = this.obtenerSesion();
    return sesion?.usuario || null;
  }

  /**
   * Verificar si hay sesion activa
   */
  tieneSesionActiva() {
    return this.validarSesion();
  }
}
