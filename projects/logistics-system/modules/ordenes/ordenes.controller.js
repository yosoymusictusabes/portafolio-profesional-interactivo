/**
 * Controlador de Ordenes
 */

import { OrdenesService } from './ordenes.service.js';
import { ProductosService } from '../productos/productos.service.js';
import { ModalComponent } from '/shared/ui/components/modal.component.js';
import { store } from '/shared/state/store.js';
import { AuthService } from '/shared/auth/auth.service.js';

export class OrdenesController {
  constructor() {
    this.service = new OrdenesService();
    this.productosService = new ProductosService();
    this.authService = new AuthService();
    this.ordenes = [];
    this.ordenesFiltradas = [];
    this.carrito = [];
  }

  async inicializar() {
    await this.cargarOrdenes();
    this.configurarEventos();
  }

  async cargarOrdenes() {
    try {
      store.establecerCargando(true);
      this.ordenes = await this.service.obtenerTodas();
      this.ordenesFiltradas = [...this.ordenes];
      this.renderizarOrdenes();
    } catch (error) {
      console.error('Error al cargar ordenes:', error);
      store.establecerError({ mensaje: error.message });
    } finally {
      store.establecerCargando(false);
    }
  }

  renderizarOrdenes() {
    const container = document.getElementById('ordenes-container');
    
    if (this.ordenesFiltradas.length === 0) {
      container.innerHTML = '<p class="text-center">No hay ordenes disponibles</p>';
      return;
    }

    const html = this.ordenesFiltradas.map(orden => this.renderizarOrden(orden)).join('');
    container.innerHTML = html;
    this.configurarEventosOrdenes();
  }

  renderizarOrden(orden) {
    const usuario = this.authService.obtenerUsuarioActual();
    const puedeActualizar = usuario.rol === 'admin';

    return `
      <div class="orden-card">
        <div class="orden-header">
          <div>
            <div class="orden-numero">${orden.numeroOrden}</div>
            <small style="color: var(--color-text-light);">Cliente: ${orden.clienteNombre}</small>
          </div>
          <div class="orden-estado">
            <span class="estado-badge estado-${orden.estado}">${orden.estado.toUpperCase()}</span>
          </div>
        </div>

        <div class="orden-body">
          <div class="orden-info">
            <div class="orden-info-item">
              <span class="orden-info-label">Fecha de Creacion</span>
              <span class="orden-info-value">${new Date(orden.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="orden-info-item">
              <span class="orden-info-label">Ultima Actualizacion</span>
              <span class="orden-info-value">${new Date(orden.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div class="orden-productos">
            <h4>Productos:</h4>
            ${orden.productos.map(p => `
              <div class="orden-producto-item">
                <span>${p.nombre} x${p.cantidad}</span>
                <span>$${(p.precio * p.cantidad).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="orden-total">
            <span>Total:</span>
            <span>$${orden.total.toFixed(2)}</span>
          </div>
        </div>

        ${puedeActualizar && orden.estado !== 'entregado' && orden.estado !== 'cancelado' ? `
          <div class="orden-actions">
            ${this.renderizarBotonesEstado(orden)}
            <button class="btn btn-error btn-cancelar" data-id="${orden.id}">
              Cancelar
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderizarBotonesEstado(orden) {
    const transiciones = {
      pendiente: { estado: 'procesando', texto: 'Procesar', tipo: 'primary' },
      procesando: { estado: 'enviado', texto: 'Enviar', tipo: 'primary' },
      enviado: { estado: 'entregado', texto: 'Entregar', tipo: 'success' }
    };

    const transicion = transiciones[orden.estado];
    
    if (!transicion) return '';

    return `
      <button class="btn btn-${transicion.tipo} btn-cambiar-estado" 
              data-id="${orden.id}" 
              data-estado="${transicion.estado}">
        ${transicion.texto}
      </button>
    `;
  }

  configurarEventos() {
    document.getElementById('btn-crear-orden')?.addEventListener('click', () => {
      this.mostrarFormularioCrear();
    });

    document.getElementById('input-buscar-orden')?.addEventListener('input', (e) => {
      this.filtrar(e.target.value, null);
    });

    document.getElementById('select-estado')?.addEventListener('change', (e) => {
      this.filtrar(null, e.target.value);
    });
  }

  configurarEventosOrdenes() {
    document.querySelectorAll('.btn-cambiar-estado').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const estado = e.target.dataset.estado;
        await this.cambiarEstado(id, estado);
      });
    });

    document.querySelectorAll('.btn-cancelar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await this.cancelarOrden(id);
      });
    });
  }

  filtrar(termino = null, estado = null) {
    let resultado = [...this.ordenes];

    if (termino) {
      const terminoLower = termino.toLowerCase();
      resultado = resultado.filter(o =>
        o.numeroOrden.toLowerCase().includes(terminoLower)
      );
    }

    if (estado) {
      resultado = resultado.filter(o => o.estado === estado);
    }

    this.ordenesFiltradas = resultado;
    this.renderizarOrdenes();
  }

  async mostrarFormularioCrear() {
    try {
      const productos = await this.productosService.obtenerTodos();
      const productosDisponibles = productos.filter(p => p.stock > 0);

      if (productosDisponibles.length === 0) {
        ModalComponent.alerta('No hay productos disponibles para crear una orden');
        return;
      }

      this.carrito = [];
      this.mostrarSelectorProductos(productosDisponibles);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      ModalComponent.alerta(error.message);
    }
  }

  mostrarSelectorProductos(productos) {
    const contenido = document.createElement('div');
    contenido.innerHTML = `
      <div style="margin-bottom: var(--spacing-lg);">
        <h4>Seleccionar Productos</h4>
        <div id="productos-selector" style="max-height: 300px; overflow-y: auto;">
          ${productos.map(p => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-sm); border-bottom: 1px solid var(--color-border);">
              <div>
                <strong>${p.nombre}</strong><br>
                <small>$${p.precio.toFixed(2)} - Stock: ${p.stock}</small>
              </div>
              <button class="btn btn-sm btn-primary btn-agregar-producto" 
                      data-id="${p.id}" 
                      data-nombre="${p.nombre}" 
                      data-precio="${p.precio}"
                      data-stock="${p.stock}">
                Agregar
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="carrito-container">
        <div class="carrito-header">
          <h4>Carrito</h4>
        </div>
        <div id="carrito-items" class="carrito-items"></div>
        <div class="carrito-total">
          <span>Total:</span>
          <span id="carrito-total-valor">$0.00</span>
        </div>
        <div class="carrito-actions">
          <button id="btn-confirmar-orden" class="btn btn-primary" disabled>
            Confirmar Orden
          </button>
        </div>
      </div>
    `;

    ModalComponent.mostrar({
      titulo: 'Nueva Orden',
      contenido,
      tamano: 'lg'
    });

    this.configurarEventosCarrito();
  }

  configurarEventosCarrito() {
    document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const producto = {
          id: e.target.dataset.id,
          nombre: e.target.dataset.nombre,
          precio: parseFloat(e.target.dataset.precio),
          stock: parseInt(e.target.dataset.stock),
          cantidad: 1
        };
        this.agregarAlCarrito(producto);
      });
    });
  }

  agregarAlCarrito(producto) {
    const existente = this.carrito.find(p => p.id === producto.id);
    
    if (existente) {
      if (existente.cantidad < producto.stock) {
        existente.cantidad++;
      } else {
        ModalComponent.alerta('No hay suficiente stock');
        return;
      }
    } else {
      this.carrito.push(producto);
    }

    this.actualizarCarrito();
  }

  actualizarCarrito() {
    const container = document.getElementById('carrito-items');
    const totalElement = document.getElementById('carrito-total-valor');
    const btnConfirmar = document.getElementById('btn-confirmar-orden');

    if (this.carrito.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">Carrito vacio</p>';
      totalElement.textContent = '$0.00';
      btnConfirmar.disabled = true;
      return;
    }

    container.innerHTML = this.carrito.map(p => `
      <div class="carrito-item">
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${p.nombre}</div>
          <div class="carrito-item-precio">$${p.precio.toFixed(2)} c/u</div>
        </div>
        <div class="carrito-item-cantidad">
          <button class="btn btn-sm btn-secondary btn-decrementar" data-id="${p.id}">-</button>
          <span>${p.cantidad}</span>
          <button class="btn btn-sm btn-secondary btn-incrementar" data-id="${p.id}">+</button>
          <button class="btn btn-sm btn-error btn-quitar" data-id="${p.id}">×</button>
        </div>
      </div>
    `).join('');

    const total = this.carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    totalElement.textContent = `$${total.toFixed(2)}`;
    btnConfirmar.disabled = false;

    this.configurarEventosBotonesCarrito();
    
    btnConfirmar.onclick = () => this.confirmarOrden();
  }

  configurarEventosBotonesCarrito() {
    document.querySelectorAll('.btn-incrementar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const producto = this.carrito.find(p => p.id === id);
        if (producto && producto.cantidad < producto.stock) {
          producto.cantidad++;
          this.actualizarCarrito();
        }
      });
    });

    document.querySelectorAll('.btn-decrementar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const producto = this.carrito.find(p => p.id === id);
        if (producto && producto.cantidad > 1) {
          producto.cantidad--;
          this.actualizarCarrito();
        }
      });
    });

    document.querySelectorAll('.btn-quitar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.carrito = this.carrito.filter(p => p.id !== id);
        this.actualizarCarrito();
      });
    });
  }

  async confirmarOrden() {
    try {
      store.establecerCargando(true);

      const productos = this.carrito.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio
      }));

      const total = this.carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

      await this.service.crear({
        productos,
        total
      });

      await this.cargarOrdenes();
      
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Orden creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear orden:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  async cambiarEstado(id, nuevoEstado) {
    try {
      store.establecerCargando(true);
      await this.service.cambiarEstado(id, nuevoEstado);
      await this.cargarOrdenes();
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Estado actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  async cancelarOrden(id) {
    ModalComponent.confirmar(
      '¿Estas seguro de cancelar esta orden?',
      async () => {
        try {
          store.establecerCargando(true);
          await this.service.cancelar(id);
          await this.cargarOrdenes();
          store.agregarNotificacion({
            tipo: 'success',
            mensaje: 'Orden cancelada'
          });
        } catch (error) {
          console.error('Error al cancelar orden:', error);
          ModalComponent.alerta(error.message);
        } finally {
          store.establecerCargando(false);
        }
      }
    );
  }
}
