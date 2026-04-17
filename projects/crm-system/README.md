# CRM System

Sistema de gestión de relaciones con clientes (CRM) enfocado en la administración de usuarios, roles y permisos.

## 🎯 Objetivo

Demostrar capacidades de desarrollo de un sistema CRUD completo con control de acceso basado en roles y permisos granulares.

## 📋 Problema que Resuelve

Las empresas necesitan gestionar usuarios, asignar roles y controlar el acceso a diferentes módulos del sistema. Este CRM simula un escenario real donde:

- Administradores gestionan usuarios y roles
- Clientes pueden ver información limitada
- El acceso está controlado por permisos configurables

## 🏗️ Arquitectura

```
crm-system/
├── index.html              # Punto de entrada
├── modules/
│   ├── usuarios/          # Módulo de usuarios
│   │   ├── usuarios.service.js
│   │   ├── usuarios.controller.js
│   │   └── usuarios.view.html
│   ├── roles/             # Módulo de roles
│   │   ├── roles.service.js
│   │   ├── roles.controller.js
│   │   └── roles.view.html
│   └── perfil/            # Módulo de perfil
│       ├── perfil.service.js
│       ├── perfil.controller.js
│       └── perfil.view.html
├── config/
│   └── permisos.config.js # Configuración de permisos
├── styles/
│   └── crm.css
└── docs/
    ├── arquitectura.md
    ├── flujo.md
    └── permisos.md
```

## 🔐 Sistema de Permisos

### Matriz de Acceso

| Módulo   | Admin        | Cliente | Público |
|----------|--------------|---------|---------|
| Usuarios | CRUD         | Ver     | ❌      |
| Roles    | CRUD         | Ver     | ❌      |
| Perfil   | Editar Todos | Propio  | ❌      |

### Configuración de Permisos

Los permisos están centralizados en `config/permisos.config.js`:

```javascript
const permisos = {
  usuarios: {
    admin: ['crear', 'leer', 'actualizar', 'eliminar'],
    cliente: ['leer'],
    publico: []
  },
  roles: {
    admin: ['crear', 'leer', 'actualizar', 'eliminar'],
    cliente: ['leer'],
    publico: []
  }
};
```

## 📦 Módulos

### 1. Usuarios

**Funcionalidades**:
- Listar usuarios con paginación
- Crear nuevo usuario
- Editar usuario existente
- Eliminar usuario
- Buscar y filtrar usuarios

**Validaciones**:
- Email único
- Contraseña segura (mínimo 8 caracteres)
- Campos obligatorios

### 2. Roles

**Funcionalidades**:
- Listar roles disponibles
- Crear nuevo rol
- Asignar permisos a rol
- Editar rol existente
- Eliminar rol

**Roles predefinidos**:
- Admin: Acceso completo
- Cliente: Acceso limitado
- Público: Solo lectura

### 3. Perfil

**Funcionalidades**:
- Ver información del usuario actual
- Editar datos personales
- Cambiar contraseña
- Ver historial de actividad

## 🔄 Flujo de Operaciones

### Crear Usuario (Admin)

```
1. Admin hace clic en "Nuevo Usuario"
2. Se valida sesión y permisos
3. Se muestra formulario
4. Admin completa datos
5. Se validan datos en cliente
6. Se envía a API mock
7. Se guarda en localStorage
8. Se actualiza lista de usuarios
9. Se muestra notificación de éxito
```

### Ver Usuarios (Cliente)

```
1. Cliente accede a módulo usuarios
2. Se valida sesión y permisos
3. Se obtienen usuarios desde API mock
4. Se filtran datos sensibles
5. Se muestra lista en modo lectura
6. Botones de edición/eliminación deshabilitados
```

## 🧠 Decisiones Técnicas

### ¿Por qué Vanilla JavaScript?

- Demuestra conocimiento fundamental sin dependencias
- Facilita entender la arquitectura subyacente
- Más fácil de migrar a cualquier framework

### ¿Por qué localStorage?

- Simula persistencia sin backend
- Permite demostrar flujo completo
- Fácil de reemplazar por API real

### ¿Por qué separación por capas?

- Facilita mantenimiento
- Permite testing independiente
- Refleja arquitectura empresarial real

## 🚀 Cómo Escalar a Backend Real

### Paso 1: Reemplazar API Mock

```javascript
// Antes (Mock)
class UsuariosService {
  obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
  }
}

// Después (API Real)
class UsuariosService {
  async obtenerUsuarios() {
    const response = await fetch('/api/usuarios');
    return await response.json();
  }
}
```

### Paso 2: Implementar Autenticación Real

```javascript
// Antes (Simulada)
const token = btoa(JSON.stringify({ usuario, rol }));

// Después (JWT)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ usuario, password })
});
const { token } = await response.json();
```

### Paso 3: Migrar a Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol_id INTEGER REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Arquitectura**: MVC
- **Patrones**: Service Layer, Repository Pattern
- **Persistencia**: localStorage (simulación)
- **Validación**: Custom validators

## 📊 Estado de UI

El sistema maneja diferentes estados:

- **Loading**: Cargando datos
- **Success**: Operación exitosa
- **Error**: Error en operación
- **Empty**: Sin datos disponibles

## 🧪 Testing

Para probar el sistema:

1. Iniciar sesión como `admin` / `admin123`
2. Crear un nuevo usuario
3. Asignar rol "cliente"
4. Cerrar sesión
5. Iniciar sesión con el nuevo usuario
6. Verificar permisos limitados

## 📈 Métricas de Calidad

- Separación de responsabilidades
- Código reutilizable
- Configuración centralizada
- Manejo de errores robusto
- Validaciones en cliente y "servidor"

## 🔗 Recursos

- [Documentación de Arquitectura](./docs/arquitectura.md)
- [Flujo de Operaciones](./docs/flujo.md)
- [Sistema de Permisos](./docs/permisos.md)

---

**Este proyecto demuestra capacidades de desarrollo de sistemas empresariales con arquitectura escalable**
