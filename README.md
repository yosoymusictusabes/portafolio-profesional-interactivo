# Portafolio Profesional Interactivo

Sistema de portafolio profesional que demuestra capacidades de desarrollo mediante aplicaciones empresariales completas y funcionales.

## 🎯 Concepto

Este portafolio no es una colección de páginas estáticas, sino un **sistema central** que conecta con **aplicaciones simuladas completas**, cada una demostrando diferentes capacidades técnicas y arquitectónicas.

### ¿Por qué este enfoque?

- **Sistemas reales, no páginas**: Demuestra arquitectura y flujos de negocio
- **Escenarios empresariales**: CRM, ERP, logística
- **Código profesional**: Separación por capas, patrones de diseño, escalabilidad

## 🏗️ Arquitectura Global

```
portafolio/
├── index.html              # Hoja de vida interactiva (dashboard profesional)
├── projects/
│   ├── crm-system/        # Sistema CRM (gestión de usuarios y roles)
│   └── logistics-system/  # Sistema Logística/ERP (productos y órdenes)
├── shared/                # Núcleo compartido entre proyectos
│   ├── core/             # App, router, API mock
│   ├── auth/             # Autenticación, roles, permisos
│   ├── state/            # Store, sesión
│   └── utils/            # Utilidades comunes
├── assets/               # Recursos (imágenes, iconos)
└── styles/               # Estilos globales
```

## 🔐 Núcleo del Sistema

### Autenticación Simulada

- Usuarios en memoria / localStorage
- Login con validación
- Generación de token simulado
- Persistencia de sesión

### Sistema de Roles

| Rol      | Descripción                          |
|----------|--------------------------------------|
| admin    | Acceso completo a todos los módulos  |
| cliente  | Acceso limitado según permisos       |
| publico  | Solo visualización                   |

### Control de Permisos

| Módulo    | Admin | Cliente | Público |
|-----------|-------|---------|---------|
| Usuarios  | CRUD  | Ver     | ❌      |
| Productos | CRUD  | Ver     | Ver     |
| Órdenes   | CRUD  | Crear   | ❌      |

## 📦 Proyectos Incluidos

### 1. CRM System

**Enfoque**: Gestión de usuarios y roles

**Módulos**:
- Usuarios (CRUD completo)
- Roles y permisos
- Perfil de usuario

**Demuestra**:
- CRUD completo
- Control de acceso por roles
- Edición según permisos

[Ver documentación completa →](./projects/crm-system/README.md)

### 2. Logistics System

**Enfoque**: Flujo operativo empresarial

**Módulos**:
- Productos (inventario)
- Órdenes (gestión de pedidos)
- Estados (pendiente, enviado, entregado)

**Demuestra**:
- Flujos de negocio
- Cambio de estados
- Reglas según rol

[Ver documentación completa →](./projects/logistics-system/README.md)

## 🧩 Diferencial Técnico

### Arquitectura por Capas

```
Presentación (UI)
    ↓
Lógica de Negocio (Services)
    ↓
Acceso a Datos (API Mock)
    ↓
Persistencia (localStorage/memoria)
```

### Características Clave

- ✅ Separación por capas (core / módulos / shared)
- ✅ Configuración centralizada de permisos
- ✅ Simulación de API desacoplada
- ✅ Manejo de sesión profesional
- ✅ Router con guardias de navegación
- ✅ Estado global compartido

## 🚀 Inicio Rápido

### Requisitos

- Navegador moderno (Chrome, Firefox, Edge)
- Servidor local (Live Server, http-server, etc.)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/yosoymusictusabes/portafolio-profesional-interactivo.git

# Navegar al directorio
cd portafolio-profesional-interactivo

# Abrir con servidor local
# Opción 1: Live Server (VS Code)
# Opción 2: http-server
npx http-server -p 8080
```

### Acceso

Abrir en navegador: `http://localhost:8080`

## 🔑 Usuarios de Prueba

| Usuario    | Contraseña | Rol     |
|------------|------------|---------|
| admin      | admin123   | admin   |
| cliente1   | cliente123 | cliente |
| publico    | publico123 | publico |

## 📚 Documentación

- [Arquitectura del Sistema](./docs/arquitectura.md)
- [Flujo de Autenticación](./docs/flujo-autenticacion.md)
- [Sistema de Permisos](./docs/permisos.md)
- [Guía de Desarrollo](./docs/desarrollo.md)

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Arquitectura**: MVC, Separación por capas
- **Patrones**: Factory, Observer, Singleton
- **Persistencia**: localStorage, memoria estructurada
- **Router**: Custom router con guardias

## 📈 Escalabilidad

Este proyecto está diseñado para escalar fácilmente a un backend real:

- **API Mock → REST API**: Reemplazar mock por endpoints reales
- **localStorage → Base de datos**: Migrar a PostgreSQL, MongoDB, etc.
- **Auth simulada → JWT**: Implementar autenticación con tokens reales
- **Vanilla JS → Framework**: Migrar a React, Vue, Angular

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios propuestos.

---

**Desarrollado como demostración de capacidades técnicas y arquitectónicas**
