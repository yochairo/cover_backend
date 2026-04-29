import {
  IsInt,
  IsString,
  IsOptional,
  Min,
  IsNumber,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class UpdateMesaDto {
  @IsOptional()
  @IsInt()
  discoteca_id?: number;

  @IsOptional()
  @IsInt()
  categoria_id?: number;

  @IsOptional()
  @IsString()
  numero_mesa?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacidad?: number;

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

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
