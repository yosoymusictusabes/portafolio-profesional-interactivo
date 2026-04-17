/**
 * Datos iniciales para pruebas
 * Carga datos de ejemplo en localStorage
 */

export function cargarDatosIniciales() {
  // Verificar si ya hay datos
  if (localStorage.getItem('datos_inicializados')) {
    console.log('Datos iniciales ya cargados');
    return;
  }

  console.log('Cargando datos iniciales...');

  // Usuarios
  const usuarios = [
    {
      id: '1',
      nombre: 'Administrador Sistema',
      email: 'admin@sistema.com',
      usuario: 'admin',
      password: 'admin123',
      rol: 'admin',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      nombre: 'Cliente Demo',
      email: 'cliente@demo.com',
      usuario: 'cliente1',
      password: 'cliente123',
      rol: 'cliente',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      nombre: 'Usuario Publico',
      email: 'publico@demo.com',
      usuario: 'publico',
      password: 'publico123',
      rol: 'publico',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      nombre: 'Maria Rodriguez',
      email: 'maria@empresa.com',
      usuario: 'maria.rodriguez',
      password: 'maria123',
      rol: 'cliente',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      nombre: 'Juan Perez',
      email: 'juan@empresa.com',
      usuario: 'juan.perez',
      password: 'juan123',
      rol: 'cliente',
      activo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Productos
  const productos = [
    {
      id: '1',
      nombre: 'Laptop Dell XPS 15',
      descripcion: 'Laptop de alto rendimiento para profesionales',
      precio: 1299.99,
      stock: 15,
      categoria: 'Electronica',
      imagen: '/assets/laptop.jpg',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      nombre: 'Mouse Logitech MX Master 3',
      descripcion: 'Mouse ergonomico inalambrico',
      precio: 99.99,
      stock: 50,
      categoria: 'Accesorios',
      imagen: '/assets/mouse.jpg',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      nombre: 'Teclado Mecanico Keychron K2',
      descripcion: 'Teclado mecanico compacto',
      precio: 79.99,
      stock: 30,
      categoria: 'Accesorios',
      imagen: '/assets/teclado.jpg',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      nombre: 'Monitor LG UltraWide 34"',
      descripcion: 'Monitor ultrawide para productividad',
      precio: 499.99,
      stock: 8,
      categoria: 'Monitores',
      imagen: '/assets/monitor.jpg',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      nombre: 'Webcam Logitech C920',
      descripcion: 'Webcam HD para videoconferencias',
      precio: 69.99,
      stock: 0,
      categoria: 'Accesorios',
      imagen: '/assets/webcam.jpg',
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Ordenes
  const ordenes = [
    {
      id: '1',
      numeroOrden: 'ORD-2026-001',
      clienteId: '2',
      clienteNombre: 'Cliente Demo',
      productos: [
        { id: '1', nombre: 'Laptop Dell XPS 15', cantidad: 1, precio: 1299.99 },
        { id: '2', nombre: 'Mouse Logitech MX Master 3', cantidad: 1, precio: 99.99 }
      ],
      total: 1399.98,
      estado: 'pendiente',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      numeroOrden: 'ORD-2026-002',
      clienteId: '4',
      clienteNombre: 'Maria Rodriguez',
      productos: [
        { id: '3', nombre: 'Teclado Mecanico Keychron K2', cantidad: 2, precio: 79.99 }
      ],
      total: 159.98,
      estado: 'procesando',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      numeroOrden: 'ORD-2026-003',
      clienteId: '2',
      clienteNombre: 'Cliente Demo',
      productos: [
        { id: '4', nombre: 'Monitor LG UltraWide 34"', cantidad: 1, precio: 499.99 }
      ],
      total: 499.99,
      estado: 'enviado',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      numeroOrden: 'ORD-2026-004',
      clienteId: '4',
      clienteNombre: 'Maria Rodriguez',
      productos: [
        { id: '2', nombre: 'Mouse Logitech MX Master 3', cantidad: 3, precio: 99.99 }
      ],
      total: 299.97,
      estado: 'entregado',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Guardar en localStorage
  localStorage.setItem('api_usuarios', JSON.stringify(usuarios));
  localStorage.setItem('api_productos', JSON.stringify(productos));
  localStorage.setItem('api_ordenes', JSON.stringify(ordenes));
  localStorage.setItem('datos_inicializados', 'true');

  console.log('Datos iniciales cargados exitosamente');
  console.log(`- ${usuarios.length} usuarios`);
  console.log(`- ${productos.length} productos`);
  console.log(`- ${ordenes.length} ordenes`);
}

/**
 * Limpiar todos los datos
 */
export function limpiarDatos() {
  localStorage.removeItem('api_usuarios');
  localStorage.removeItem('api_productos');
  localStorage.removeItem('api_ordenes');
  localStorage.removeItem('datos_inicializados');
  localStorage.removeItem('portafolio_sesion');
  console.log('Datos limpiados');
}

/**
 * Reiniciar datos
 */
export function reiniciarDatos() {
  limpiarDatos();
  cargarDatosIniciales();
}
