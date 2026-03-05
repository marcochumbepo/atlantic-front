# Guía de Instalación del Proyecto Atlantic Orders - Frontend

## Requisitos Previos

### Software Requerido

| Software | Versión Mínima | Versión Recomendada |
|----------|----------------|---------------------|
| Node.js | 18.x LTS | 20.x LTS |
| npm | 9.x | 10.x |
| Visual Studio Code | 1.80 | Latest |

### Herramientas Adicionales Recomendadas

- **Git** - Control de versiones
- **Postman o Insomnia** - Testing de API
- **Navegador web** - Chrome, Firefox, Edge (última versión)

---

## Estructura del Proyecto Frontend

```
front/
├── src/
│   ├── features/
│   │   ├── auth/                    # Módulo de autenticación
│   │   │   ├── components/
│   │   │   ├── context/            # AuthContext
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   │
│   │   ├── pedidos/                 # Módulo de pedidos
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   │
│   │   └── shared/                  # Componentes compartidos
│   │       ├── components/
│   │       ├── constants/
│   │       ├── hooks/
│   │       └── utils/
│   │
│   ├── routes/                      # Configuración de rutas
│   ├── App.jsx                     # Componente principal
│   └── main.jsx                    # Punto de entrada
│
├── public/                          # Archivos estáticos
├── dist/                           # Build de producción
├── documentacion/                  # Esta documentación
├── package.json                    # Dependencias npm
├── vite.config.js                  # Configuración de Vite
├── tailwind.config.js             # Configuración de Tailwind
└── eslint.config.js               # Configuración de ESLint
```

---

## Instalación Paso a Paso

### Paso 1: Requisitos del Sistema

Verificar que Node.js está instalado:

```bash
# Verificar versión de Node
node --version

# Verificar versión de npm
npm --version
```

Debería mostrar versiones 18.x o superiores.

### Paso 2: Navegar al Directorio del Proyecto

```bash
cd Atlantic/front
# o
cd C:\Users\TU_USUARIO\Documents\PROYECTOS_MARCO\PORTAFOLIO\Atlantic\front
```

### Paso 3: Instalar Dependencias

```bash
npm install
```

Este comando:
- Lee el archivo `package.json`
- Descarga e instala todas las dependencias
- Crea la carpeta `node_modules`

**Dependencias principales instaladas:**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| react | ^19.0.0 | Biblioteca principal |
| react-dom | ^19.0.0 | React DOM |
| react-router-dom | ^6.x | Enrutamiento |
| axios | ^1.x | Cliente HTTP |
| tailwindcss | ^3.x | Estilos CSS |
| vite | ^7.x | Build tool |
| eslint | ^9.x | Linting |

### Paso 4: Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto (`front/.env`):

```env
# URL del API Backend (desarrollo)
VITE_API_BASE_URL=http://localhost:5000

# URL del API Backend (producción) - Descomenta y configura
# VITE_API_BASE_URL=https://api.tu-dominio.com
```

### Paso 5: Ejecutar en Modo Desarrollo

```bash
npm run dev
```

El servidor de desarrollo arrancará en: **http://localhost:5173**

### Paso 6: Verificar Funcionamiento

1. Abrir navegador en http://localhost:5173
2. Debería mostrar la página de login
3. Credenciales de prueba:
   - Email: `demo@example.com`
   - Password: `password123`

---

## Comandos npm Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Generar build de producción |
| `npm run preview` | Previsualizar build de producción |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Auto-corregir errores de ESLint |

---

## Generación de Build de Producción

### Paso 1: Limpiar Build Anterior (opcional)

```bash
rm -rf dist
```

### Paso 2: Generar Build

```bash
npm run build
```

Este comando:
- Optimiza el código
- Minifica archivos
- Genera hashes para cache
- Crea carpeta `dist/`

### Paso 3: Previsualizar Build

```bash
npm run preview
```

Esto sirve el build en http://localhost:4173 para verificar.

---

## Configuración de ESLint

### Estructura de Reglas

El proyecto usa ESLint con configuración moderna (flat config):

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

### Ejecutar Linting

```bash
# Verificar errores
npm run lint

# Auto-corregir errores
npm run lint:fix
```

---

## Configuración de Tailwind CSS

### Estructura

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
        secondary: '#111827',
        accent: '#3B82F6',
      },
    },
  },
  plugins: [
    forms,
  ],
}
```

### Personalización de Colores

Puedes agregar más colores en `theme.extend.colors`:

```javascript
colors: {
  primary: '#1F2937',
  secondary: '#111827',
  accent: '#3B82F6',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
}
```

---

## Conexión con el Backend

### Configuración de URL API

El archivo `src/features/shared/constants/api.js` contiene la configuración:

```javascript
const isDev = import.meta.env.DEV;
const API_PROD_URL = 'https://api.tu-dominio.com';
const API_DEV_URL = 'http://localhost:8080';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                            (isDev ? API_DEV_URL : API_PROD_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'api/auth/login',
    REFRESH: 'api/auth/refresh',
    LOGOUT: 'api/auth/logout',
  },
  PEDIDOS: {
    GET_ALL: 'api/pedidos',
    GET_ONE: (id) => `api/pedidos/${id}`,
    CREATE: 'api/pedidos',
    UPDATE: (id) => `api/pedidos/${id}`,
    DELETE: (id) => `api/pedidos/${id}`,
  },
};
```

### Endpoints Requeridos

El frontend espera que el backend proporcione:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/refresh | Renovar token |
| POST | /api/auth/logout | Cerrar sesión |
| GET | /api/pedidos | Listar pedidos |
| GET | /api/pedidos/:id | Obtener pedido |
| POST | /api/pedidos | Crear pedido |
| PUT | /api/pedidos/:id | Actualizar pedido |
| DELETE | /api/pedidos/:id | Eliminar pedido |

---

## Solución de Problemas Comunes

### Error: "Cannot find module 'X'"

```bash
# Limpiar caché
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

### Error: Puerto 5173 en uso

```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :5173

# Cambiar puerto en vite.config.js
```

### Error de CORS

Si el frontend no puede comunicarse con el backend:

1. Verificar que el backend tenga CORS configurado
2. Verificar la URL en `.env`
3. Verificar que el backend esté ejecutándose

### Error de ESLint

```bash
# Ver errores específicos
npm run lint

# Auto-corregir
npm run lint:fix

# Si persiste, eliminar config y regenerar
rm eslint.config.js
npx eslint --init
```

---

## Estructura de Componentes

### Páginas

| Página | Ruta | Descripción |
|--------|------|-------------|
| LoginPage | /login | Página de inicio de sesión |
| PedidosListPage | /pedidos | Listado de pedidos |
| PedidosFormPage | /pedidos/nuevo | Crear pedido |
| PedidosFormPage | /pedidos/:id/editar | Editar pedido |

### Componentes Compartidos

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| Navbar | shared/components/ | Barra de navegación |
| Alert | shared/components/ | Mensajes de alerta |
| ConfirmDialog | shared/components/ | Diálogo de confirmación |
| ProtectedRoute | auth/components/ | Ruta protegida |

---

## Gestión de Estado

### AuthContext

El proyecto usa React Context para autenticación:

```javascript
// Uso del contexto
import { useAuth } from './features/auth/hooks/useAuth';

function MyComponent() {
  const { user, token, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <p>Hola, {user?.nombre}</p>;
}
```

### Estado Local

Para estado local se usa `useState`:

```javascript
const [pedidos, setPedidos] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

---

## Estilos y Tailwind CSS

### Clases Utilitarias

El proyecto usa Tailwind CSS para estilos:

```jsx
// Ejemplo de uso
<div className="min-h-screen bg-gray-50">
  <h1 className="text-3xl font-bold text-gray-900">
    Mi Título
  </h1>
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
    Click me
  </button>
</div>
```

### Componentes con Estilos

```jsx
// Ejemplo de componente estilizado
export const MiComponente = () => (
  <div className="p-4 m-4 bg-white rounded-lg shadow">
    <p className="text-gray-600">Contenido</p>
  </div>
);
```

---

## Siguientes Pasos

1. **Verificar que funciona:** Ejecutar `npm run dev` y probar el login
2. **Conectar con Backend:** Asegurarse que el backend esté ejecutándose
3. **Personalizar:** Modificar colores, textos, según necesidades
4. **Producción:** Generar build con `npm run build`

---

## Contacto y Soporte

- Revisar issues en el repositorio
- Contactar al equipo de desarrollo

---

**Última actualización:** Marzo 2026
**Versión del frontend:** 1.0.0
