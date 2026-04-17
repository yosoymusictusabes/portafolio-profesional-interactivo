/**
 * Componente Table reutilizable
 */

export class TableComponent {
  constructor(opciones = {}) {
    this.columnas = opciones.columnas || [];
    this.datos = opciones.datos || [];
    this.acciones = opciones.acciones || [];
    this.onRowClick = opciones.onRowClick || null;
    this.claseAdicional = opciones.claseAdicional || '';
  }

  renderizar() {
    const table = document.createElement('table');
    table.className = `table ${this.claseAdicional}`;
    
    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    this.columnas.forEach(columna => {
      const th = document.createElement('th');
      th.textContent = columna.titulo;
      if (columna.ancho) {
        th.style.width = columna.ancho;
      }
      headerRow.appendChild(th);
    });
    
    if (this.acciones.length > 0) {
      const th = document.createElement('th');
      th.textContent = 'Acciones';
      th.style.width = '150px';
      headerRow.appendChild(th);
    }
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Body
    const tbody = document.createElement('tbody');
    
    if (this.datos.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = this.columnas.length + (this.acciones.length > 0 ? 1 : 0);
      td.textContent = 'No hay datos disponibles';
      td.className = 'text-center';
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      this.datos.forEach(dato => {
        const tr = document.createElement('tr');
        
        if (this.onRowClick) {
          tr.style.cursor = 'pointer';
          tr.addEventListener('click', () => this.onRowClick(dato));
        }
        
        this.columnas.forEach(columna => {
          const td = document.createElement('td');
          
          if (columna.render) {
            const contenido = columna.render(dato[columna.campo], dato);
            if (typeof contenido === 'string') {
              td.innerHTML = contenido;
            } else {
              td.appendChild(contenido);
            }
          } else {
            td.textContent = dato[columna.campo] || '-';
          }
          
          tr.appendChild(td);
        });
        
        if (this.acciones.length > 0) {
          const td = document.createElement('td');
          td.className = 'table-actions';
          
          this.acciones.forEach(accion => {
            const btn = document.createElement('button');
            btn.className = `btn btn-sm btn-${accion.tipo || 'secondary'}`;
            btn.textContent = accion.texto;
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              accion.onClick(dato);
            });
            td.appendChild(btn);
          });
          
          tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
      });
    }
    
    table.appendChild(tbody);
    
    return table;
  }

  actualizar(nuevosDatos) {
    this.datos = nuevosDatos;
    const nuevoTable = this.renderizar();
    return nuevoTable;
  }

  static crear(opciones) {
    const component = new TableComponent(opciones);
    return component.renderizar();
  }
}
