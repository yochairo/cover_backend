import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../entities/reserva.entity';
import { ReservaCliente } from '../entities/reserva-cliente.entity';
import { Mesa } from '../entities/mesa.entity';
import { Cliente } from '../entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, ReservaCliente, Mesa, Cliente]),
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
