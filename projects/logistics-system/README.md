# Logistics System

Sistema de gestión logística y ERP enfocado en la administración de productos, órdenes y flujos operativos empresariales.

## 🎯 Objetivo

Demostrar capacidades de desarrollo de sistemas con flujos de negocio complejos, cambio de estados y reglas según roles.

## 📋 Problema que Resuelve

Las empresas de logística necesitan gestionar inventarios, procesar órdenes y rastrear estados de envío. Este sistema simula:

- Gestión de inventario de productos
- Procesamiento de órdenes de clientes
- Seguimiento de estados (pendiente → enviado → entregado)
- Control de acceso según rol del usuario

## 🏗️ Arquitectura

```
logistics-system/
├── index.html              # Punto de entrada
├── modules/
│   ├── productos/         # Módulo de productos
│   │   ├── productos.service.js
│   │   ├── productos.controller.js
│   │   └── productos.view.html
│   ├── ordenes/           # Módulo de órdenes
│   │   ├── ordenes.service.js
│   │   ├── ordenes.controller.js
│   │   └── ordenes.view.html
│   └── estados/           # Módulo de estados
│       ├── estados.service.js
│       ├── estados.controller.js
│       └── estados.view.html
├── config/
│   ├── permisos.config.js
│   └── estados.config.js
├── styles/
│   └── logistics.css
└── docs/
    ├── arquitectura.md
    ├── flujo.md
    └── reglas-negocio.md
```

## 🔐 Sistema de Permisos

### Matriz de Acceso

| Módulo    | Admin | Cliente | Público |
|-----------|-------|---------|---------|
| Productos | CRUD  | Ver     | Ver     |
| Órdenes   | CRUD  | Crear   | ❌      |
| Estados   | CRUD  | Ver     | ❌      |

### Reglas de Negocio

- **Admin**: Puede gestionar todo el sistema
- **Cliente**: Puede crear órdenes y ver sus propias órdenes
- **Público**: Solo puede ver catálogo de productos

## 📦 Módulos

### 1. Productos

**Funcionalidades**:
- Listar productos con filtros
- Crear nuevo producto (admin)
- Editar producto existente (admin)
- Eliminar producto (admin)
- Ver detalles de producto (todos)
- Buscar por nombre, categoría, precio

**Campos**:
- Nombre
- Descripción
- Precio
- Stock disponible
- Categoría
- Imagen

### 2. Órdenes

**Funcionalidades**:
- Listar órdenes (admin: todas, cliente: propias)
- Crear nueva orden (admin, cliente)
- Ver detalles de orden
- Cambiar estado de orden (admin)
- Cancelar orden (según estado)

**Campos**:
- Número de orden
- Cliente
- Productos (array)
- Total
- Estado
- Fecha de creación
- Fecha de actualización

### 3. Estados

**Funcionalidades**:
- Ver historial de estados
- Cambiar estado de orden
- Validar transiciones permitidas
- Notificar cambios de estado

**Estados disponibles**:
- `pendiente`: Orden creada, esperando procesamiento
- `procesando`: Orden en preparación
- `enviado`: Orden en tránsito
- `entregado`: Orden completada
- `cancelado`: Orden cancelada

## 🔄 Flujo de Operaciones

### Crear Orden (Cliente)

```
1. Cliente selecciona productos del catálogo
2. Agrega productos al carrito
3. Revisa carrito y cantidades
4. Confirma orden
5. Se valida stock disponible
6. Se crea orden con estado "pendiente"
7. Se actualiza stock de productos
8. Se genera número de orden
9. Se muestra confirmación
```

### Procesar Orden (Admin)

```
1. Admin ve lista de órdenes pendientes
2. Selecciona orden a procesar
3. Verifica productos y stock
4. Cambia estado a "procesando"
5. Prepara productos
6. Cambia estado a "enviado"
7. Ingresa información de envío
8. Cliente recibe notificación
9. Al entregar, cambia estado a "entregado"
```

## 🔀 Máquina de Estados

### Transiciones Permitidas

```
pendiente → procesando → enviado → entregado
    ↓           ↓           ↓
cancelado   cancelado   cancelado
```

### Validaciones

```javascript
const transicionesPermitidas = {
  pendiente: ['procesando', 'cancelado'],
  procesando: ['enviado', 'cancelado'],
  enviado: ['entregado', 'cancelado'],
  entregado: [],
  cancelado: []
};
```

## 🧠 Decisiones Técnicas

### ¿Por qué Máquina de Estados?

- Garantiza consistencia en flujos
- Previene estados inválidos
- Facilita auditoría de cambios
- Refleja procesos empresariales reales

### ¿Por qué Validación de Stock?

- Previene sobreventa
- Simula inventario real
- Demuestra reglas de negocio
- Manejo de concurrencia básico

### ¿Por qué Separación de Módulos?

- Cada módulo es independiente
- Facilita mantenimiento
- Permite reutilización
- Escalable a microservicios

## 🚀 Cómo Escalar a Backend Real

### Paso 1: API de Productos

```javascript
// Antes (Mock)
class ProductosService {
  obtenerProductos() {
    return JSON.parse(localStorage.getItem('productos')) || [];
  }
}

// Después (API Real)
class ProductosService {
  async obtenerProductos(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`/api/productos?${params}`);
    return await response.json();
  }
}
```

### Paso 2: Procesamiento de Órdenes

```javascript
// Antes (Síncrono)
function crearOrden(orden) {
  const ordenes = obtenerOrdenes();
  ordenes.push(orden);
  guardarOrdenes(ordenes);
  return orden;
}

// Después (Asíncrono con validaciones)
async function crearOrden(orden) {
  // Validar stock en tiempo real
  const stockDisponible = await validarStock(orden.productos);
  if (!stockDisponible) throw new Error('Stock insuficiente');
  
  // Crear orden en base de datos
  const response = await fetch('/api/ordenes', {
    method: 'POST',
    body: JSON.stringify(orden)
  });
  
  return await response.json();
}
```

### Paso 3: Base de Datos

```sql
-- Tabla de productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  categoria VARCHAR(100),
  imagen_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE ordenes (
  id SERIAL PRIMARY KEY,
  numero_orden VARCHAR(50) UNIQUE NOT NULL,
  cliente_id INTEGER REFERENCES usuarios(id),
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de detalle de órdenes
CREATE TABLE orden_detalles (
  id SERIAL PRIMARY KEY,
  orden_id INTEGER REFERENCES ordenes(id),
  producto_id INTEGER REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Tabla de historial de estados
CREATE TABLE orden_estados_historial (
  id SERIAL PRIMARY KEY,
  orden_id INTEGER REFERENCES ordenes(id),
  estado_anterior VARCHAR(50),
  estado_nuevo VARCHAR(50) NOT NULL,
  usuario_id INTEGER REFERENCES usuarios(id),
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Arquitectura**: MVC con State Machine
- **Patrones**: State Pattern, Observer Pattern, Factory Pattern
- **Persistencia**: localStorage (simulación)
- **Validación**: Business rules engine

## 📊 Reglas de Negocio

### Validación de Stock

```javascript
function validarStock(productos) {
  for (const item of productos) {
    const producto = obtenerProducto(item.id);
    if (producto.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }
  }
  return true;
}
```

### Cálculo de Total

```javascript
function calcularTotal(productos) {
  return productos.reduce((total, item) => {
    return total + (item.precio * item.cantidad);
  }, 0);
}
```

### Validación de Transición

```javascript
function validarTransicion(estadoActual, estadoNuevo) {
  const permitidas = transicionesPermitidas[estadoActual];
  if (!permitidas.includes(estadoNuevo)) {
    throw new Error(`Transición no permitida: ${estadoActual} → ${estadoNuevo}`);
  }
  return true;
}
```

## 🧪 Testing

Para probar el sistema:

1. **Como Admin**:
   - Crear productos
   - Ver todas las órdenes
   - Cambiar estados de órdenes

2. **Como Cliente**:
   - Ver catálogo de productos
   - Crear orden
   - Ver solo sus propias órdenes

3. **Como Público**:
   - Ver catálogo de productos
   - Sin acceso a órdenes

## 📈 Métricas de Calidad

- Validaciones de negocio robustas
- Manejo de estados consistente
- Prevención de estados inválidos
- Auditoría de cambios
- Separación de responsabilidades

## 🔗 Recursos

- [Documentación de Arquitectura](./docs/arquitectura.md)
- [Flujo de Operaciones](./docs/flujo.md)
- [Reglas de Negocio](./docs/reglas-negocio.md)

---

**Este proyecto demuestra capacidades de desarrollo de sistemas con flujos de negocio complejos y arquitectura escalable**
