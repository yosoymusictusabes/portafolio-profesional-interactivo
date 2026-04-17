/**
 * Componente Modal reutilizable
 */

export class ModalComponent {
  constructor(opciones = {}) {
    this.titulo = opciones.titulo || 'Modal';
    this.contenido = opciones.contenido || '';
    this.onCerrar = opciones.onCerrar || (() => {});
    this.onAceptar = opciones.onAceptar || null;
    this.textoAceptar = opciones.textoAceptar || 'Aceptar';
    this.textoCancelar = opciones.textoCancelar || 'Cancelar';
    this.tamano = opciones.tamano || 'md'; // sm, md, lg
    this.modal = null;
  }

  renderizar() {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Crear modal
    this.modal = document.createElement('div');
    this.modal.className = `modal modal-${this.tamano}`;
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <h3 class="modal-title">${this.titulo}</h3>
      <button class="modal-close" aria-label="Cerrar">&times;</button>
    `;
    
    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    
    if (typeof this.contenido === 'string') {
      body.innerHTML = this.contenido;
    } else {
      body.appendChild(this.contenido);
    }
    
    // Footer
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn btn-secondary';
    btnCancelar.textContent = this.textoCancelar;
    btnCancelar.addEventListener('click', () => this.cerrar());
    
    footer.appendChild(btnCancelar);
    
    if (this.onAceptar) {
      const btnAceptar = document.createElement('button');
      btnAceptar.className = 'btn btn-primary';
      btnAceptar.textContent = this.textoAceptar;
      btnAceptar.addEventListener('click', () => {
        this.onAceptar();
        this.cerrar();
      });
      footer.appendChild(btnAceptar);
    }
    
    // Ensamblar modal
    this.modal.appendChild(header);
    this.modal.appendChild(body);
    this.modal.appendChild(footer);
    
    overlay.appendChild(this.modal);
    
    // Event listeners
    header.querySelector('.modal-close').addEventListener('click', () => this.cerrar());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.cerrar();
    });
    
    // Agregar al DOM
    document.body.appendChild(overlay);
    
    // Animar entrada
    setTimeout(() => {
      overlay.classList.add('active');
      this.modal.classList.add('active');
    }, 10);
    
    return overlay;
  }

  cerrar() {
    const overlay = this.modal.parentElement;
    overlay.classList.remove('active');
    this.modal.classList.remove('active');
    
    setTimeout(() => {
      overlay.remove();
      this.onCerrar();
    }, 300);
  }

  static mostrar(opciones) {
    const modal = new ModalComponent(opciones);
    return modal.renderizar();
  }

  static confirmar(mensaje, onConfirmar) {
    return ModalComponent.mostrar({
      titulo: 'Confirmar',
      contenido: `<p>${mensaje}</p>`,
      onAceptar: onConfirmar,
      textoAceptar: 'Confirmar',
      textoCancelar: 'Cancelar'
    });
  }

  static alerta(mensaje) {
    return ModalComponent.mostrar({
      titulo: 'Alerta',
      contenido: `<p>${mensaje}</p>`,
      textoCancelar: 'Cerrar'
    });
  }
}
