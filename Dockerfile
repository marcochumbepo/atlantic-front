# ============================================
# Stage 1: Build
# ============================================
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM nginx:alpine

# Información de la imagen
LABEL maintainer="your-email@example.com"
LABEL version="1.0.0"
LABEL description="Atlantic - Sistema de Gestión de Pedidos - React SPA"

# Instalar wget para health checks
RUN apk add --no-cache wget bash

# Crear usuario no-root para nginx
RUN addgroup -g 1001 -S app && \
    adduser -S appuser -u 1001

# Copiar script de entrada
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copiar la aplicación compilada desde el stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear directorio para logs con permisos correctos
RUN mkdir -p /var/log/nginx && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log && \
    chown -R appuser:app /var/log/nginx && \
    chown -R appuser:app /usr/share/nginx/html && \
    chown -R appuser:app /var/cache/nginx && \
    chown -R appuser:app /var/run

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Usar usuario no-root
USER appuser

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
