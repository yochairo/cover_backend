import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Política CORS configurable por entorno.
 *
 * Modos:
 *  - `CORS_ALLOW_ANY=true`  → acepta CUALQUIER origin. Útil en LAN/dev cuando
 *                             cualquier IP del cliente debe poder usar la API.
 *                             ⚠️ No usar en producción pública.
 *  - `CORS_ORIGINS=a,b,c`   → allowlist explícita (CSV).
 *  - sin env vars           → allowlist de localhost para dev.
 *
 * En cualquier modo, requests sin `Origin` (Postman, mobile native, server-to-server)
 * pasan siempre.
 */

const baseOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4200',
  'http://localhost:8100',
  'capacitor://localhost',
  'http://localhost',
];

const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowAny = process.env.CORS_ALLOW_ANY === 'true';

const allowedOrigins = new Set([...baseOrigins, ...extraOrigins]);

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Sin origin (Postman, apps mobile, server-to-server) → permitir.
    if (!origin) return callback(null, true);

    if (allowAny) return callback(null, true);

    if (allowedOrigins.has(origin)) return callback(null, true);

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Platform',
    'X-App-Version',
  ],
};
