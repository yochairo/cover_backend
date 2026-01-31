import { IsString, IsOptional, IsInt, IsEmail, Min, IsIn } from 'class-validator';

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
}
