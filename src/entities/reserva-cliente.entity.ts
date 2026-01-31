import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Reserva } from './reserva.entity';

@Entity('reservas_clientes')
export class ReservaCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_id', type: 'integer' })
  cliente_id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.reservas_clientes)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'reserva_id', type: 'integer' })
  reserva_id: number;

  @ManyToOne(() => Reserva, (reserva) => reserva.reservas_clientes)
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;
}
