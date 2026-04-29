import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  @IsNotEmpty()
  mesa_id: number;

  @IsOptional()
  @IsInt()
  promocion_id?: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_reserva: string;

  @IsOptional()
  @IsString()
  hora_reserva?: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  num_personas: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsInt()
  cupon_id?: number;
}
