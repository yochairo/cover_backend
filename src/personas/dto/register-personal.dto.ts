import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterPersonalDto {
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
  nombre_completo: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  carnet?: string;
}
