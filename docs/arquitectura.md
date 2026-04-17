# Arquitectura del Sistema

Documentación técnica de la arquitectura del portafolio profesional interactivo.

## 🏗️ Visión General

Este portafolio implementa una arquitectura por capas que simula un sistema empresarial real, con separación de responsabilidades y módulos independientes.

## 📐 Arquitectura por Capas

```
┌─────────────────────────────────────────┐
│         Capa de Presentación            │
│  (HTML, CSS, Componentes UI)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Capa de Lógica de Negocio          │
│  (Controllers, Services, Validators)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Capa de Acceso a Datos            │
│  (API Mock, Repository Pattern)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Capa de Persistencia            │
│  (localStorage, memoria estructurada)   │
└─────────────────────────────────────────┘
```

## 🧩 Componentes Principales

### 1. Core (Núcleo)

**Responsabilidad**: Inicialización y configuración global

```javascript
// app.js
class App {
  constructor() {
    this.router = new Router();
    this.store = new Store();
    this.authService = new AuthService();
  }
  
  inicializar() {
    this.configurarRouter();
    this.configurarAuth();
    this.cargarEstadoInicial();
  }
}
```

### 2. Router (Enrutador)

**Responsabilidad**: Navegación y guardias de ruta

```javascript
// router.js
class Router {
  constructor() {
    this.rutas = new Map();
    this.guardias = new Map();
  }
  
  registrarRuta(path, componente, guardia = null) {
    this.rutas.set(path, componente);
    if (guardia) this.guardias.set(path, guardia);
  }
  
  async navegar(path) {
    const guardia = this.guardias.get(path);
    if (guardia && !await guardia.validar()) {
      return this.navegar('/login');
    }
    
    const componente = this.rutas.get(path);
    componente.renderizar();
  }
}
```

### 3. Auth (Autenticación)

**Responsabilidad**: Gestión de sesión y permisos

```javascript
// auth.service.js
class AuthService {
  login(usuario, password) {
    const usuarioEncontrado = this.validarCredenciales(usuario, password);
    if (!usuarioEncontrado) throw new Error('Credenciales inválidas');
    
    const token = this.generarToken(usuarioEncontrado);
    this.guardarSesion(token, usuarioEncontrado);
    
    return usuarioEncontrado;
  }
  
  validarPermiso(modulo, accion) {
    const usuario = this.obtenerUsuarioActual();
    const permisos = rolesConfig[usuario.rol][modulo];
    return permisos.includes(accion);
  }
}
```

### 4. Store (Estado Global)

**Responsabilidad**: Gestión de estado compartido

```javascript
// store.js
class Store {
  constructor() {
    this.estado = {};
    this.suscriptores = [];
  }
  
  actualizarEstado(clave, valor) {
    this.estado[clave] = valor;
    this.notificarSuscriptores(clave, valor);
  }
  
  suscribirse(callback) {
    this.suscriptores.push(callback);
  }
}
```

## 🔄 Flujo de Datos

### Flujo de Autenticación

```
Usuario ingresa credenciales
        ↓
AuthService.login()
        ↓
Validar contra mock de usuarios
        ↓
Generar token simulado
        ↓
Guardar en localStorage
        ↓
Actualizar Store con usuario
        ↓
Redirigir a dashboard
```

### Flujo de CRUD

```
Usuario hace clic en "Crear"
        ↓
Controller.crear()
        ↓
Validar permisos (AuthGuard)
        ↓
Validar datos (Validators)
        ↓
Service.crear(datos)
        ↓
ApiMock.post('/endpoint', datos)
        ↓
Guardar en localStorage
        ↓
Actualizar Store
        ↓
Notificar componentes suscritos
        ↓
Actualizar UI
```

## 🎨 Patrón MVC

### Model (Modelo)

```javascript
// usuario.model.js
class Usuario {
  constructor(id, nombre, email, rol) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
  }
  
  validar() {
    if (!this.email.includes('@')) {
      throw new Error('Email inválido');
    }
  }
}
```

### View (Vista)

```javascript
// usuarios.view.js
class UsuariosView {
  renderizar(usuarios) {
    const html = usuarios.map(u => `
      <tr>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>${u.rol}</td>
      </tr>
    `).join('');
    
    document.getElementById('tabla-usuarios').innerHTML = html;
  }
}
```

### Controller (Controlador)

```javascript
// usuarios.controller.js
class UsuariosController {
  constructor() {
    this.service = new UsuariosService();
    this.view = new UsuariosView();
  }
  
  async listar() {
    const usuarios = await this.service.obtenerTodos();
    this.view.renderizar(usuarios);
  }
  
  async crear(datos) {
    await this.service.crear(datos);
    this.listar();
  }
}
```

## 🔐 Sistema de Permisos

### Configuración Centralizada

```javascript
// roles.config.js
const permisos = {
  usuarios: {
    admin: ['crear', 'leer', 'actualizar', 'eliminar'],
    cliente: ['leer'],
    publico: []
  },
  productos: {
    admin: ['crear', 'leer', 'actualizar', 'eliminar'],
    cliente: ['leer'],
    publico: ['leer']
  }
};
```

### Validación en Tiempo de Ejecución

```javascript
// auth.guard.js
class AuthGuard {
  validarAcceso(modulo, accion) {
    const usuario = authService.obtenerUsuarioActual();
    const permisosModulo = permisos[modulo][usuario.rol];
    
    if (!permisosModulo.includes(accion)) {
      throw new Error('Acceso denegado');
    }
    
    return true;
  }
}
```

## 🔌 API Mock

### Simulación de Backend

```javascript
// api.mock.js
class ApiMock {
  constructor() {
    this.delay = 500; // Simular latencia de red
  }
  
  async get(endpoint) {
    await this.simularDelay();
    const datos = JSON.parse(localStorage.getItem(endpoint)) || [];
    return { data: datos, status: 200 };
  }
  
  async post(endpoint, datos) {
    await this.simularDelay();
    const lista = JSON.parse(localStorage.getItem(endpoint)) || [];
    datos.id = this.generarId();
    lista.push(datos);
    localStorage.setItem(endpoint, JSON.stringify(lista));
    return { data: datos, status: 201 };
  }
  
  simularDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }
}
```

## 📦 Módulos Independientes

Cada proyecto (CRM, Logistics) es un módulo independiente que:

- Tiene su propia estructura MVC
- Usa el núcleo compartido (shared/)
- Puede funcionar de forma aislada
- Se comunica con otros módulos vía Store

```
projects/
├── crm-system/
│   ├── modules/
│   │   ├── usuarios/
│   │   │   ├── usuarios.controller.js
│   │   │   ├── usuarios.service.js
│   │   │   └── usuarios.view.html
│   │   └── roles/
│   └── config/
└── logistics-system/
    ├── modules/
    │   ├── productos/
    │   └── ordenes/
    └── config/
```

## 🚀 Escalabilidad

### Migración a Microservicios

```
Monolito Actual:
portafolio/ → Todos los módulos juntos

Microservicios:
├── auth-service/      → Autenticación
├── users-service/     → Gestión de usuarios
├── products-service/  → Gestión de productos
└── orders-service/    → Gestión de órdenes
```

### Migración a Framework

```javascript
// Antes (Vanilla)
class UsuariosController {
  async listar() {
    const usuarios = await this.service.obtenerTodos();
    this.view.renderizar(usuarios);
  }
}

// Después (React)
function UsuariosComponent() {
  const [usuarios, setUsuarios] = useState([]);
  
  useEffect(() => {
    usuariosService.obtenerTodos()
      .then(setUsuarios);
  }, []);
  
  return <UsuariosView usuarios={usuarios} />;
}
```

## 📊 Diagrama de Componentes

```
┌──────────────────────────────────────────────┐
│              index.html                      │
│         (Hoja de vida interactiva)           │
└──────────────┬───────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│ CRM System  │  │  Logistics  │
│             │  │   System    │
└──────┬──────┘  └──────┬──────┘
       │                │
       └───────┬────────┘
               │
       ┌───────▼────────┐
       │  Shared Core   │
       │  ├── auth      │
       │  ├── state     │
       │  ├── router    │
       │  └── utils     │
       └────────────────┘
```

## 🧪 Testing

### Arquitectura Testeable

Cada capa puede ser testeada independientemente:

```javascript
// Test de Service
describe('UsuariosService', () => {
  test('obtiene usuarios correctamente', async () => {
    const service = new UsuariosService();
    const usuarios = await service.obtenerTodos();
    expect(usuarios).toBeInstanceOf(Array);
  });
});

// Test de Controller
describe('UsuariosController', () => {
  test('lista usuarios', async () => {
    const controller = new UsuariosController();
    await controller.listar();
    expect(controller.view.renderizar).toHaveBeenCalled();
  });
});
```

## 📈 Métricas de Calidad

- **Separación de responsabilidades**: Cada capa tiene un propósito único
- **Bajo acoplamiento**: Módulos independientes
- **Alta cohesión**: Funcionalidades relacionadas juntas
- **Reutilización**: Código compartido en shared/
- **Escalabilidad**: Fácil migración a backend real

---

**Esta arquitectura demuestra conocimiento de patrones de diseño y mejores prácticas de desarrollo**
