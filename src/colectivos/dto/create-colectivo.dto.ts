import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateColectivoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  correo_contacto?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;
}
