/**
 * Componente Form reutilizable
 */

export class FormComponent {
  constructor(opciones = {}) {
    this.campos = opciones.campos || [];
    this.onSubmit = opciones.onSubmit || (() => {});
    this.valores = opciones.valores || {};
    this.claseAdicional = opciones.claseAdicional || '';
  }

  renderizar() {
    const form = document.createElement('form');
    form.className = `form ${this.claseAdicional}`;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const datos = this.obtenerDatos();
      if (this.validar(datos)) {
        this.onSubmit(datos);
      }
    });
    
    this.campos.forEach(campo => {
      const formGroup = this.crearCampo(campo);
      form.appendChild(formGroup);
    });
    
    return form;
  }

  crearCampo(campo) {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    
    // Label
    if (campo.label) {
      const label = document.createElement('label');
      label.textContent = campo.label;
      label.htmlFor = campo.nombre;
      if (campo.requerido) {
        label.innerHTML += ' <span class="text-error">*</span>';
      }
      formGroup.appendChild(label);
    }
    
    // Input
    let input;
    
    switch (campo.tipo) {
      case 'textarea':
        input = document.createElement('textarea');
        input.rows = campo.rows || 4;
        break;
        
      case 'select':
        input = document.createElement('select');
        
        if (campo.placeholder) {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = campo.placeholder;
          input.appendChild(option);
        }
        
        campo.opciones.forEach(opcion => {
          const option = document.createElement('option');
          option.value = opcion.valor;
          option.textContent = opcion.texto;
          input.appendChild(option);
        });
        break;
        
      default:
        input = document.createElement('input');
        input.type = campo.tipo || 'text';
    }
    
    input.name = campo.nombre;
    input.id = campo.nombre;
    input.className = 'form-control';
    
    if (campo.placeholder) {
      input.placeholder = campo.placeholder;
    }
    
    if (campo.requerido) {
      input.required = true;
    }
    
    if (this.valores[campo.nombre]) {
      input.value = this.valores[campo.nombre];
    }
    
    formGroup.appendChild(input);
    
    // Error message
    const errorMsg = document.createElement('span');
    errorMsg.className = 'form-error';
    errorMsg.style.display = 'none';
    formGroup.appendChild(errorMsg);
    
    return formGroup;
  }

  obtenerDatos() {
    const datos = {};
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
      datos[input.name] = input.value;
    });
    
    return datos;
  }

  validar(datos) {
    let valido = true;
    
    this.campos.forEach(campo => {
      const valor = datos[campo.nombre];
      const formGroup = document.querySelector(`#${campo.nombre}`).parentElement;
      const errorMsg = formGroup.querySelector('.form-error');
      
      // Limpiar error anterior
      errorMsg.style.display = 'none';
      errorMsg.textContent = '';
      formGroup.classList.remove('has-error');
      
      // Validar requerido
      if (campo.requerido && !valor) {
        this.mostrarError(formGroup, errorMsg, `${campo.label} es requerido`);
        valido = false;
        return;
      }
      
      // Validar email
      if (campo.tipo === 'email' && valor) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
          this.mostrarError(formGroup, errorMsg, 'Email invalido');
          valido = false;
          return;
        }
      }
      
      // Validar longitud minima
      if (campo.minLength && valor.length < campo.minLength) {
        this.mostrarError(formGroup, errorMsg, `Minimo ${campo.minLength} caracteres`);
        valido = false;
        return;
      }
      
      // Validacion personalizada
      if (campo.validar) {
        const resultado = campo.validar(valor);
        if (resultado !== true) {
          this.mostrarError(formGroup, errorMsg, resultado);
          valido = false;
          return;
        }
      }
    });
    
    return valido;
  }

  mostrarError(formGroup, errorMsg, mensaje) {
    formGroup.classList.add('has-error');
    errorMsg.textContent = mensaje;
    errorMsg.style.display = 'block';
  }

  static crear(opciones) {
    const component = new FormComponent(opciones);
    return component.renderizar();
  }
}
