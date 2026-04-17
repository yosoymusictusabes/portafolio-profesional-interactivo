/**
 * Controlador de Productos
 */

import { ProductosService } from './productos.service.js';
import { FormComponent } from '/shared/ui/components/form.component.js';
import { ModalComponent } from '/shared/ui/components/modal.component.js';
import { store } from '/shared/state/store.js';

export class ProductosController {
  constructor() {
    this.service = new ProductosService();
    this.productos = [];
    this.productosFiltrados = [];
  }

  async inicializar() {
    await this.cargarProductos();
    this.configurarEventos();
  }

  async cargarProductos() {
    try {
      store.establecerCargando(true);
      this.productos = await this.service.obtenerTodos();
      this.productosFiltrados = [...this.productos];
      this.renderizarGrid();
    } catch (error) {
      console.error('Error al cargar productos:', error);
      store.establecerError({ mensaje: error.message });
    } finally {
      store.establecerCargando(false);
    }
  }

  renderizarGrid() {
    const container = document.getElementById('productos-grid');
    
    if (this.productosFiltrados.length === 0) {
      container.innerHTML = '<p class="text-center">No hay productos disponibles</p>';
      return;
    }

    const html = `
      <div class="productos-grid">
        ${this.productosFiltrados.map(producto => this.renderizarProducto(producto)).join('')}
      </div>
    `;
    
    container.innerHTML = html;
    this.configurarEventosProductos();
  }

  renderizarProducto(producto) {
    const stockDisponible = producto.stock > 0;
    const stockClass = stockDisponible ? 'stock-disponible' : 'stock-agotado';
    const stockTexto = stockDisponible ? `${producto.stock} disponibles` : 'Agotado';

    return `
      <div class="producto-card" data-id="${producto.id}">
        <div class="producto-imagen">
          📦
        </div>
        <div class="producto-body">
          <div class="producto-header">
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <span class="producto-precio">$${producto.precio.toFixed(2)}</span>
          </div>
          <p class="producto-descripcion">${producto.descripcion || 'Sin descripcion'}</p>
          <div class="producto-info">
            <span class="producto-stock ${stockClass}">
              ${stockTexto}
            </span>
            <span class="producto-categoria">${producto.categoria || 'Sin categoria'}</span>
          </div>
          <div class="producto-actions">
            <button class="btn btn-primary btn-editar" data-id="${producto.id}">
              Editar
            </button>
            <button class="btn btn-error btn-eliminar" data-id="${producto.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
  }

  configurarEventos() {
    document.getElementById('btn-crear-producto')?.addEventListener('click', () => {
      this.mostrarFormularioCrear();
    });

    document.getElementById('input-buscar-producto')?.addEventListener('input', (e) => {
      this.filtrar(e.target.value, null, null);
    });

    document.getElementById('select-categoria')?.addEventListener('change', (e) => {
      this.filtrar(null, e.target.value, null);
    });

    document.getElementById('select-stock')?.addEventListener('change', (e) => {
      this.filtrar(null, null, e.target.value);
    });
  }

  configurarEventosProductos() {
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const producto = this.productos.find(p => p.id === id);
        if (producto) this.mostrarFormularioEditar(producto);
      });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const producto = this.productos.find(p => p.id === id);
        if (producto) this.confirmarEliminar(producto);
      });
    });
  }

  filtrar(termino = null, categoria = null, stock = null) {
    let resultado = [...this.productos];

    if (termino) {
      const terminoLower = termino.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.categoria?.toLowerCase().includes(terminoLower)
      );
    }

    if (categoria) {
      resultado = resultado.filter(p => p.categoria === categoria);
    }

    if (stock === 'disponible') {
      resultado = resultado.filter(p => p.stock > 0);
    } else if (stock === 'agotado') {
      resultado = resultado.filter(p => p.stock === 0);
    }

    this.productosFiltrados = resultado;
    this.renderizarGrid();
  }

  mostrarFormularioCrear() {
    const form = FormComponent.crear({
      campos: [
        {
          nombre: 'nombre',
          label: 'Nombre del Producto',
          tipo: 'text',
          placeholder: 'Ej: Laptop Dell XPS 15',
          requerido: true
        },
        {
          nombre: 'descripcion',
          label: 'Descripcion',
          tipo: 'textarea',
          placeholder: 'Descripcion detallada del producto',
          rows: 3
        },
        {
          nombre: 'precio',
          label: 'Precio',
          tipo: 'number',
          placeholder: '0.00',
          requerido: true
        },
        {
          nombre: 'stock',
          label: 'Stock Disponible',
          tipo: 'number',
          placeholder: '0',
          requerido: true
        },
        {
          nombre: 'categoria',
          label: 'Categoria',
          tipo: 'select',
          placeholder: 'Seleccione una categoria',
          requerido: true,
          opciones: [
            { valor: 'Electronica', texto: 'Electronica' },
            { valor: 'Accesorios', texto: 'Accesorios' },
            { valor: 'Monitores', texto: 'Monitores' }
          ]
        }
      ],
      onSubmit: async (datos) => {
        await this.crearProducto(datos);
      }
    });

    ModalComponent.mostrar({
      titulo: 'Crear Nuevo Producto',
      contenido: form,
      tamano: 'lg'
    });
  }

  mostrarFormularioEditar(producto) {
    const form = FormComponent.crear({
      campos: [
        {
          nombre: 'nombre',
          label: 'Nombre del Producto',
          tipo: 'text',
          requerido: true
        },
        {
          nombre: 'descripcion',
          label: 'Descripcion',
          tipo: 'textarea',
          rows: 3
        },
        {
          nombre: 'precio',
          label: 'Precio',
          tipo: 'number',
          requerido: true
        },
        {
          nombre: 'stock',
          label: 'Stock Disponible',
          tipo: 'number',
          requerido: true
        },
        {
          nombre: 'categoria',
          label: 'Categoria',
          tipo: 'select',
          requerido: true,
          opciones: [
            { valor: 'Electronica', texto: 'Electronica' },
            { valor: 'Accesorios', texto: 'Accesorios' },
            { valor: 'Monitores', texto: 'Monitores' }
          ]
        }
      ],
      valores: producto,
      onSubmit: async (datos) => {
        await this.actualizarProducto(producto.id, datos);
      }
    });

    ModalComponent.mostrar({
      titulo: 'Editar Producto',
      contenido: form,
      tamano: 'lg'
    });
  }

  async crearProducto(datos) {
    try {
      store.establecerCargando(true);
      await this.service.crear({
        ...datos,
        precio: parseFloat(datos.precio),
        stock: parseInt(datos.stock)
      });
      await this.cargarProductos();
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Producto creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  async actualizarProducto(id, datos) {
    try {
      store.establecerCargando(true);
      await this.service.actualizar(id, {
        ...datos,
        precio: parseFloat(datos.precio),
        stock: parseInt(datos.stock)
      });
      await this.cargarProductos();
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  confirmarEliminar(producto) {
    ModalComponent.confirmar(
      `¿Estas seguro de eliminar el producto "${producto.nombre}"?`,
      async () => {
        await this.eliminarProducto(producto.id);
      }
    );
  }

  async eliminarProducto(id) {
    try {
      store.establecerCargando(true);
      await this.service.eliminar(id);
      await this.cargarProductos();
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }
}
