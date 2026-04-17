/**
 * Layout principal de la aplicacion
 */

import { AuthService } from '../../auth/auth.service.js';

export class MainLayout {
  constructor() {
    this.authService = new AuthService();
  }

  renderizar(contenido) {
    const usuario = this.authService.obtenerUsuarioActual();
    
    const layout = `
      <div class="layout-main">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <h2>Portafolio</h2>
          </div>
          
          <nav class="sidebar-nav">
            <a href="/" class="nav-link">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Inicio</span>
            </a>
            
            ${usuario ? `
              <div class="nav-section">
                <span class="nav-section-title">CRM System</span>
                <a href="/projects/crm-system/index.html" class="nav-link">
                  <span class="nav-icon">👥</span>
                  <span class="nav-text">Usuarios</span>
                </a>
                <a href="/projects/crm-system/index.html#roles" class="nav-link">
                  <span class="nav-icon">🔐</span>
                  <span class="nav-text">Roles</span>
                </a>
              </div>
              
              <div class="nav-section">
                <span class="nav-section-title">Logistics</span>
                <a href="/projects/logistics-system/index.html" class="nav-link">
                  <span class="nav-icon">📦</span>
                  <span class="nav-text">Productos</span>
                </a>
                <a href="/projects/logistics-system/index.html#ordenes" class="nav-link">
                  <span class="nav-icon">📋</span>
                  <span class="nav-text">Ordenes</span>
                </a>
              </div>
            ` : ''}
          </nav>
          
          <div class="sidebar-footer">
            ${usuario ? `
              <div class="user-info">
                <span class="user-name">${usuario.nombre}</span>
                <span class="user-rol">${usuario.rol}</span>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="logout()">
                Cerrar Sesion
              </button>
            ` : `
              <a href="/login.html" class="btn btn-primary btn-sm">
                Iniciar Sesion
              </a>
            `}
          </div>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
          <div class="content-wrapper">
            ${contenido}
          </div>
        </main>
      </div>
    `;
    
    return layout;
  }

  static aplicar(contenido) {
    const layout = new MainLayout();
    document.body.innerHTML = layout.renderizar(contenido);
  }
}

// Funcion global para logout
window.logout = function() {
  const authService = new AuthService();
  authService.logout();
};
