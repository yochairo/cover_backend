import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColectivosController } from './colectivos.controller';
import { ColectivosService } from './colectivos.service';
import { Colectivo } from '../entities/colectivo.entity';
import { ColectivoAdministrador } from '../entities/colectivo-administrador.entity';
import { Personal } from '../entities/personal.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Colectivo, ColectivoAdministrador, Personal]),
    AuthModule,
  ],
  controllers: [ColectivosController],
  providers: [ColectivosService],
  exports: [ColectivosService],
})
export class ColectivosModule {}
