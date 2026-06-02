import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateColectivoDto } from './create-colectivo.dto';

export class UpdateColectivoDto extends PartialType(CreateColectivoDto) {
  @IsBoolean()
  @IsOptional()
  verificado?: boolean;

  @IsString()
  @IsOptional()
  estado?: string;
}
