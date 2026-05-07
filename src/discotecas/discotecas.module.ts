import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscotecasController } from './discotecas.controller';
import { DiscotecasService } from './discotecas.service';
import { Discoteca } from '../entities/discoteca.entity';
import { Personal } from '../entities/personal.entity';
import { PersonalDiscoteca } from '../entities/personal-discoteca.entity';
import { Mesa } from '../entities/mesa.entity';
import { CategoriaMesa } from '../entities/categoria-mesa.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discoteca, Personal, PersonalDiscoteca, Mesa, CategoriaMesa]), AuthModule],
  controllers: [DiscotecasController],
  providers: [DiscotecasService],
  exports: [DiscotecasService],
})
export class DiscotecasModule {}
