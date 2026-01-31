import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Mesa } from './mesa.entity';
import { Promocion } from './promocion.entity';
import { Pago } from './pago.entity';
import { ReservaCliente } from './reserva-cliente.entity';
import { DetalleReserva } from './detalle-reserva.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_organizador_id', type: 'integer' })
  cliente_organizador_id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.reservas)
  @JoinColumn({ name: 'cliente_organizador_id' })
  cliente_organizador: Cliente;

  @Column({ name: 'mesa_id', type: 'integer', nullable: true })
  mesa_id: number;

  @ManyToOne(() => Mesa, (mesa) => mesa.reservas, { nullable: true })
  @JoinColumn({ name: 'mesa_id' })
  mesa: Mesa;

  @Column({ name: 'promocion_id', type: 'integer', nullable: true })
  promocion_id: number;

  @ManyToOne(() => Promocion, (promocion) => promocion.reservas, {
    nullable: true,
  })
  @JoinColumn({ name: 'promocion_id' })
  promocion: Promocion;

  @Column({ type: 'timestamp', nullable: true })
  fecha_reserva: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_total: number;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualizado_en: Date;

  @OneToMany(() => Pago, (pago) => pago.reserva)
  pagos: Pago[];

  @OneToMany(() => ReservaCliente, (reservaCliente) => reservaCliente.reserva)
  reservas_clientes: ReservaCliente[];

  @OneToOne(() => DetalleReserva, (detalle) => detalle.reserva)
  detalle: DetalleReserva;
}
