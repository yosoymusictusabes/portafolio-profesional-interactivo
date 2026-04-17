/**
 * Controlador de Perfil
 * Permite ver y editar el perfil del usuario actual
 */

import { AuthService } from '/shared/auth/auth.service.js';
import { FormComponent } from '/shared/ui/components/form.component.js';
import { ModalComponent } from '/shared/ui/components/modal.component.js';
import { apiMock } from '/shared/core/api.mock.js';
import { store } from '/shared/state/store.js';

export class PerfilController {
  constructor() {
    this.authService = new AuthService();
    this.usuario = null;
  }

  inicializar() {
    this.usuario = this.authService.obtenerUsuarioActual();
    this.renderizar();
  }

  renderizar() {
    const container = document.getElementById('perfil-container');
    
    const html = `
      <div class="perfil-content">
        <div class="perfil-card">
          <div class="perfil-header">
            <div class="perfil-avatar">
              ${this.usuario.nombre.charAt(0).toUpperCase()}
            </div>
            <div class="perfil-info">
              <h2>${this.usuario.nombre}</h2>
              <p class="perfil-rol">
                <span class="badge badge-primary">${this.usuario.rol}</span>
              </p>
            </div>
          </div>

          <div class="perfil-body">
            <div class="perfil-field">
              <label>Email:</label>
              <span>${this.usuario.email}</span>
            </div>
            <div class="perfil-field">
              <label>Usuario:</label>
              <span>${this.usuario.usuario}</span>
            </div>
            <div class="perfil-field">
              <label>Rol:</label>
              <span>${this.usuario.rol}</span>
            </div>
          </div>

          <div class="perfil-actions">
            <button id="btn-editar-perfil" class="btn btn-primary">
              Editar Perfil
            </button>
            <button id="btn-cambiar-password" class="btn btn-secondary">
              Cambiar Contraseña
            </button>
          </div>
        </div>

        <div class="perfil-stats">
          <h3>Información de Sesión</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-label">ID de Usuario</span>
              <span class="stat-value">${this.usuario.id}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Nivel de Acceso</span>
              <span class="stat-value">${this.obtenerNivelAcceso()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    this.configurarEventos();
  }

  configurarEventos() {
    document.getElementById('btn-editar-perfil')?.addEventListener('click', () => {
      this.mostrarFormularioEditar();
    });

    document.getElementById('btn-cambiar-password')?.addEventListener('click', () => {
      this.mostrarFormularioCambiarPassword();
    });
  }

  mostrarFormularioEditar() {
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
        }
      ],
      valores: this.usuario,
      onSubmit: async (datos) => {
        await this.actualizarPerfil(datos);
      }
    });

    ModalComponent.mostrar({
      titulo: 'Editar Perfil',
      contenido: form,
      tamano: 'md'
    });
  }

  mostrarFormularioCambiarPassword() {
    const form = FormComponent.crear({
      campos: [
        {
          nombre: 'passwordActual',
          label: 'Contraseña Actual',
          tipo: 'password',
          requerido: true,
          minLength: 8
        },
        {
          nombre: 'passwordNueva',
          label: 'Contraseña Nueva',
          tipo: 'password',
          requerido: true,
          minLength: 8
        },
        {
          nombre: 'passwordConfirmar',
          label: 'Confirmar Contraseña',
          tipo: 'password',
          requerido: true,
          minLength: 8,
          validar: (valor) => {
            const passwordNueva = document.querySelector('[name="passwordNueva"]')?.value;
            if (valor !== passwordNueva) {
              return 'Las contraseñas no coinciden';
            }
            return true;
          }
        }
      ],
      onSubmit: async (datos) => {
        await this.cambiarPassword(datos);
      }
    });

    ModalComponent.mostrar({
      titulo: 'Cambiar Contraseña',
      contenido: form,
      tamano: 'md'
    });
  }

  async actualizarPerfil(datos) {
    try {
      store.establecerCargando(true);

      // Actualizar en API Mock
      const response = await apiMock.put('usuarios', this.usuario.id, {
        nombre: datos.nombre,
        email: datos.email
      });

      if (response.status === 200) {
        // Actualizar usuario en sesión
        this.usuario.nombre = datos.nombre;
        this.usuario.email = datos.email;
        
        // Actualizar sesión
        this.authService.refrescarSesion();
        
        // Re-renderizar
        this.renderizar();

        store.agregarNotificacion({
          tipo: 'success',
          mensaje: 'Perfil actualizado exitosamente'
        });
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  async cambiarPassword(datos) {
    try {
      store.establecerCargando(true);

      // Validar password actual (simulado)
      // En producción esto se haría en el backend
      
      // Actualizar password en API Mock
      const response = await apiMock.put('usuarios', this.usuario.id, {
        password: datos.passwordNueva
      });

      if (response.status === 200) {
        store.agregarNotificacion({
          tipo: 'success',
          mensaje: 'Contraseña actualizada exitosamente'
        });

        // Opcional: cerrar sesión después de cambiar password
        setTimeout(() => {
          ModalComponent.confirmar(
            '¿Deseas cerrar sesión para iniciar con la nueva contraseña?',
            () => {
              this.authService.logout();
            }
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      ModalComponent.alerta(error.message);
    } finally {
      store.establecerCargando(false);
    }
  }

  obtenerNivelAcceso() {
    const niveles = {
      admin: 'Completo',
      cliente: 'Limitado',
      publico: 'Solo Lectura'
    };
    return niveles[this.usuario.rol] || 'Desconocido';
  }
}
