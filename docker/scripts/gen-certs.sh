#!/usr/bin/env bash
# Genera un certificado autofirmado para *.cover.local + cover.local.
# Lo escribe en docker/traefik/certs/, que Traefik monta como volumen read-only.
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)/traefik/certs"
mkdir -p "$DIR"

CRT="$DIR/cover.local.crt"
KEY="$DIR/cover.local.key"

if [[ -f "$CRT" && -f "$KEY" ]]; then
  echo "[gen-certs] Ya existen certificados en $DIR. Borra los .crt/.key si quieres regenerar."
  exit 0
fi

cat > "$DIR/openssl.cnf" <<'EOF'
[req]
distinguished_name = dn
prompt = no
req_extensions = v3_req

[dn]
CN = cover.local
O  = Cover (self-signed)

[v3_req]
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = cover.local
DNS.2 = *.cover.local
DNS.3 = api.cover.local
DNS.4 = s3.cover.local
DNS.5 = minio.cover.local
DNS.6 = traefik.cover.local
DNS.7 = localhost
IP.1  = 127.0.0.1
IP.2  = 10.147.18.174
EOF

openssl req -x509 -nodes -newkey rsa:2048 -days 825 \
  -keyout "$KEY" -out "$CRT" \
  -config "$DIR/openssl.cnf" -extensions v3_req

chmod 644 "$CRT"
chmod 600 "$KEY"

echo "[gen-certs] Certificado escrito en $CRT"
echo "[gen-certs] Importa $CRT en tu navegador / sistema operativo para evitar el warning de browser."
