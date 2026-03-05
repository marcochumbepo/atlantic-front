# Decisiones Técnicas del Frontend

## Resumen

Este documento detalla las decisiones técnicas tomadas en el desarrollo del frontend de Atlantic Orders, explicando el razonamiento detrás de cada elección arquitectónica.

---

## 1. Decisiones de Framework

### 1.1 React vs Vue vs Angular

**Decisión:** Usar React 19.

**Alternativas Consideradas:**
- Vue 3 (excelente, pero comunidad menor)
- Angular (complejo para este proyecto)
- Svelte (comunidad pequeña)

**Razonamiento:**

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPARACIÓN FRAMEWORKS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  React                    Vue                    Angular    │
│  ┌─────────┐             ┌─────────┐          ┌─────────┐ │
│  │Virtual  │             │Virtual  │          │Real DOM │ │
│  │DOM      │             │DOM      │          │         │ │
│  ├─────────┤             ├─────────┤          ├─────────┤ │
│  │Comunidad│             │Comunidad│          │Comunidad│ │
│  │Massiva  │             │Grande   │          │Grande   │ │
│  ├─────────┤             ├─────────┤          ├─────────┤ │
│  │Trabajo  │             │Trabajo  │          │Trabajo  │ │
│  │Flexible │             │Estruct. │          │Estruct. │ │
│  └─────────┘             └─────────┘          └─────────┘ │
│                                                             │
│  ✅ Ecosistema maduro    ✅ Vuex/Pinia     ✅ TypeScript   │
│  ✅ React Native        ✅ Docs español    ✅ Enterprise   │
│  ✅ Flexibilidad        ✅ Curva suave     ❌ Complejo     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Justificación:**
- Mayor ecosistema de librerías
- Flexibilidad para estructurar el código
- Gran disponibilidad de desarrolladores
- React 19 con Server Components es el futuro de React
- Facilidad para encontrar recursos y documentación

---

### 1.2 Vite vs Create React App vs Webpack

**Decisión:** Usar Vite 7 como build tool.

**Alternativas Consideradas:**
- Create React App (oficial pero deprecated)
- Webpack (complejo y lento)
- Next.js (overkill para SPA simple)

**Razonamiento:**

| Aspecto | Vite | Create React App | Webpack |
|---------|------|------------------|---------|
| Velocidad dev | ⚡ Instant | ❌ Lento | ❌ Lento |
| Hot Reload | ✅ Rápido | ✅ Bueno | ✅ Bueno |
| Build | ✅ Rápido | ⚠️ Aceptable | ⚠️ Medio |
| Configuración | ✅ Simple | ❌ Compleja | ❌ Compleja |
| Mantenimiento | ✅ Activo | ❌ Deprecated | ✅ Activo |

**Resultado práctico:**
```bash
# Tiempo de inicio
Vite: ~500ms
CRA: ~30-60 segundos

# Velocidad de build
Vite: 3-4 segundos
CRA: 60-120 segundos
```

**Justificación:**
- Velocidad de desarrollo instantánea
- Configuración mínima necesaria
- Mejora significativa en productividad
- Equipo pequeño no necesita configuraciones complejas

---

## 2. Decisiones de Estado

### 2.1 Context API vs Redux vs Zustand

**Decisión:** Usar React Context API con useReducer para autenticación.

**Alternativas Consideradas:**
- Redux (complejo, overkill)
- Zustand (simple pero nuevo)
- Jotai (atomic, overkill para esto)

**Razonamiento:**

```javascript
// Solución implementada: useReducer
const [state, dispatch] = useReducer(authReducer, initialState);

const value = {
    user: state.user,
    token: state.token,
    login: (user, token) => dispatch({ type: 'LOGIN', payload: { user, token } }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    isAuthenticated: !!state.token
};
```

**Por qué no Redux:**
- boilerplate excesivo
- Solo necesitamos estado de autenticación
- Complejidad innecesaria para caso de uso simple

**Por qué no Zustand:**
- Librería externa adicional
- Context API es suficiente
- Menos dependencias = menos mantenimiento

**Justificación:**
- Solo necesitamos estado global de autenticación
- No hay rendimiento negativo por la simplicidad
- Menos dependencias
- API nativa de React
- Perfecto para este caso de uso

---

### 2.2 sessionStorage vs localStorage vs Cookies

**Decisión:** Usar sessionStorage para tokens JWT.

**Análisis:**

| Almacenamiento | Persistencia | Accesible JS | XSS | CSRF |
|----------------|--------------|--------------|-----|------|
| localStorage | Indefinida | ✅ Sí | ✅ Sí | ❌ No |
| sessionStorage | Tab | ✅ Sí | ✅ Sí | ❌ No |
| Cookies (HttpOnly) | Configurable | ❌ No | ❌ No | ✅ Sí |
| Cookies (Normal) | Configurable | ✅ Sí | ✅ Sí | ✅ Sí |

**Riesgo de localStorage (descartado):**
- Persiste después de cerrar el navegador
- Mayor ventana de ataque XSS
- No se limpia automáticamente

**Riesgo de Cookies (descartado):**
- Requiere backend para HttpOnly
- Vulnerable a CSRF
- Más complejo de implementar

**Decisión final:**
```javascript
// AuthContext.jsx - Usando sessionStorage
const login = (userData, tokenData) => {
    sessionStorage.setItem('token', tokenData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: { user: userData, token: tokenData } });
};

const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
};
```

**Justificación:**
- Tokens se limpian al cerrar pestaña/navegador
- Reduce ventana de ataque XSS
- Balance entre seguridad y UX
- Implementación simple sin backend

---

## 3. Decisiones de Estilos

### 3.1 Tailwind CSS vs Styled Components vs CSS Modules

**Decisión:** Usar Tailwind CSS.

**Alternativas Consideradas:**
- Styled Components (CSS-in-JS)
- CSS Modules
- SASS/SCSS

**Razonamiento:**

```
┌─────────────────────────────────────────────────────────────┐
│                   ESTILOS COMPARADOS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tailwind CSS          Styled Components    CSS Modules     │
│  ┌─────────┐          ┌─────────┐          ┌─────────┐    │
│  │Utility  │          │CSS-in-JS│          │CSS Local│    │
│  │Classes  │          │         │          │         │    │
│  ├─────────┤          ├─────────┤          ├─────────┤    │
│  ✅ Rapid UI      ✅ Componentes    ✅ Simple      │
│  ✅ PurgeCSS     ❌ Runtime        ✅ Familiar    │
│  ✅ Dark mode   ❌ Dependencia    ❌ Naming      │
│  ✅ Responsive  ❌ Debug hard     ❌ No tokens   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Ventajas de Tailwind:**
1. **Desarrollo rápido:** Clases utilitarias
2. **Bundle pequeño:** PurgeCSS elimina lo no usado
3. **Consistencia:** Design tokens
4. **Responsive:** Prefijos incorporados
5. **Mantenible:** No hay archivos CSS largos
6. **No hay colisiones:** Prefijos de clase automáticos

**Ejemplo comparativo:**

```jsx
// Antes: CSS tradicional
.button {
    background-color: blue;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: background-color 0.2s;
}
.button:hover {
    background-color: darkblue;
}

// Después: Tailwind
<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
    Click me
</button>
```

**Justificación:**
- Curva de aprendizaje moderada
- Mejora drástica en velocidad de desarrollo
- Bundle size optimizado automáticamente
- Comunidad grande y activos disponibles

---

## 4. Decisiones de Datos

### 4.1 Axios vs Fetch API

**Decisión:** Usar Axios.

**Razonamiento:**

| Feature | Axios | Fetch |
|---------|-------|-------|
| Transform request | ✅ | ❌ |
| Transform response | ✅ | ❌ |
| Automatic JSON | ✅ | ❌ |
| Interceptors | ✅ | ❌ |
| Cancel requests | ✅ | ❌ |
| Error handling | ✅ | ❌ |
| Progress upload | ✅ | ⚠️ |

**Ejemplo de interceptores implementados:**

```javascript
// axios.js
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

**Justificación:**
- Interceptors para agregar token automáticamente
- Manejo centralizado de errores
- Transformación de request/response
- API más limpia y legible

---

### 4.2 Feature-Based Architecture

**Decisión:** Estructurar por características/módulos.

**Alternativas:**
- Por tipo de archivo (controllers/, views/, etc.)
- DDD (Domain-Driven Design)

**Razonamiento:**

```javascript
// Estructura chosen: features/
src/
├── features/
│   ├── auth/           // Módulo de autenticación
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── pedidos/        // Módulo de pedidos
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   │
│   └── shared/         // Compartidos
│       ├── components/
│       ├── constants/
│       └── utils/
```

**Ventajas:**
1. **Agrupación lógica:** Todo relacionado con "auth" está junto
2. **Escalabilidad:** Agregar nuevos módulos es fácil
3. **Mantenibilidad:** Cambios en una funcionalidad localizada
4. **Testing:** Cada módulo testeable independientemente

**Alternativa descartada (por tipo):**

```javascript
// Estructura descartada
src/
├── controllers/     // ❌ Difícil de mantener
├── views/
├── services/
└── utils/
```

---

## 5. Decisiones de Routing

### 5.1 React Router v6

**Decisión:** Usar React Router v6.

**Razonamiento:**

```javascript
// AppRouter.jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  <Route path="/pedidos" element={
    <ProtectedRoute>
      <PedidosListPage />
    </ProtectedRoute>
  } />
  
  <Route path="*" element={<Navigate to="/pedidos" />} />
</Routes>
```

**Características usadas:**
- **Routes:** Nueva sintaxis de v6
- **ProtectedRoute:** Componente para rutas privadas
- **Navigate:** Redirecciones
- **useParams:** Parámetros de URL

**Justificación:**
- API moderna de v6
- Soporte para rutas anidadas
- Mejores tipos en TypeScript (futuro)
- Documentación excelente

---

## 6. Decisiones de Seguridad

### 6.1 Protección contra XSS

**Decisión:** No usar `dangerouslySetInnerHTML`.

**Razonamiento:**

```javascript
// ❌ NUNCA hacer esto
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SIEMPRE hacer esto
<div>{userInput}</div>  // React escapa automáticamente
```

**Justificación:**
- React escapa todo por defecto
- Previene ataques XSS automáticamente
- Solo usar dangerouslySetInnerHTML si es absolutamente necesario

---

### 6.2 Manejo de Errores de Autenticación

**Decisión:** Redireccionar a login en caso de 401.

```javascript
// axios interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Justificación:**
- Sesión expirada = usuario debe loguearse de nuevo
- No mostrar contenido protegido
- Experiencia de usuario consistente

---

## 7. Decisiones de Build

### 7.1 Optimización de Bundle

**Decisiones implementadas:**

1. **Tree shaking:** Vite elimina código no usado
2. **Code splitting:** Por rutas
3. **Minificación:** Terser para JS, CSSNano para CSS
4. **Hashes:** Para cache busting

**Resultados:**

| Métrica | Valor |
|---------|-------|
| JS Total | 271.18 kB |
| JS Gzipped | 88.21 kB |
| CSS Total | 26.31 kB |
| CSS Gzipped | 5.16 kB |

---

### 7.2 ESLint como Quality Gate

**Decisión:** Usar ESLint con reglas estrictas.

**Reglas aplicadas:**

```javascript
// eslint.config.js
{
  rules: {
    'react/react-in-jsx-scope': 'off',  // React 17+ no requiere import React
    'react-hooks/set-state-in-effect': 'error',  // Evitar renders en cascada
    'react-hooks/exhaustive-deps': 'warn',  // Dependencias completas
    'no-unused-vars': 'error',  // Variables sin usar
  }
}
```

**Justificación:**
- Previene errores comunes
- Mantiene código limpio
- Facilita mantenimiento
- Integración con CI/CD

---

## 8. Decisiones de Docker

### 8.1 Nginx como Servidor

**Decisión:** Usar Nginx para servir la SPA.

**Razonamiento:**

```nginx
# nginx.conf
server {
    location / {
        try_files $uri $uri/ /index.html;  # SPA routing
    }
    
    location /api/ {
        proxy_pass http://backend:5000/api/;
    }
}
```

**Ventajas:**
1. **Rendimiento:** Optimizado para archivos estáticos
2. **SPA routing:** try_files para React Router
3. **Gzip:** Compresión automática
4. **Cache:** Headers de cache configurables

**Por qué no servir con Vite preview:**
- Vite preview es para desarrollo
- Nginx es producción-ready
- Mejor manejo de caché
- Balanceo de carga si hay múltiples instancias

---

### 8.2 Multi-stage Build

**Decisión:** Usar multi-stage build para imagen pequeña.

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm ci && npm run build

# Stage 2: Servir
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Ventajas:**
- Imagen final pequeña (~50MB vs ~1GB)
- Solo lo necesario en producción
- Seguridad mejorada

---

## 9. Lecciones Aprendidas y Mejoras

### 9.1 Lo que hicimos bien

1. ✅ Feature-Based Architecture desde el inicio
2. ✅ Tailwind CSS para estilos rápidos
3. ✅ useReducer para estado predecible
4. ✅ sessionStorage por seguridad
5. ✅ Axios con interceptores

### 9.2 Lo que mejoraríamos

1. **TypeScript:** Agregar tipos para mayor seguridad
2. **React Query:** Para data fetching optimizado
3. **Testing:** Agregar Vitest y Testing Library
4. **Storybook:** Para documentación de componentes
5. **i18n:** Para internacionalización

---

## 10. Glosario de Términos

| Término | Definición |
|---------|------------|
| SPA | Single Page Application |
| Vite | Build tool moderno |
| Tree Shaking | Eliminación de código muerto |
| Bundle | Archivo JavaScript combinado |
| Hot Reload | Recarga sin perder estado |
| Context API | API de estado global de React |
| useReducer | Hook para estado complejo |
| Interceptor | Función que拦截 requests/responses |
| SPA Routing | Navegación sin recargar página |
| XSS | Cross-Site Scripting |

---

**Última actualización:** Marzo 2026
**Versión:** 1.0.0
