import {
  IsString,
  IsInt,
  IsDate,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha_hora_inicio?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha_hora_fin?: Date;

  @IsOptional()
  @IsInt()
  discoteca_id?: number;

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

  @IsOptional()
  @IsString()
  @IsUrl()
  imagen_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_entrada?: number;
}