import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateCategoriasMesaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio_base?: number;
}
