import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterColectivoDto {
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  nombre_colectivo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  nombre_completo?: string;
}
