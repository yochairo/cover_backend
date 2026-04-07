import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reserva } from './reserva.entity';
import { Cliente } from './cliente.entity';

@Entity('invitaciones_mesa')
export class InvitacionMesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reserva_id', type: 'integer' })
  reserva_id: number;

  @ManyToOne(() => Reserva, (reserva) => reserva.invitaciones)
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @Column({ name: 'invitado_id', type: 'integer' })
  invitado_id: number;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'invitado_id' })
  invitado: Cliente;

  @Column({ name: 'invitado_por', type: 'integer' })
  invitado_por: number;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'invitado_por' })
  cliente_invitador: Cliente;

  @Column({ type: 'varchar', default: 'pendiente' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @Column({ type: 'timestamp', nullable: true })
  respondida_en: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;
}
