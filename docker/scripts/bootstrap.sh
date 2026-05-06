#!/usr/bin/env bash
# Bootstrap del stack:
#  1) Genera certs autofirmados si no existen
#  2) Crea el .env del docker-compose con creds aleatorias (MinIO, bouncer key)
#  3) Levanta el stack
#  4) Inicializa los buckets en MinIO y registra el bouncer en CrowdSec
#
# Idempotente: corre las veces que quieras.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"

bash "$ROOT/scripts/gen-certs.sh"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[bootstrap] Generando $ENV_FILE con creds aleatorias..."
  cat > "$ENV_FILE" <<EOF
# Generado automáticamente por scripts/bootstrap.sh
GID=$(id -g)

# MinIO root
MINIO_ROOT_USER=cover-admin
MINIO_ROOT_PASSWORD=$(openssl rand -hex 24)

# Access key/secret que usa el backend (creado por este script en MinIO)
S3_ACCESS_KEY=cover-backend
S3_SECRET_KEY=$(openssl rand -hex 24)

# CrowdSec local API key del bouncer (la registramos en el engine después)
BOUNCER_KEY_TRAEFIK=$(openssl rand -hex 32)
EOF
  chmod 600 "$ENV_FILE"
else
  echo "[bootstrap] $ENV_FILE ya existe, no se regenera."
fi

echo "[bootstrap] docker compose up -d"
cd "$ROOT"
docker compose --env-file .env up -d

echo "[bootstrap] Esperando MinIO healthy..."
for i in {1..30}; do
  state=$(docker inspect -f '{{.State.Health.Status}}' cover_minio 2>/dev/null || echo "starting")
  [[ "$state" == "healthy" ]] && break
  sleep 2
done

echo "[bootstrap] Configurando MinIO (alias, buckets, user de servicio)..."
# Lee creds del .env
. "$ENV_FILE"
docker exec cover_minio mc alias set local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null
docker exec cover_minio mc mb -p local/covers-public  || true
docker exec cover_minio mc mb -p local/covers-private || true
docker exec cover_minio mc anonymous set download local/covers-public || true
docker exec cover_minio mc admin user add local "$S3_ACCESS_KEY" "$S3_SECRET_KEY" || true
docker exec cover_minio mc admin policy attach local readwrite --user "$S3_ACCESS_KEY" || true

echo "[bootstrap] Registrando bouncer en CrowdSec..."
# Si ya existe lo borramos antes para que la key del .env sea efectiva.
docker exec cover_crowdsec cscli bouncers delete traefik-bouncer 2>/dev/null || true
docker exec cover_crowdsec cscli bouncers add traefik-bouncer --key "$BOUNCER_KEY_TRAEFIK" || true

echo "[bootstrap] Escribiendo bouncer key como secret para el plugin de Traefik..."
mkdir -p "$ROOT/traefik/secrets"
printf '%s' "$BOUNCER_KEY_TRAEFIK" > "$ROOT/traefik/secrets/lapi-key"
chmod 600 "$ROOT/traefik/secrets/lapi-key"

echo "[bootstrap] Reiniciando Traefik para que tome el bouncer key..."
docker restart cover_traefik >/dev/null

echo
echo "[bootstrap] LISTO"
echo "  HTTPS Traefik       : https://api.cover.local:8443"
echo "  MinIO Console (web) : https://minio.cover.local:8443  (o http://127.0.0.1:9101 directo)"
echo "  S3 API              : https://s3.cover.local:8443"
echo "  Traefik dashboard   : https://traefik.cover.local:8443  (o http://127.0.0.1:8481)"
echo
echo "Añade en /etc/hosts (o C:\\Windows\\System32\\drivers\\etc\\hosts):"
echo "  <IP_DEL_HOST>  api.cover.local s3.cover.local minio.cover.local traefik.cover.local"
