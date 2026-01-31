import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscotecasController } from './discotecas.controller';
import { DiscotecasService } from './discotecas.service';
import { Discoteca } from '../entities/discoteca.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discoteca]), AuthModule],
  controllers: [DiscotecasController],
  providers: [DiscotecasService],
  exports: [DiscotecasService],
})
export class DiscotecasModule {}
