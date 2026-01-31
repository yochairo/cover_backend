import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reserva } from './reserva.entity';
import { Cliente } from './cliente.entity';
import { MetodoPago } from './metodo-pago.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reserva_id', type: 'integer' })
  reserva_id: number;

  @ManyToOne(() => Reserva, (reserva) => reserva.pagos)
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @Column({ name: 'cliente_id', type: 'integer' })
  cliente_id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.pagos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'metodo_pago_id', type: 'integer' })
  metodo_pago_id: number;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.pagos)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodo_pago: MetodoPago;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_pago: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia_pago: string;
}
