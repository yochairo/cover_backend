import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity('detalles_reserva')
export class DetalleReserva {
  @PrimaryColumn({ name: 'reserva_id' })
  reserva_id: number;

  @OneToOne(() => Reserva, (reserva) => reserva.detalle)
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivado: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nota: string;
}
