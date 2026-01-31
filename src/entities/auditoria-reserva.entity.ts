import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('auditoria_reservas')
export class AuditoriaReserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reserva_id', type: 'integer' })
  reserva_id: number;

  @Column({ type: 'varchar', length: 10 })
  operacion: string;

  @Column({ type: 'jsonb', nullable: true })
  estado_anterior: object;

  @Column({ type: 'jsonb', nullable: true })
  estado_nuevo: object;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_auditoria: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  usuario: string;
}
