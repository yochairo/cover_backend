/**
 * Payload firmado dentro del JWT.
 *
 * - userId: id de la entidad `personas` (siempre)
 * - rol: 'cliente' | 'personal' | 'admin'
 * - clienteId: id en tabla `clientes`, presente solo para rol 'cliente'
 * - personalId: id en tabla `personal`, presente para 'personal' y 'admin'
 */
export interface JwtPayload {
  userId: number;
  rol: string;
  clienteId?: number;
  personalId?: number;
}

/**
 * Lo que se inyecta en `req.user` después de pasar por la estrategia JWT.
 * Idéntico al payload — se mantiene como tipo separado por claridad semántica.
 */
export type AuthenticatedUser = JwtPayload;
