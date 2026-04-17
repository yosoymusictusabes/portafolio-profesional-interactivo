/**
 * Controlador de Usuarios
 * Maneja la logica de presentacion del modulo de usuarios
 */

import { UsuariosService } from './usuarios.service.js';
import { TableComponent } from '/shared/ui/components/table.component.js';
import { ModalComponent } from '/shared/ui/components/modal.component.js';
import { FormComponent } from '/shared/ui/components/form.component.js';
import { store } from '/shared/state/store.js';

export class UsuariosController {
  constructor() {
    this.service = new UsuariosService();
    this.usuarios = [];
    this.usuariosFiltrados = [];
  }

  async inicializar() {
    await this.cargarUsuarios();
    this.configurarEventos();
  }

  async cargarUsuarios() {
    try {
      store.establecerCargando(true);
      this.usuarios = await this.service.obtenerTodos();
      this.usuariosFiltrados = [...this.usuarios];
      this.renderizarTabla();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      store.establecerError({ mensaje: error.message });
    } finally {
      store.establecerCargando(false);
    }
  }

  renderizarTabla() {
    const container = document.getElementById('tabla-usuarios-container');
    
    const table = TableComponent.crear({
      columnas: [
        { titulo: 'Nombre', campo: 'nombre' },
        { titulo: 'Email', campo: 'email' },
        { titulo: 'Usuario', campo: 'usuario' },
        { 
          titulo: 'Rol', 
          campo: 'rol',
          render: (valor) => {
            const colores = {
              admin: 'primary',
              cliente: 'secondary',
              publico: 'warning'
            };
            return `<span class="badge badge-${colores[valor]}">${valor}</span>`;
          }
        },
        {
          titulo: 'Estado',
          campo: 'activo',
          render: (valor) => {
            return valor 
              ? '<span class="badge badge-success">Activo</span>'
              : '<span class="badge badge-error">Inactivo</span>';
          }
        }
      ],
      datos: this.usuariosFiltrados,
      acciones: [
        {
          texto: 'Editar',
          tipo: 'primary',
          onClick: (usuario) => this.mostrarFormularioEditar(usuario)
        },
        {
          texto: 'Eliminar',
          tipo: 'error',
          onClick: (usuario) => this.confirmarEliminar(usuario)
        }
      ]
    });
    
    container.innerHTML = '';
    container.appendChild(table);
  }

  configurarEventos() {
    // Boton crear usuario
    const btnCrear = document.getElementById('btn-crear-usuario');
    if (btnCrear) {
      btnCrear.addEventListener('click', () => this.mostrarFormularioCrear());
    }

    // Busqueda
    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) {
      inputBuscar.addEventListener('input', (e) => {
        this.filtrar(e.target.value, null);
      });
    }

    // Filtro por rol
    const selectRol = document.getElementById('select-rol');
    if (selectRol) {
      selectRol.addEventListener('change', (e) => {
        this.filtrar(null, e.target.value);
      });
    }
  }

  filtrar(termino = null, rol = null) {
    let resultado = [...this.usuarios];

    // Filtrar por termino de busqueda
    if (termino) {
      const terminoLower = termino.toLowerCase();
      resultado = resultado.filter(usuario =>
        usuario.nombre.toLowerCase().includes(terminoLower) ||
        usuario.email.toLowerCase().includes(terminoLower) ||
        usuario.usuario.toLowerCase().includes(terminoLower)
      );
    }

    // Filtrar por rol
    if (rol) {
      resultado = resultado.filter(usuario => usuario.rol === rol);
    }

    this.usuariosFiltrados = resultado;
    this.renderizarTabla();
  }

  mostrarFormularioCrear() {
    const form = FormComponent.crear({
      campos: [
        {
          nombre: 'nombre',
          label: 'Nombre Completo',
          tipo: 'text',
          placeholder: 'Ingrese el nombre completo',
          requerido: true
        },
        {
          nombre: 'email',
          label: 'Email',
          tipo: 'email',
          placeholder: 'ejemplo@correo.com',
          requerido: true
        },
        {
          nombre: 'usuario',
          label: 'Usuario',
          tipo: 'text',
          placeholder: 'nombre.usuario',
          requerido: true
        },
        {
          nombre: 'password',
          label: 'Password',
          tipo: 'password',
          placeholder: 'Minimo 8 caracteres',
          requerido: true,
          minLength: 8
        },
        {
          nombre: 'rol',
          label: 'Rol',
          tipo: 'select',
          placeholder: 'Seleccione un rol',
          requerido: true,
          opciones: [
            { valor: 'admin', texto: 'Administrador' },
            { valor: 'cliente', texto: 'Cliente' },
            { valor: 'publico', texto: 'Publico' }
          ]
        }
      ],
      onSubmit: async (datos) => {
        await this.crearUsuario(datos);
      }
    });

    ModalComponent.mostrar({
      titulo: 'Crear Nuevo Usuario',
      contenido: form,
      tamano: 'lg'
    });
  }

  mostrarFormularioEditar(usuario) {
    const form = FormComponent.crear({
      campos: [
        {
          nombre: 'nombre',
          label: 'Nombre Completo',
          tipo: 'text',
          requerido: true
        },
        {
          nombre: 'email',
          label: 'Email',
          tipo: 'email',
          requerido: true
        },
        {
          nombre: 'rol',
          label: 'Rol',
          tipo: 'select',
          requerido: true,
          opciones: [
            { valor: 'admin', texto: 'Administrador' },
            { valor: 'cliente', texto: 'Cliente' },
            { valor: 'publico', texto: 'Publico' }
          ]
        }
      ],
      valores: usuario,
      onSubmit: async (datos) => {
        await this.actualizarUsuario(usuario.id, datos);
      }
    });

    ModalComponent.mostrar({
      titulo: 'Editar Usuario',
      contenido: form,
      tamano: 'lg'
    });
  }

  async crearUsuario(datos) {
    try {
      store.establecerCargando(true);
      await this.service.crear(datos);
      await this.cargarUsuarios();
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Usuario creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  async actualizarUsuario(id, datos) {
    try {
      store.establecerCargando(true);
      await this.service.actualizar(id, datos);
      await this.cargarUsuarios();
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  confirmarEliminar(usuario) {
    ModalComponent.confirmar(
      `¿Estas seguro de eliminar al usuario "${usuario.nombre}"?`,
      async () => {
        await this.eliminarUsuario(usuario.id);
      }
    );
  }

  async eliminarUsuario(id) {
    try {
      store.establecerCargando(true);
      await this.service.eliminar(id);
      await this.cargarUsuarios();
      store.agregarNotificacion({
        tipo: 'success',
        mensaje: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }
}
