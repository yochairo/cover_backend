import {
  IsString,
  IsOptional,
  IsInt,
  IsEmail,
  Min,
  IsIn,
  Max,
  IsNumber,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class UpdateDiscotecaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  correo_contacto?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  capacidad_total?: number;

  @IsString()
  @IsOptional()
  horario_apertura?: string;

  @IsString()
  @IsOptional()
  horario_cierre?: string;

  @IsString()
  @IsIn(['activo', 'inactivo', 'eliminado'])
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  zona_barrio?: string;

  @IsString()
  @IsOptional()
  ciudad?: string;

  @IsString()
  @IsOptional()
  referencia?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitud?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitud?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precio_minimo_mesa?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precio_mesa_vip?: number;

  @IsString()
  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @IsBoolean()
  @IsOptional()
  verificado?: boolean;
}
