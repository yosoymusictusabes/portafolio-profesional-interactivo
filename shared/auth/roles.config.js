/**
 * Configuracion centralizada de roles y permisos
 * Este archivo define que puede hacer cada rol en cada modulo
 */

export const rolesConfig = {
  admin: {
    nivel: 3,
    nombre: 'Administrador',
    permisos: {
      usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
      roles: ['crear', 'leer', 'actualizar', 'eliminar'],
      perfil: ['leer', 'actualizar'],
      productos: ['crear', 'leer', 'actualizar', 'eliminar'],
      ordenes: ['crear', 'leer', 'actualizar', 'eliminar'],
      estados: ['crear', 'leer', 'actualizar', 'eliminar']
    }
  },
  cliente: {
    nivel: 2,
    nombre: 'Cliente',
    permisos: {
      usuarios: ['leer'],
      roles: ['leer'],
      perfil: ['leer', 'actualizar'],
      productos: ['leer'],
      ordenes: ['crear', 'leer'],
      estados: ['leer']
    }
  },
  publico: {
    nivel: 1,
    nombre: 'Publico',
    permisos: {
      usuarios: [],
      roles: [],
      perfil: [],
      productos: ['leer'],
      ordenes: [],
      estados: []
    }
  }
};

/**
 * Usuarios mock para autenticacion simulada
 */
export const usuariosMock = [
  {
    id: 1,
    nombre: 'Administrador Sistema',
    email: 'admin@sistema.com',
    usuario: 'admin',
    password: 'admin123',
    rol: 'admin',
    activo: true
  },
  {
    id: 2,
    nombre: 'Cliente Demo',
    email: 'cliente@demo.com',
    usuario: 'cliente1',
    password: 'cliente123',
    rol: 'cliente',
    activo: true
  },
  {
    id: 3,
    nombre: 'Usuario Publico',
    email: 'publico@demo.com',
    usuario: 'publico',
    password: 'publico123',
    rol: 'publico',
    activo: true
  }
];

/**
 * Valida si un rol tiene permiso para una accion en un modulo
 */
export function validarPermiso(rol, modulo, accion) {
  const configuracionRol = rolesConfig[rol];
  if (!configuracionRol) return false;
  
  const permisosModulo = configuracionRol.permisos[modulo];
  if (!permisosModulo) return false;
  
  return permisosModulo.includes(accion);
}

/**
 * Obtiene todos los permisos de un rol
 */
export function obtenerPermisos(rol) {
  return rolesConfig[rol]?.permisos || {};
}

/**
 * Obtiene el nivel de un rol
 */
export function obtenerNivelRol(rol) {
  return rolesConfig[rol]?.nivel || 0;
}
