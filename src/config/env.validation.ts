/**
 * Validación de variables de entorno al boot. Si falta o es débil
 * cualquier secreto crítico, el servidor no arranca — preferimos crash
 * temprano y visible a un fallback inseguro.
 *
 * Se inyecta como `validate` en `ConfigModule.forRoot()`.
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const errors: string[] = [];

  const required = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
  ];

  for (const key of required) {
    const value = config[key];
    if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`${key} es obligatorio`);
    }
  }

  const secret = typeof config.JWT_SECRET === 'string' ? config.JWT_SECRET : '';
  if (secret && secret.length < 32) {
    errors.push('JWT_SECRET debe tener al menos 32 caracteres');
  }

  if (errors.length > 0) {
    throw new Error(
      `Configuración inválida:\n  - ${errors.join('\n  - ')}`,
    );
  }

  return config;
}
