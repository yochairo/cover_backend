import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Persona } from './persona.entity';
import { Entrada } from './entrada.entity';
import { Pago } from './pago.entity';
import { Reserva } from './reserva.entity';
import { ReservaCliente } from './reserva-cliente.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'persona_id', type: 'integer' })
  persona_id: number;

  @ManyToOne(() => Persona, (persona) => persona.clientes)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column({ type: 'varchar', length: 255, nullable: true })
  preferencia: string;

  @Column({ type: 'timestamp', name: 'fecha_registro', nullable: true })
  fecha_registro: Date;

  @Column({ type: 'timestamp', name: 'ultima_reserva', nullable: true })
  ultima_reserva: Date;

  @OneToMany(() => Entrada, (entrada) => entrada.cliente)
  entradas: Entrada[];

  @OneToMany(() => Pago, (pago) => pago.cliente)
  pagos: Pago[];

  @OneToMany(() => Reserva, (reserva) => reserva.cliente_organizador)
  reservas: Reserva[];

  @OneToMany(() => ReservaCliente, (reservaCliente) => reservaCliente.cliente)
  reservas_clientes: ReservaCliente[];
}
