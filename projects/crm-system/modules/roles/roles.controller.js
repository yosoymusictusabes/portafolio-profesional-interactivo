/**
 * Controlador de Roles
 * Muestra información de roles y permisos
 */

import { rolesConfig } from '/shared/auth/roles.config.js';

export class RolesController {
  constructor() {
    this.roles = rolesConfig;
  }

  inicializar() {
    this.renderizar();
  }

  renderizar() {
    const container = document.getElementById('roles-container');
    
    const html = `
      <div class="roles-grid">
        ${Object.keys(this.roles).map(rolKey => this.renderizarRol(rolKey, this.roles[rolKey])).join('')}
      </div>
      
      <div class="permisos-matriz" style="margin-top: var(--spacing-xl);">
        <h3>Matriz de Permisos</h3>
        ${this.renderizarMatrizPermisos()}
      </div>
    `;
    
    container.innerHTML = html;
  }

  renderizarRol(key, rol) {
    const colores = {
      admin: 'primary',
      cliente: 'secondary',
      publico: 'warning'
    };

    return `
      <div class="rol-card">
        <div class="rol-header">
          <h3>${rol.nombre}</h3>
          <span class="badge badge-${colores[key]}">Nivel ${rol.nivel}</span>
        </div>
        <div class="rol-body">
          <h4>Permisos:</h4>
          <div class="permisos-list">
            ${Object.keys(rol.permisos).map(modulo => `
              <div class="permiso-item">
                <strong>${modulo}:</strong>
                ${rol.permisos[modulo].length > 0 
                  ? rol.permisos[modulo].map(p => `<span class="badge badge-success">${p}</span>`).join(' ')
                  : '<span class="badge badge-error">Sin acceso</span>'
                }
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderizarMatrizPermisos() {
    const modulos = ['usuarios', 'roles', 'perfil', 'productos', 'ordenes', 'estados'];
    const roles = ['admin', 'cliente', 'publico'];

    return `
      <table class="table">
        <thead>
          <tr>
            <th>Módulo</th>
            ${roles.map(rol => `<th>${this.roles[rol].nombre}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${modulos.map(modulo => `
            <tr>
              <td><strong>${modulo}</strong></td>
              ${roles.map(rol => {
                const permisos = this.roles[rol].permisos[modulo] || [];
                return `
                  <td>
                    ${permisos.length > 0 
                      ? permisos.map(p => `<span class="badge badge-success">${p}</span>`).join(' ')
                      : '<span class="badge badge-error">❌</span>'
                    }
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}
