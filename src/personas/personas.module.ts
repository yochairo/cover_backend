import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasController } from './personas.controller';
import { PersonasService } from './personas.service';
import { Persona } from '../entities/persona.entity';
import { Cliente } from '../entities/cliente.entity';
import { Personal } from '../entities/personal.entity';
import { Colectivo } from '../entities/colectivo.entity';
import { ColectivoAdministrador } from '../entities/colectivo-administrador.entity';
import { Relacionador } from '../entities/relacionador.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Persona,
      Cliente,
      Personal,
      Colectivo,
      ColectivoAdministrador,
      Relacionador,
    ]),
    AuthModule,
  ],
  controllers: [PersonasController],
  providers: [PersonasService],
  exports: [PersonasService],
})
export class PersonasModule {}
