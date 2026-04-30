import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RevisarVerificacionDto {
  @IsEnum(['aprobado', 'rechazado'])
  estado: 'aprobado' | 'rechazado';

  @IsString()
  @IsOptional()
  motivo?: string;
}
