import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateMesaDto {
  @IsInt()
  @IsNotEmpty()
  discoteca_id: number;

  @IsInt()
  @IsNotEmpty()
  categoria_id: number;

  @IsString()
  @IsNotEmpty()
  numero_mesa: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  capacidad: number;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  @IsIn(['libre', 'reservada', 'ocupada', 'mantenimiento'])
  estado?: string;

  @IsOptional()
  @IsInt()
  zona_id?: number;

  @IsOptional()
  @IsNumber()
  pos_x?: number;

  @IsOptional()
  @IsNumber()
  pos_y?: number;

  @IsOptional()
  @IsString()
  @IsIn(['circular', 'rectangular', 'cuadrada'])
  forma?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ancho?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  alto?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_reserva?: number;
}
