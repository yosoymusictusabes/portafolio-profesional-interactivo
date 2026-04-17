# Flujo de Operaciones - CRM System

Documentacion detallada de los flujos operativos del sistema CRM.

## 🔄 Flujo de Autenticacion

```
1. Usuario accede a /projects/crm-system/
2. Sistema verifica sesion activa
3. Si no hay sesion → Redirige a login
4. Usuario ingresa credenciales
5. AuthService valida contra usuariosMock
6. Se genera token simulado
7. Se guarda en localStorage
8. Se actualiza Store con usuario
9. Se redirige a dashboard
```

## 👥 Flujo de Gestion de Usuarios

### Crear Usuario (Admin)

```
1. Admin hace clic en "Nuevo Usuario"
2. AuthGuard valida permiso 'usuarios' → 'crear'
3. Se muestra formulario
4. Admin completa datos:
   - Nombre
   - Email
   - Usuario
   - Password
   - Rol
5. Se validan datos en cliente:
   - Email unico
   - Password segura (min 8 caracteres)
   - Campos obligatorios
6. Se envia a ApiMock.post('/usuarios', datos)
7. ApiMock genera ID y timestamps
8. Se guarda en localStorage
9. Se actualiza lista de usuarios
10. Se muestra notificacion de exito
```

### Editar Usuario (Admin)

```
1. Admin hace clic en "Editar" en un usuario
2. AuthGuard valida permiso 'usuarios' → 'actualizar'
3. Se obtienen datos del usuario
4. Se muestra formulario pre-llenado
5. Admin modifica datos
6. Se validan cambios
7. Se envia a ApiMock.put('/usuarios', id, datos)
8. Se actualiza en localStorage
9. Se actualiza lista
10. Se muestra notificacion
```

### Eliminar Usuario (Admin)

```
1. Admin hace clic en "Eliminar"
2. AuthGuard valida permiso 'usuarios' → 'eliminar'
3. Se muestra confirmacion
4. Admin confirma
5. Se envia a ApiMock.delete('/usuarios', id)
6. Se elimina de localStorage
7. Se actualiza lista
8. Se muestra notificacion
```

### Ver Usuarios (Cliente)

```
1. Cliente accede a modulo usuarios
2. AuthGuard valida permiso 'usuarios' → 'leer'
3. Se obtienen usuarios desde ApiMock
4. Se filtran datos sensibles (password)
5. Se muestra lista en modo lectura
6. Botones de edicion/eliminacion ocultos
```

## 🔐 Flujo de Gestion de Roles

### Asignar Rol a Usuario

```
1. Admin selecciona usuario
2. Admin hace clic en "Cambiar Rol"
3. Se muestra lista de roles disponibles
4. Admin selecciona nuevo rol
5. Se valida que el rol exista
6. Se actualiza usuario con nuevo rol
7. Se guarda en localStorage
8. Se actualiza sesion si es el usuario actual
9. Se muestra notificacion
```

## 👤 Flujo de Perfil

### Ver Perfil Propio

```
1. Usuario hace clic en "Mi Perfil"
2. Se obtiene usuario actual desde Session
3. Se muestran datos del usuario
4. Campos sensibles ocultos (password)
```

### Editar Perfil Propio

```
1. Usuario hace clic en "Editar Perfil"
2. AuthGuard valida permiso 'perfil' → 'actualizar'
3. Se muestra formulario con datos actuales
4. Usuario modifica datos permitidos:
   - Nombre
   - Email
5. Se validan cambios
6. Se actualiza en ApiMock
7. Se actualiza Session
8. Se actualiza Store
9. Se muestra notificacion
```

### Cambiar Password

```
1. Usuario hace clic en "Cambiar Password"
2. Se muestra formulario:
   - Password actual
   - Password nueva
   - Confirmar password nueva
3. Se valida password actual
4. Se valida password nueva (min 8 caracteres)
5. Se valida que coincidan
6. Se actualiza en ApiMock
7. Se muestra notificacion
8. Se cierra sesion (opcional)
```

## 🔍 Flujo de Busqueda y Filtros

### Buscar Usuarios

```
1. Usuario ingresa termino de busqueda
2. Se aplica debounce (300ms)
3. Se filtran usuarios por:
   - Nombre
   - Email
   - Usuario
4. Se actualiza lista en tiempo real
```

### Filtrar por Rol

```
1. Usuario selecciona rol en dropdown
2. Se filtran usuarios por rol
3. Se actualiza lista
4. Se muestra contador de resultados
```

## ⚠️ Manejo de Errores

### Error de Validacion

```
1. Usuario ingresa datos invalidos
2. Se validan en cliente
3. Se muestran mensajes de error
4. Se resaltan campos con error
5. Usuario corrige datos
6. Se validan nuevamente
7. Se habilita boton de guardar
```

### Error de Permisos

```
1. Usuario intenta accion sin permiso
2. AuthGuard detecta falta de permiso
3. Se muestra mensaje de error
4. Se registra intento en logs
5. Se redirige a pagina anterior
```

### Error de Red (Simulado)

```
1. ApiMock simula error
2. Se captura error en Service
3. Se muestra mensaje al usuario
4. Se ofrece opcion de reintentar
5. Usuario reintenta
6. Se ejecuta operacion nuevamente
```

## 📊 Estados de UI

### Loading

```
- Se muestra spinner
- Se deshabilitan botones
- Se muestra mensaje "Cargando..."
```

### Success

```
- Se muestra notificacion verde
- Se actualiza lista
- Se cierra modal (si aplica)
- Se limpia formulario
```

### Error

```
- Se muestra notificacion roja
- Se mantiene formulario abierto
- Se resaltan campos con error
- Se habilita boton de reintentar
```

### Empty

```
- Se muestra mensaje "No hay datos"
- Se ofrece opcion de crear nuevo
- Se muestra ilustracion (opcional)
```

## 🔄 Sincronizacion de Estado

### Actualizacion en Tiempo Real

```
1. Usuario A crea un registro
2. Se guarda en localStorage
3. Store notifica cambio
4. Componentes suscritos se actualizan
5. Usuario B ve cambio inmediatamente
```

---

**Este flujo demuestra comprension de operaciones CRUD completas y manejo de estado profesional**
