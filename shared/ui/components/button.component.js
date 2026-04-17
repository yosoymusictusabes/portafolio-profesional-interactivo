/**
 * Componente Button reutilizable
 */

export class ButtonComponent {
  constructor(opciones = {}) {
    this.texto = opciones.texto || 'Button';
    this.tipo = opciones.tipo || 'primary'; // primary, secondary, success, warning, error
    this.onClick = opciones.onClick || (() => {});
    this.disabled = opciones.disabled || false;
    this.icono = opciones.icono || null;
    this.claseAdicional = opciones.claseAdicional || '';
  }

  renderizar() {
    const button = document.createElement('button');
    button.className = `btn btn-${this.tipo} ${this.claseAdicional}`;
    button.disabled = this.disabled;
    
    if (this.icono) {
      button.innerHTML = `<span class="btn-icon">${this.icono}</span> ${this.texto}`;
    } else {
      button.textContent = this.texto;
    }
    
    button.addEventListener('click', this.onClick);
    
    return button;
  }

  static crear(opciones) {
    const component = new ButtonComponent(opciones);
    return component.renderizar();
  }
}
