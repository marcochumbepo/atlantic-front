#!/bin/bash
# entrypoint.sh - Script para inyectar variables de entorno en tiempo de ejecución

set -e

# Crear directorio temporal para archivos generados
mkdir -p /tmp/app-config

# Si existen variables de entorno, inyectarlas en los scripts
if [ ! -z "$BACKEND_URL" ]; then
    echo "Configurando BACKEND_URL: $BACKEND_URL"
    # Crear archivo de configuración que será inyectado
    cat > /tmp/app-config/env.js << EOF
window.__RUNTIME_CONFIG__ = {
  BACKEND_URL: '$BACKEND_URL',
  NODE_ENV: '${NODE_ENV:-production}',
  API_BASE_URL: '${VITE_API_BASE_URL:-'$BACKEND_URL'}'
};
EOF
fi

# Iniciar nginx
echo "Iniciando Nginx..."
exec nginx -g "daemon off;"
