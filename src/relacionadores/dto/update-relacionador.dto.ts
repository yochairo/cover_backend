import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateRelacionadorDto {
  @IsString()
  @IsOptional()
  estado?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  comision_defecto?: number;
}
