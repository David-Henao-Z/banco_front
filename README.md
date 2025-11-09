# 🏦 Banco Digital - Frontend

Una aplicación web moderna para la gestión bancaria desarrollada con React, TypeScript y Atomic Design.

## 🚀 Características Principales

- **Sistema de Autenticación** completo con Redux Toolkit
- **Dashboard Administrativo** con 5 secciones principales
- **Arquitectura Atomic Design** para componentes reutilizables
- **Diseño Responsive** con Tailwind CSS
- **TypeScript** para mayor seguridad de tipos
- **Routing** dinámico con React Router

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- **Git** - [Descargar aquí](https://git-scm.com/)

### Verificar instalación:
```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar 8.x.x o superior
git --version   # Cualquier versión reciente
```

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/David-Henao-Z/banco_front.git
cd banco_front
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173/**

## 🏗️ Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Vista previa de la construcción de producción
npm run lint         # Ejecuta el linter ESLint
```

## 🎯 Cómo Usar la Aplicación

### 1. **Página Principal**
- Información general del banco
- Servicios ofrecidos
- Misión y visión
- Botón para iniciar sesión

### 2. **Iniciar Sesión**
Credenciales de prueba:
- **Usuario:** `admin@banco.com`
- **Contraseña:** `admin123`

### 3. **Dashboard Administrativo**
Una vez autenticado, accede a 5 secciones:

#### 📊 **Resumen General**
- Estadísticas en tiempo real
- Actividad reciente
- Alertas del sistema

#### 👥 **Gestión de Clientes**
- Lista de clientes registrados
- Búsqueda y filtrado
- Agregar nuevos clientes
- Ver detalles de cada cliente

#### 💳 **Gestión de Cuentas**
- Administración de cuentas bancarias
- Estados: Activa, Inactiva, Congelada
- Filtros por tipo y estado
- Balance total del sistema

#### 🏦 **Tipos de Cuenta**
- Configuración de productos bancarios
- Cuenta Básica, Ahorros, Corriente, Premium
- Tasas de interés y comisiones
- Características de cada tipo

#### 💰 **Transacciones**
- Historial completo de transacciones
- Filtros por tipo: Depósito, Retiro, Transferencia, Pago
- Estados: Completada, Pendiente, Fallida
- Exportación de reportes

## 🧩 Arquitectura Atomic Design

Este proyecto utiliza la metodología **Atomic Design** para organizar los componentes de manera escalable y mantenible.

### 🔬 **Átomos** (`src/components/atoms/`)
Componentes básicos e indivisibles:
- **Button** - Botones reutilizables con variantes
- **Input** - Campos de entrada con validación
- **Card** - Contenedores de contenido

```tsx
// Ejemplo de uso
<Button variant="primary" size="lg">
  Guardar
</Button>
```

### 🧪 **Moléculas** (`src/components/molecules/`)
Combinaciones simples de átomos:
- **Sidebar** - Navegación lateral del dashboard
- **DashboardHeader** - Header con información del usuario
- **StatsCard** - Tarjetas de estadísticas

```tsx
// Ejemplo de uso
<StatsCard 
  title="Total Clientes"
  value="2,543"
  icon="👥"
  trend={{ value: "12%", isPositive: true }}
/>
```

### 🦠 **Organismos** (`src/components/organisms/`)
Componentes complejos que forman secciones:
- **LoginForm** - Formulario completo de autenticación
- **ProtectedRoute** - Protección de rutas

### 📄 **Templates** (`src/components/templates/`)
Layouts de páginas completas:
- **OverviewSection** - Sección de resumen
- **ClientsSection** - Gestión de clientes
- **AccountsSection** - Gestión de cuentas
- **AccountTypesSection** - Tipos de cuenta
- **TransactionsSection** - Historial de transacciones

### 🖼️ **Páginas** (`src/pages/`)
Páginas completas de la aplicación:
- **HomePage** - Página de inicio
- **LoginPage** - Página de login
- **Dashboard** - Panel administrativo

## 🏛️ Estructura del Proyecto

```
banco_front/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes organizados por Atomic Design
│   │   ├── atoms/         # Componentes básicos
│   │   ├── molecules/     # Combinaciones simples
│   │   ├── organisms/     # Componentes complejos
│   │   └── templates/     # Layouts de página
│   ├── interfaces/        # Tipos de TypeScript
│   ├── pages/            # Páginas de la aplicación
│   ├── routes/           # Configuración de routing
│   ├── services/         # Servicios de API
│   ├── store/            # Estado global con Redux
│   └── utils/            # Utilidades y helpers
├── .gitignore            # Archivos ignorados por Git
├── package.json          # Dependencias y scripts
├── tailwind.config.js    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
└── vite.config.ts        # Configuración de Vite
```

## 🔧 Tecnologías Utilizadas

### **Frontend Framework**
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción rápida

### **Estilos**
- **Tailwind CSS** - Framework de CSS utilitario
- **PostCSS** - Procesador de CSS

### **Estado Global**
- **Redux Toolkit** - Gestión de estado simplificada
- **React Redux** - Bindings oficiales de React para Redux

### **Routing**
- **React Router DOM** - Enrutamiento declarativo

### **Herramientas de Desarrollo**
- **ESLint** - Linter de JavaScript/TypeScript
- **Git** - Control de versiones

## 🌐 Integración con Backend

La aplicación está configurada para conectarse con una API backend en:
- **URL:** `http://localhost:8000`
- **Endpoint de autenticación:** `/token`

### Configuración de CORS
Asegúrate de que tu backend permita solicitudes desde:
- `http://localhost:5173` (desarrollo)
- `http://localhost:4173` (preview)

## 📱 Diseño Responsive

La aplicación está optimizada para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔒 Seguridad

- **Rutas protegidas** con autenticación
- **Tokens JWT** para sesiones
- **Validación** en formularios
- **Variables de entorno** para configuración sensible

## 🚀 Despliegue

### Para producción:
```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`

### Plataformas recomendadas:
- **Vercel** (recomendado para React)
- **Netlify**
- **GitHub Pages**

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**David Henao Z** - [GitHub](https://github.com/David-Henao-Z)

---

## 💡 Próximas Funcionalidades

- [ ] Reportes avanzados con gráficos
- [ ] Notificaciones en tiempo real
- [ ] Tema oscuro/claro
- [ ] Exportación a PDF/Excel
- [ ] Chat de soporte integrado
- [ ] Autenticación de dos factores

---

¿Tienes preguntas o sugerencias? ¡Abre un issue en GitHub!