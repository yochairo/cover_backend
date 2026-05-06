import { IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';

/**
 * Solo expone los campos que un cliente o personal autorizado puede tocar
 * en un PUT /reservas/:id. `estado`, `precio_total`, `descuento_aplicado`,
 * `cliente_organizador_id`, fechas de auditoría, etc. se mutan únicamente
 * por endpoints específicos (/confirmar, /completar, /cancelar) — nunca
 * por un body genérico, lo que evitaba escalada y mutaciones inesperadas.
 */
export class UpdateReservaDto {
  @IsOptional()
  @IsInt()
  mesa_id?: number;

  @IsOptional()
  @IsDateString()
  fecha_reserva?: string;

  @IsOptional()
  @IsString()
  hora_reserva?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  num_personas?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
