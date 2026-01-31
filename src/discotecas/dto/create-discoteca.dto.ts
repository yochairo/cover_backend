import { IsString, IsNotEmpty, IsOptional, IsInt, IsEmail, Min } from 'class-validator';

export class CreateDiscotecaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

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
}
