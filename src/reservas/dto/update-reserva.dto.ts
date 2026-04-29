import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';

export class UpdateReservaDto {
  @IsOptional()
  @IsInt()
  mesa_id?: number;

  @IsOptional()
  @IsInt()
  promocion_id?: number;

  @IsOptional()
  @IsDateString()
  fecha_reserva?: string;

  @IsOptional()
  @IsString()
  hora_reserva?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  num_personas?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsInt()
  cupon_id?: number;

  @IsOptional()
  @IsString()
  estado?: string;
}
