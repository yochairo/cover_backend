import {
  IsString,
  IsInt,
  IsDate,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha_inicio?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fecha_fin?: Date;

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

  @IsOptional()
  @IsString()
  imagen_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_entrada?: number;
}