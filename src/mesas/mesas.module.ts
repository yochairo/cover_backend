import { Module } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from '../entities/mesa.entity';
import { CategoriaMesa } from '../entities/categoria-mesa.entity';
import { Discoteca } from '../entities/discoteca.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mesa, CategoriaMesa, Discoteca]),
  ],
  controllers: [MesasController],
  providers: [MesasService],
  exports: [MesasService],
})
export class MesasModule {}
