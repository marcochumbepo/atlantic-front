# Guía para el Levantamiento del Proyecto en Docker - Frontend

## Introducción

Esta guía describe cómo containerizar y desplegar el frontend de Atlantic Orders utilizando Docker.

El frontend se construye como una aplicación React optimizada y se sirve utilizando Nginx como servidor web estático.

---

## Requisitos Previos

### Software Necesario

| Software | Versión | Enlace |
|----------|---------|--------|
| Docker Desktop | 24.0+ | [docker.com](https://www.docker.com/products/docker-desktop) |
| Docker Compose | Incluido | - |
| Git | 2.40+ | [git-scm.com](https://git-scm.com) |

### Verificar Instalación

```bash
# Verificar versión de Docker
docker --version

# Verificar que Docker esté ejecutándose
docker ps
```

---

## Estructura de Docker para Frontend

### Archivos del Proyecto

```
front/
├── Dockerfile                 # Imagen del frontend
├── nginx.conf                # Configuración de Nginx
├── .dockerignore             # Archivos a excluir
├── docker-compose.yml        # Orquestación
└── docker-compose.prod.yml   # Producción
```

---

## Dockerfile del Frontend

Ubicación: `front/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de package
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Variables de entorno
ENV VITE_API_BASE_URL=http://localhost:5000

# Build de producción
RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine AS runner

# Copiar archivos del build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## Configuración de Nginx

Ubicación: `front/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Manejo de rutas SPA (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Archivos estáticos con cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy para API (opcional)
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## docker-compose.yml

Ubicación: `front/docker-compose.yml`

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: atlantic_frontend
    environment:
      - VITE_API_BASE_URL=http://localhost:5000
    ports:
      - "5173:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  default:
    name: atlantic_network
```

---

## Levantar el Proyecto con Docker

### Método 1: Desarrollo Local

```bash
# Navegar al directorio frontend
cd front

# Construir imagen
docker build -t atlantic-frontend .

# Ejecutar contenedor
docker run -p 5173:80 atlantic-frontend
```

Acceder a: http://localhost:5173

### Método 2: Con Docker Compose

```bash
# Construir y levantar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## Producción con Docker

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: atlantic_frontend_prod
    environment:
      - VITE_API_BASE_URL=https://api.tu-dominio.com
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host:tu-dominio.com"
```

### Build de Producción

```bash
# Construir imagen de producción
docker build -t atlantic-frontend:prod .

# Etiquetar para registry
docker tag atlantic-frontend:prod tu-registry.com/atlantic-frontend:latest

# Push a registry
docker push tu-registry.com/atlantic-frontend:latest
```

---

## Desarrollo con Hot Reload

Para desarrollo donde necesitas ver cambios en tiempo real:

### docker-compose.dev.yml

```yaml
version: '3.8'

services:
  frontend:
    image: node:20-alpine
    container_name: atlantic_frontend_dev
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_API_BASE_URL=http://localhost:5000
    ports:
      - "5173:5173"
      - "5174:5174"
    command: npm run dev -- --host
```

### Ejecutar en Desarrollo

```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

## Comandos Docker Útiles

### Gestión de Contenedores

| Comando | Descripción |
|---------|-------------|
| `docker build -t nombre .` | Construir imagen |
| `docker run -p 5173:80 nombre` | Ejecutar contenedor |
| `docker-compose up -d` | Levantar servicios |
| `docker-compose down` | Detener servicios |
| `docker-compose restart` | Reiniciar servicios |

### Logs y Monitoreo

| Comando | Descripción |
|---------|-------------|
| `docker logs -f nombre` | Ver logs en tiempo real |
| `docker-compose logs -f` | Logs de compose |
| `docker-compose ps` | Estado de contenedores |
| `docker exec -it nombre sh` | Entrar al contenedor |

### Limpieza

```bash
# Eliminar contenedores detenidos
docker container prune -f

# Eliminar imágenes sin usar
docker image prune -f

# Eliminar volúmenes
docker volume prune -f

# Limpieza completa
docker system prune -af
```

---

## Acceso a los Servicios

### Puerto por Defecto

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend Dev | http://localhost:5173 | Desarrollo |
| Frontend Prod | http://localhost:80 | Producción |

---

## Troubleshooting

### Error: "Port is already allocated"

```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :5173

# Usar otro puerto
docker run -p 5174:80 nombre
```

### Error de Build

```bash
# Ver logs de build
docker build -t nombre . 2>&1

# Build sin caché
docker build --no-cache -t nombre .
```

### Error de Permisos (Linux/Mac)

```bash
# Agregar usuario actual al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar
newgrp docker
```

### Contenedor se Detiene Inmediatamente

```bash
# Ver logs del contenedor
docker logs nombre

# Ver proceso en ejecución
docker ps -a

# Ejecutar en modo interactivo
docker run -it nombre sh
```

---

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL del Backend API | http://localhost:5000 |
| `VITE_APP_TITLE` | Título de la aplicación | Atlantic Orders |

### Ejemplo de Uso

```dockerfile
# Dockerfile
ENV VITE_API_BASE_URL=http://backend:5000
```

```yaml
# docker-compose.yml
environment:
  - VITE_API_BASE_URL=http://api:5000
```

---

## Integración con Traefik (Opcional)

Para usar Traefik como reverse proxy:

```yaml
# docker-compose.yml con Traefik
services:
  frontend:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host:atlantic.app"
      - "traefik.http.routers.frontend.tls=true"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
```

---

## Buenas Prácticas

1. **Usar .dockerignore:** Excluir node_modules, dist, etc.
2. **Multi-stage builds:** Imagen final pequeña (Alpine)
3. **No ejecutar como root:** Usar usuario no root
4. **Health checks:** Verificar que la app está lista
5. **Exponer solo puertos necesarios:**80 para HTTP, 443 para HTTPS

### Ejemplo .dockerignore

```
node_modules
dist
.git
.gitignore
README.md
.env
.env.local
*.log
npm-debug.log*
.DS_Store
```

---

## Siguientes Pasos

1. **Probar localmente:** `docker-compose up -d`
2. **Configurar SSL:** Usar Let's Encrypt o certificados propios
3. **Configurar CI/CD:** GitHub Actions para build automático
4. **Monitoreo:** Agregar logs centralizados

---

## Comparación: Local vs Docker

| Aspecto | Desarrollo Local | Docker |
|---------|------------------|--------|
| Instalación | npm install | docker build |
| Ejecución | npm run dev | docker run |
| Puerto | 5173 | 5173 |
| Archivos | Editables | Solo lectura (mount) |
| Dependencias | node_modules local | En imagen |

---

**Última actualización:** Marzo 2026
**Versión:** 1.0.0
