/**
 * Controlador de Estadisticas
 */

import { ProductosService } from '../productos/productos.service.js';
import { OrdenesService } from '../ordenes/ordenes.service.js';
import { store } from '/shared/state/store.js';

export class EstadisticasController {
  constructor() {
    this.productosService = new ProductosService();
    this.ordenesService = new OrdenesService();
  }

  async inicializar() {
    await this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    try {
      store.establecerCargando(true);
      
      const productos = await this.productosService.obtenerTodos();
      const ordenes = await this.ordenesService.obtenerTodas();
      
      this.renderizarEstadisticas(productos, ordenes);
    } catch (error) {
      console.error('Error al cargar estadisticas:', error);
      store.establecerError({ mensaje: error.message });
    } finally {
      store.establecerCargando(false);
    }
  }

  renderizarEstadisticas(productos, ordenes) {
    const container = document.getElementById('estadisticas-container');
    
    // Calcular estadisticas
    const totalProductos = productos.length;
    const productosDisponibles = productos.filter(p => p.stock > 0).length;
    const productosAgotados = productos.filter(p => p.stock === 0).length;
    
    const totalOrdenes = ordenes.length;
    const ordenesPendientes = ordenes.filter(o => o.estado === 'pendiente').length;
    const ordenesProcesando = ordenes.filter(o => o.estado === 'procesando').length;
    const ordenesEnviadas = ordenes.filter(o => o.estado === 'enviado').length;
    const ordenesEntregadas = ordenes.filter(o => o.estado === 'entregado').length;
    const ordenesCanceladas = ordenes.filter(o => o.estado === 'cancelado').length;
    
    const totalVentas = ordenes
      .filter(o => o.estado !== 'cancelado')
      .reduce((sum, o) => sum + o.total, 0);
    
    const valorInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

    const html = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-value">${totalProductos}</div>
          <div class="stat-label">Total Productos</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">${productosDisponibles}</div>
          <div class="stat-label">Productos Disponibles</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">❌</div>
          <div class="stat-value">${productosAgotados}</div>
          <div class="stat-label">Productos Agotados</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">$${valorInventario.toFixed(2)}</div>
          <div class="stat-label">Valor Inventario</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-value">${totalOrdenes}</div>
          <div class="stat-label">Total Ordenes</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-value">${ordenesPendientes}</div>
          <div class="stat-label">Pendientes</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-value">${ordenesProcesando}</div>
          <div class="stat-label">Procesando</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚚</div>
          <div class="stat-value">${ordenesEnviadas}</div>
          <div class="stat-label">Enviadas</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">${ordenesEntregadas}</div>
          <div class="stat-label">Entregadas</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚫</div>
          <div class="stat-value">${ordenesCanceladas}</div>
          <div class="stat-label">Canceladas</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💵</div>
          <div class="stat-value">$${totalVentas.toFixed(2)}</div>
          <div class="stat-label">Total Ventas</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-value">$${(totalVentas / (totalOrdenes || 1)).toFixed(2)}</div>
          <div class="stat-label">Promedio por Orden</div>
        </div>
      </div>

      <div style="margin-top: var(--spacing-xl);">
        <h3>Distribucion de Estados</h3>
        <div class="estados-timeline">
          ${this.renderizarEstadoTimeline('Pendiente', ordenesPendientes, totalOrdenes)}
          ${this.renderizarEstadoTimeline('Procesando', ordenesProcesando, totalOrdenes)}
          ${this.renderizarEstadoTimeline('Enviado', ordenesEnviadas, totalOrdenes)}
          ${this.renderizarEstadoTimeline('Entregado', ordenesEntregadas, totalOrdenes)}
          ${this.renderizarEstadoTimeline('Cancelado', ordenesCanceladas, totalOrdenes)}
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  }

  renderizarEstadoTimeline(nombre, cantidad, total) {
    const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0;
    const activo = cantidad > 0 ? 'active' : '';

    return `
      <div class="timeline-item ${activo}">
        <div class="timeline-content">
          <div class="timeline-title">${nombre}</div>
          <div class="timeline-date">${cantidad} ordenes (${porcentaje}%)</div>
        </div>
      </div>
    `;
  }
}
