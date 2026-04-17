# Shared - Núcleo Compartido

Módulos y utilidades compartidas entre todos los proyectos del portafolio.

## 🎯 Propósito

Centralizar funcionalidades comunes para evitar duplicación de código y facilitar el mantenimiento.

## 📦 Estructura

```
shared/
├── core/              # Núcleo de la aplicación
│   ├── app.js        # Inicialización de la app
│   ├── router.js     # Sistema de rutas
│   └── api.mock.js   # Simulación de API
├── auth/              # Autenticación y autorización
│   ├── auth.service.js
│   ├── auth.guard.js
│   └── roles.config.js
├── state/             # Gestión de estado
│   ├── store.js
│   └── session.js
├── utils/             # Utilidades
│   ├── validators.js
│   ├── formatters.js
│   └── helpers.js
└── ui/                # Componentes UI
    ├── components/
    └── layouts/
```

## 🔐 Auth - Autenticación

### auth.service.js

Servicio de autenticación que maneja:
- Login/Logout
- Validación de credenciales
- Generación de token simulado
- Persistencia de sesión

```javascript
class AuthService {
  login(usuario, password) { }
  logout() { }
  obtenerUsuarioActual() { }
  validarToken() { }
}
```

### auth.guard.js

Guardias de navegación para proteger rutas:

```javascript
class AuthGuard {
  validarAcceso(ruta, usuario) { }
  validarPermiso(modulo, accion, rol) { }
}
```

### roles.config.js

Configuración centralizada de roles y permisos:

```javascript
const roles = {
  admin: { nivel: 3, permisos: ['*'] },
  cliente: { nivel: 2, permisos: ['leer', 'crear'] },
  publico: { nivel: 1, permisos: ['leer'] }
};
```

## 🧠 Core - Núcleo

### app.js

Inicialización y configuración de la aplicación:

```javascript
class App {
  inicializar() { }
  configurarRouter() { }
  configurarAuth() { }
  configurarStore() { }
}
```

### router.js

Sistema de rutas con guardias:

```javascript
class Router {
  registrarRuta(path, componente, guard) { }
  navegar(path) { }
  obtenerRutaActual() { }
}
```

### api.mock.js

Simulación de API REST:

```javascript
class ApiMock {
  get(endpoint) { }
  post(endpoint, data) { }
  put(endpoint, data) { }
  delete(endpoint) { }
}
```

## 📊 State - Estado

### store.js

Store global para gestión de estado:

```javascript
class Store {
  obtenerEstado() { }
  actualizarEstado(clave, valor) { }
  suscribirse(callback) { }
}
```

### session.js

Gestión de sesión de usuario:

```javascript
class Session {
  guardarSesion(usuario) { }
  obtenerSesion() { }
  limpiarSesion() { }
  validarSesion() { }
}
```

## 🛠️ Utils - Utilidades

### validators.js

Validadores comunes:

```javascript
const validators = {
  email(valor) { },
  password(valor) { },
  requerido(valor) { },
  longitud(valor, min, max) { }
};
```

### formatters.js

Formateadores de datos:

```javascript
const formatters = {
  fecha(fecha) { },
  moneda(valor) { },
  telefono(numero) { }
};
```

### helpers.js

Funciones auxiliares:

```javascript
const helpers = {
  generarId() { },
  clonar(objeto) { },
  debounce(fn, delay) { }
};
```

## 🎨 UI - Componentes

### components/

Componentes reutilizables:
- Button
- Input
- Modal
- Table
- Card
- Alert

### layouts/

Layouts de página:
- MainLayout
- AuthLayout
- DashboardLayout

## 🔄 Flujo de Uso

### 1. Inicialización

```javascript
import { App } from './shared/core/app.js';

const app = new App();
app.inicializar();
```

### 2. Autenticación

```javascript
import { AuthService } from './shared/auth/auth.service.js';

const authService = new AuthService();
const usuario = await authService.login('admin', 'admin123');
```

### 3. Navegación Protegida

```javascript
import { Router } from './shared/core/router.js';
import { AuthGuard } from './shared/auth/auth.guard.js';

const router = new Router();
router.registrarRuta('/usuarios', UsuariosComponent, AuthGuard);
```

### 4. Gestión de Estado

```javascript
import { Store } from './shared/state/store.js';

const store = new Store();
store.actualizarEstado('usuario', usuario);
```

## 🚀 Escalabilidad

Este núcleo está diseñado para escalar fácilmente:

### Migrar a Framework

```javascript
// Antes (Vanilla)
class AuthService { }

// Después (React)
const useAuth = () => {
  // Hook personalizado
};

// Después (Vue)
export default {
  setup() {
    // Composition API
  }
};
```

### Migrar a Backend Real

```javascript
// Antes (Mock)
class ApiMock {
  get(endpoint) {
    return JSON.parse(localStorage.getItem(endpoint));
  }
}

// Después (Real)
class ApiService {
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    return await response.json();
  }
}
```

## 📈 Ventajas de Centralización

- ✅ Un solo lugar para cambios
- ✅ Código reutilizable
- ✅ Fácil testing
- ✅ Mantenimiento simplificado
- ✅ Consistencia en toda la app

## 🧪 Testing

Cada módulo debe ser testeable de forma independiente:

```javascript
// Ejemplo: test de validators
describe('Validators', () => {
  test('valida email correctamente', () => {
    expect(validators.email('test@example.com')).toBe(true);
    expect(validators.email('invalid')).toBe(false);
  });
});
```

---

**Este núcleo compartido demuestra arquitectura modular y reutilizable**
