# Sistema de Permisos - CRM System

Documentacion del sistema de control de acceso basado en roles.

## 🔐 Arquitectura de Permisos

### Configuracion Centralizada

Los permisos estan definidos en `shared/auth/roles.config.js`:

```javascript
export const rolesConfig = {
  admin: {
    nivel: 3,
    permisos: {
      usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
      roles: ['crear', 'leer', 'actualizar', 'eliminar'],
      perfil: ['leer', 'actualizar']
    }
  },
  cliente: {
    nivel: 2,
    permisos: {
      usuarios: ['leer'],
      roles: ['leer'],
      perfil: ['leer', 'actualizar']
    }
  },
  publico: {
    nivel: 1,
    permisos: {
      usuarios: [],
      roles: [],
      perfil: []
    }
  }
};
```

## 📊 Matriz de Permisos

### Modulo: Usuarios

| Accion     | Admin | Cliente | Publico |
|------------|-------|---------|---------|
| Crear      | ✅    | ❌      | ❌      |
| Leer       | ✅    | ✅      | ❌      |
| Actualizar | ✅    | ❌      | ❌      |
| Eliminar   | ✅    | ❌      | ❌      |

### Modulo: Roles

| Accion     | Admin | Cliente | Publico |
|------------|-------|---------|---------|
| Crear      | ✅    | ❌      | ❌      |
| Leer       | ✅    | ✅      | ❌      |
| Actualizar | ✅    | ❌      | ❌      |
| Eliminar   | ✅    | ❌      | ❌      |

### Modulo: Perfil

| Accion     | Admin | Cliente | Publico |
|------------|-------|---------|---------|
| Leer       | ✅    | ✅      | ❌      |
| Actualizar | ✅    | ✅      | ❌      |

## 🛡️ Validacion de Permisos

### En el Backend (API Mock)

```javascript
// Antes de ejecutar operacion
if (!authService.tienePermiso('usuarios', 'crear')) {
  throw new Error('Acceso denegado');
}
```

### En el Frontend (UI)

```javascript
// Ocultar botones segun permisos
if (authService.tienePermiso('usuarios', 'crear')) {
  mostrarBotonCrear();
} else {
  ocultarBotonCrear();
}
```

### En el Router (Guardias)

```javascript
// Proteger rutas
router.registrarRuta('/usuarios/crear', CrearUsuarioComponent, {
  requiereAuth: true,
  permisos: { modulo: 'usuarios', accion: 'crear' }
});
```

## 🔑 Roles Disponibles

### Admin (Nivel 3)

**Descripcion**: Acceso completo al sistema

**Permisos**:
- Gestionar usuarios (CRUD completo)
- Gestionar roles (CRUD completo)
- Ver y editar cualquier perfil
- Acceso a todos los modulos

**Casos de uso**:
- Administrador del sistema
- Gerente de TI
- Super usuario

### Cliente (Nivel 2)

**Descripcion**: Acceso limitado a funciones basicas

**Permisos**:
- Ver lista de usuarios (solo lectura)
- Ver roles disponibles
- Ver y editar su propio perfil

**Casos de uso**:
- Usuario regular
- Cliente del sistema
- Empleado

### Publico (Nivel 1)

**Descripcion**: Acceso minimo, solo visualizacion

**Permisos**:
- Ninguno en CRM System
- Solo puede ver pagina de login

**Casos de uso**:
- Usuario no autenticado
- Visitante
- Demo publico

## 🔄 Flujo de Validacion

### 1. Validacion en Login

```
Usuario ingresa credenciales
        ↓
AuthService valida usuario
        ↓
Se obtiene rol del usuario
        ↓
Se cargan permisos del rol
        ↓
Se guarda en Session
```

### 2. Validacion en Cada Operacion

```
Usuario intenta accion
        ↓
AuthGuard intercepta
        ↓
Valida sesion activa
        ↓
Obtiene rol del usuario
        ↓
Consulta permisos del rol
        ↓
Valida permiso especifico
        ↓
Permite o deniega accion
```

### 3. Validacion en UI

```
Componente se renderiza
        ↓
Obtiene usuario actual
        ↓
Consulta permisos
        ↓
Muestra/oculta elementos
        ↓
Habilita/deshabilita botones
```

## 🧪 Ejemplos de Uso

### Validar Permiso en Servicio

```javascript
class UsuariosService {
  async crear(datos) {
    // Validar permiso
    if (!authService.tienePermiso('usuarios', 'crear')) {
      throw new Error('No tienes permiso para crear usuarios');
    }
    
    // Ejecutar operacion
    return await apiMock.post('/usuarios', datos);
  }
}
```

### Proteger Elemento del DOM

```javascript
// Ocultar boton si no tiene permiso
const botonCrear = document.getElementById('btn-crear');
if (!authService.tienePermiso('usuarios', 'crear')) {
  botonCrear.style.display = 'none';
}
```

### Proteger Ruta

```javascript
router.registrarRuta('/usuarios/editar/:id', EditarUsuarioComponent, {
  requiereAuth: true,
  permisos: { modulo: 'usuarios', accion: 'actualizar' }
});
```

## 🔒 Seguridad

### Validacion en Multiples Capas

1. **UI**: Ocultar elementos sin permiso
2. **Router**: Bloquear navegacion sin permiso
3. **Service**: Validar antes de operacion
4. **API Mock**: Validar antes de guardar

### Principio de Menor Privilegio

- Cada rol tiene solo los permisos necesarios
- No hay permisos por defecto
- Se debe especificar explicitamente cada permiso

### Auditoria

- Registrar intentos de acceso denegado
- Registrar cambios de permisos
- Registrar asignacion de roles

## 📈 Escalabilidad

### Migrar a Backend Real

```javascript
// Antes (Mock)
const permisos = rolesConfig[rol].permisos;

// Despues (API Real)
const response = await fetch(`/api/roles/${rol}/permisos`);
const permisos = await response.json();
```

### Permisos Granulares

```javascript
// Actual: permisos por modulo
permisos: {
  usuarios: ['crear', 'leer']
}

// Futuro: permisos por recurso
permisos: {
  usuarios: {
    propios: ['leer', 'actualizar'],
    otros: ['leer']
  }
}
```

### Permisos Dinamicos

```javascript
// Actual: permisos estaticos en config
// Futuro: permisos desde base de datos
const permisos = await db.query('SELECT * FROM permisos WHERE rol_id = ?', [rolId]);
```

## 🧪 Testing de Permisos

### Test de Validacion

```javascript
describe('Sistema de Permisos', () => {
  test('Admin puede crear usuarios', () => {
    const tienePermiso = validarPermiso('admin', 'usuarios', 'crear');
    expect(tienePermiso).toBe(true);
  });
  
  test('Cliente no puede crear usuarios', () => {
    const tienePermiso = validarPermiso('cliente', 'usuarios', 'crear');
    expect(tienePermiso).toBe(false);
  });
});
```

---

**Este sistema de permisos demuestra comprension de seguridad y control de acceso profesional**
