# Arquitectura y Tecnologías del Frontend

## Resumen Ejecutivo

El frontend de **Atlantic Orders** es una aplicación web progresiva (PWA) construida con **React 19** y **Vite**. Utiliza una arquitectura basada en características (Feature-Based Architecture) con patrones modernos de React.

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| Framework | React 19.2 | Biblioteca UI |
| Build Tool | Vite 7 | Desarrollo y build |
| Routing | React Router v6 | Navegación |
| Estilos | Tailwind CSS | Diseño responsivo |
| Estado | React Context | Estado global |

---

## Arquitectura del Frontend

### Patrón: Feature-Based Architecture

El proyecto sigue una arquitectura basada en características módulos:

```
src/
├── features/                    # Funcionalidades por módulo
│   ├── auth/                   # Módulo de autenticación
│   │   ├── components/         # Componentes específicos
│   │   ├── context/            # React Context
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Páginas/LoginPage
│   │   └── services/           # Servicios API
│   │
│   ├── pedidos/                 # Módulo de pedidos
│   │   ├── components/         # PedidoCard
│   │   ├── hooks/             # usePedidos
│   │   ├── pages/             # ListPage, FormPage
│   │   └── services/           # pedidosService
│   │
│   └── shared/                  # Componentes compartidos
│       ├── components/         # Navbar, Alert, ConfirmDialog
│       ├── constants/          # api.js, routes.js
│       ├── hooks/              # useAuth
│       └── utils/              # axios, validators
│
├── routes/                     # Configuración de rutas
├── App.jsx                     # Componente raíz
└── main.jsx                   # Punto de entrada
```

### Flujo de Datos

```
Usuario → Página → Hook → Service → Axios → API Backend
                ↓
           Context (Estado Global de Auth)
```

---

## Tecnologías Utilizadas

### Core

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19.2 | Biblioteca principal de UI |
| React DOM | 19.2 | Renderizado del DOM |
| JavaScript | ES2022 | Lenguaje de programación |

### Build y Desarrollo

| Tecnología | Propósito |
|------------|-----------|
| Vite 7 | Build tool ultrarrápido |
| ESLint 9 | Linting de código |
| PostCSS | Procesador CSS |

### Enrutamiento

| Tecnología | Propósito |
|------------|-----------|
| React Router DOM v6 | Navegación SPA |

### Estilos

| Tecnología | Propósito |
|------------|-----------|
| Tailwind CSS 3 | Framework CSS utilitario |
| @tailwindcss/forms | Plugin para formularios |

### Estado y Datos

| Tecnología | Propósito |
|------------|-----------|
| React Context API | Estado global |
| Axios | Cliente HTTP |

---

## Estructura de Módulos

### Módulo de Autenticación (auth)

**Responsabilidad:** Manejar login, logout y estado de autenticación.

```
features/auth/
├── components/
│   └── ProtectedRoute.jsx      # Ruta protegida
├── context/
│   └── AuthContext.jsx         # Estado de autenticación
├── hooks/
│   └── useAuth.js             # Hook para usar contexto
├── pages/
│   └── LoginPage.jsx          # Página de login
└── services/
    └── authService.js         # Llamadas API auth
```

### Módulo de Pedidos (pedidos)

**Responsabilidad:** CRUD de pedidos.

```
features/pedidos/
├── components/
│   └── PedidoCard.jsx         # Tarjeta de pedido
├── hooks/
│   └── usePedidos.js          # Hook para pedidos
├── pages/
│   ├── PedidosListPage.jsx    # Listado de pedidos
│   └── PedidosFormPage.jsx    # Formulario de pedido
└── services/
    └── pedidosService.js      # Llamadas API pedidos
```

### Módulo Compartido (shared)

**Responsabilidad:** Componentes y utilidades reutilizables.

```
features/shared/
├── components/
│   ├── Navbar.jsx             # Barra de navegación
│   ├── Alert.jsx              # Mensajes de alerta
│   └── ConfirmDialog.jsx      # Diálogo de confirmación
├── constants/
│   ├── api.js                 # Configuración de API
│   └── routes.js              # Definición de rutas
├── hooks/
│   └── useAuth.js             # Hook de autenticación
└── utils/
    ├── axios.js               # Instancia axios
    └── validators.js          # Validadores
```

---

## Flujo de Autenticación

### Login Flow

```
1. Usuario ingresa credenciales en LoginPage
2. LoginPage llama a authService.login(email, password)
3. authService.post('/api/auth/login')
4. Backend retorna: { token, user, refreshToken }
5. AuthContext.login(user, token) actualiza estado
6. Token se guarda en sessionStorage
7. Redirección a /pedidos
```

### Protected Route

```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### Logout Flow

```
1. Usuario hace click en cerrar sesión
2. Se llama auth3. SeService.logout()
 llama AuthContext.logout()
4. Se elimina token de sessionStorage
5. Se limpia estado de autenticación
6. Redirección a /login
```

---

## Gestión de Estado

### Estado Global (AuthContext)

```javascript
// AuthContext.jsx - usa useReducer
const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, error: null };
    case 'LOGOUT':
      return { ...state, user: null, token: null, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
```

### Estado Local (useState)

```javascript
// Ejemplo en PedidosListPage
const [pedidos, setPedidos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

---

## Comunicación con API

### Axios Instance

```javascript
// axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - agregar token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - manejar 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Servicios API

```javascript
// pedidosService.js
import api from '../../shared/utils/axios';

export const pedidosService = {
  getAll: () => api.get('/api/pedidos'),
  getById: (id) => api.get(`/api/pedidos/${id}`),
  create: (data) => api.post('/api/pedidos', data),
  update: (id, data) => api.put(`/api/pedidos/${id}`, data),
  delete: (id) => api.delete(`/api/pedidos/${id}`),
};
```

---

## Estilos con Tailwind CSS

### Configuración

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,tsx}",
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
};
```

### Uso de Clases

```jsx
// Ejemplo de componente estilizado
export const Navbar = () => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-900">
            Atlantic Orders
          </span>
        </div>
      </div>
    </div>
  </nav>
);
```

---

## Enrutamiento

### Configuración de Rutas

```javascript
// AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { PedidosListPage } from '../features/pedidos/pages/PedidosListPage';
import { PedidosFormPage } from '../features/pedidos/pages/PedidosFormPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/pedidos" element={
        <ProtectedRoute>
          <PedidosListPage />
        </ProtectedRoute>
      } />
      
      <Route path="/pedidos/nuevo" element={
        <ProtectedRoute>
          <PedidosFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="/pedidos/:id/editar" element={
        <ProtectedRoute>
          <PedidosFormPage />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/pedidos" replace />} />
    </Routes>
  );
};
```

---

## Build y Producción

### Proceso de Build

```
1. npm run build
   ├── Vite analiza dependencias
   ├── Elimina código no usado (tree shaking)
   ├── Minifica JavaScript y CSS
   ├── Genera hashes para cache
   └── Crea carpeta dist/

2. dist/
   ├── index.html
   ├── assets/
   │   ├── index-XXXX.js    # Bundle JavaScript
   │   └── index-XXXX.css   # Bundle CSS
   └── favicon.ico
```

### Optimizaciones

| Optimización | Descripción |
|-------------|-------------|
| Code Splitting | División de código por rutas |
| Tree Shaking | Eliminación de código muerto |
| Minificación | Compresión de archivos |
| Gzip/Brotli | Compresión a nivel de servidor |
| Cache Hashing | Archivos con hash para cache |

### Tamaño del Bundle

| Archivo | Tamaño | Tamaño Gzipped |
|---------|--------|----------------|
| JS | 271.18 kB | 88.21 kB |
| CSS | 26.31 kB | 5.16 kB |
| HTML | 0.45 kB | 0.29 kB |
| **Total** | **297.94 kB** | **93.66 kB** |

---

## Comparación con Alternativas

### React vs Vue vs Angular

| Aspecto | React | Vue | Angular |
|---------|-------|-----|---------|
| Virtual DOM | ✅ Sí | ✅ Sí | ❌ Real DOM |
| Curva aprendizaje | Media | Suave | Alta |
| Flexibilidad | ✅ Alta | ✅ Media | ❌ Estricta |
| Ecosistema | ✅ Grande | ✅ Grande | ✅ Grande |
| Estado | Context/Redux | Pinia/Vuex | NgRx/Services |
| Rendimiento | ✅ Alto | ✅ Alto | ⚠️ Medio |

**Nuestra elección:** React por su flexibilidad y ecosistema.

### Vite vs Webpack vs CRA

| Aspecto | Vite | Webpack | CRA |
|---------|------|---------|-----|
| Velocidad dev | ⚡ Instant | ❌ Lento | ❌ Lento |
| HMR | ✅ Rápido | ✅ Bueno | ✅ Bueno |
| Configuración | ✅ Simple | ❌ Compleja | ❌ Compleja |
| Build | ✅ Rápido | ⚠️ Medio | ⚠️ Medio |

**Nuestra elección:** Vite por velocidad y simplicidad.

### Tailwind vs Styled Components vs CSS Modules

| Aspecto | Tailwind | Styled Components | CSS Modules |
|---------|----------|-------------------|-------------|
| Runtime | ❌ No | ✅ Sí | ❌ No |
| CSS-in-JS | ❌ No | ✅ Sí | ❌ No |
| PurgeCSS | ✅ Sí | ❌ No | ❌ No |
| Curva | ✅ Baja | ⚠️ Media | ✅ Baja |

**Nuestra elección:** Tailwind por rendimiento y desarrollo rápido.

---

## Seguridad en el Frontend

### Medidas Implementadas

| Medida | Descripción |
|--------|-------------|
| XSS Prevention | React escapa todo por defecto |
| No dangerouslySetInnerHTML | Evitado deliberadamente |
| Token Storage | sessionStorage (no localStorage) |
| HTTPS Enforcement | En producción |

### Tokens y Seguridad

```javascript
// Buenos prácticas implementadas:
// 1. Token en sessionStorage (se limpia al cerrar pestaña)
sessionStorage.setItem('token', token);

// 2. Token en header Authorization
config.headers.Authorization = `Bearer ${token}`;

// 3. Manejo de 401
if (error.response?.status === 401) {
  sessionStorage.removeItem('token');
  window.location.href = '/login';
}
```

---

## Testing y Calidad

### ESLint

El proyecto usa ESLint con reglas específicas:

```javascript
// Reglas aplicadas
{
  'react/react-in-jsx-scope': 'off',
  'react-hooks/set-state-in-effect': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'no-unused-vars': 'error',
}
```

### Hooks de ESLint

```bash
# Verificar código
npm run lint

# Auto-corregir
npm run lint:fix
```

---

## Resumen del Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  React 19.2 + Vite 7 + Tailwind CSS 3                      │
│                                                             │
│  ├── React Router v6        → Enrutamiento                 │
│  ├── Axios                  → HTTP Client                   │
│  ├── Tailwind CSS          → Estilos                        │
│  ├── ESLint                → Code Quality                  │
│  └── Nginx (Docker)        → Servidor                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Última actualización:** Marzo 2026
**Versión del frontend:** 1.0.0
