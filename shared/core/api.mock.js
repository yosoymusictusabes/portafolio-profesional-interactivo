/**
 * API Mock - Simulacion de backend
 * Simula llamadas HTTP con delay y respuestas realistas
 */

export class ApiMock {
  constructor() {
    this.delay = 500; // Simular latencia de red (ms)
    this.baseUrl = '/api';
  }

  /**
   * Simular delay de red
   */
  async simularDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  /**
   * Generar ID unico
   */
  generarId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * GET - Obtener datos
   */
  async get(endpoint, params = {}) {
    await this.simularDelay();
    
    try {
      const clave = this.obtenerClaveStorage(endpoint);
      const datos = JSON.parse(localStorage.getItem(clave)) || [];
      
      // Aplicar filtros si existen
      let resultado = datos;
      if (Object.keys(params).length > 0) {
        resultado = this.aplicarFiltros(datos, params);
      }
      
      return {
        data: resultado,
        status: 200,
        message: 'Datos obtenidos exitosamente'
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: 'Error al obtener datos',
        error: error.message
      };
    }
  }

  /**
   * GET BY ID - Obtener un registro por ID
   */
  async getById(endpoint, id) {
    await this.simularDelay();
    
    try {
      const clave = this.obtenerClaveStorage(endpoint);
      const datos = JSON.parse(localStorage.getItem(clave)) || [];
      const registro = datos.find(item => item.id === id);
      
      if (!registro) {
        return {
          data: null,
          status: 404,
          message: 'Registro no encontrado'
        };
      }
      
      return {
        data: registro,
        status: 200,
        message: 'Registro encontrado'
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: 'Error al obtener registro',
        error: error.message
      };
    }
  }

  /**
   * POST - Crear nuevo registro
   */
  async post(endpoint, datos) {
    await this.simularDelay();
    
    try {
      const clave = this.obtenerClaveStorage(endpoint);
      const lista = JSON.parse(localStorage.getItem(clave)) || [];
      
      // Agregar ID y timestamps
      const nuevoRegistro = {
        id: this.generarId(),
        ...datos,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      lista.push(nuevoRegistro);
      localStorage.setItem(clave, JSON.stringify(lista));
      
      return {
        data: nuevoRegistro,
        status: 201,
        message: 'Registro creado exitosamente'
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: 'Error al crear registro',
        error: error.message
      };
    }
  }

  /**
   * PUT - Actualizar registro existente
   */
  async put(endpoint, id, datos) {
    await this.simularDelay();
    
    try {
      const clave = this.obtenerClaveStorage(endpoint);
      const lista = JSON.parse(localStorage.getItem(clave)) || [];
      const indice = lista.findIndex(item => item.id === id);
      
      if (indice === -1) {
        return {
          data: null,
          status: 404,
          message: 'Registro no encontrado'
        };
      }
      
      // Actualizar registro manteniendo ID y createdAt
      lista[indice] = {
        ...lista[indice],
        ...datos,
        id: lista[indice].id,
        createdAt: lista[indice].createdAt,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(clave, JSON.stringify(lista));
      
      return {
        data: lista[indice],
        status: 200,
        message: 'Registro actualizado exitosamente'
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: 'Error al actualizar registro',
        error: error.message
      };
    }
  }

  /**
   * DELETE - Eliminar registro
   */
  async delete(endpoint, id) {
    await this.simularDelay();
    
    try {
      const clave = this.obtenerClaveStorage(endpoint);
      const lista = JSON.parse(localStorage.getItem(clave)) || [];
      const indice = lista.findIndex(item => item.id === id);
      
      if (indice === -1) {
        return {
          data: null,
          status: 404,
          message: 'Registro no encontrado'
        };
      }
      
      const registroEliminado = lista.splice(indice, 1)[0];
      localStorage.setItem(clave, JSON.stringify(lista));
      
      return {
        data: registroEliminado,
        status: 200,
        message: 'Registro eliminado exitosamente'
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        message: 'Error al eliminar registro',
        error: error.message
      };
    }
  }

  /**
   * Obtener clave de localStorage para un endpoint
   */
  obtenerClaveStorage(endpoint) {
    return `api_${endpoint.replace(/\//g, '_')}`;
  }

  /**
   * Aplicar filtros a los datos
   */
  aplicarFiltros(datos, filtros) {
    return datos.filter(item => {
      return Object.keys(filtros).every(clave => {
        const valorFiltro = filtros[clave];
        const valorItem = item[clave];
        
        if (typeof valorFiltro === 'string') {
          return valorItem?.toString().toLowerCase().includes(valorFiltro.toLowerCase());
        }
        
        return valorItem === valorFiltro;
      });
    });
  }

  /**
   * Limpiar todos los datos del mock
   */
  limpiarDatos() {
    const claves = Object.keys(localStorage);
    claves.forEach(clave => {
      if (clave.startsWith('api_')) {
        localStorage.removeItem(clave);
      }
    });
  }

  /**
   * Inicializar datos de prueba
   */
  inicializarDatosPrueba() {
    // Este metodo puede ser usado para cargar datos iniciales
    console.log('API Mock inicializada');
  }
}

// Instancia singleton
export const apiMock = new ApiMock();
