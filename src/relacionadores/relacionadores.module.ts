import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelacionadoresController } from './relacionadores.controller';
import { RelacionadoresService } from './relacionadores.service';
import { Relacionador } from '../entities/relacionador.entity';
import { Persona } from '../entities/persona.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Relacionador, Persona]),
    AuthModule,
  ],
  controllers: [RelacionadoresController],
  providers: [RelacionadoresService],
  exports: [RelacionadoresService],
})
export class RelacionadoresModule {}
