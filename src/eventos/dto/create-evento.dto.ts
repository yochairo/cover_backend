import { IsString, IsInt, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @Type(() => Date)
  @IsDate()
  fecha_hora_inicio: Date;

  @Type(() => Date)
  @IsDate()
  fecha_hora_fin: Date;

  @IsInt()
  discoteca_id: number;

  @IsOptional()
  @IsString()
  tipo_evento?: string;

  @IsOptional()
  @IsInt()
  edad_minima?: number;

  @IsOptional()
  @IsString()
  codigo_vestimenta?: string;

  @IsOptional()
  @IsBoolean()
  entrada_gratuita?: boolean;

  @IsOptional()
  @IsInt()
  capacidad_maxima?: number;

  @IsOptional()
  @IsString()
  estado?: string;
}