import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class SolicitarVerificacionDto {
  @IsString()
  @IsNotEmpty()
  numero_carnet: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_nacimiento_carnet: string;
}
