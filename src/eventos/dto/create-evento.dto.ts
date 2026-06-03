import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateEventoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  tipo_evento?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_entrada?: number;

  @IsOptional()
  @IsInt()
  local_id?: number;

  @IsOptional()
  @IsInt()
  colectivos_id?: number;

  @IsOptional()
  @IsInt()
  aforo_maximo?: number;

  @IsOptional()
  @IsString()
  organizador_principal?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
