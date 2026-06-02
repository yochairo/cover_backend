import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Relacionador } from './relacionador.entity';

@Entity('evento_relacionador')
export class EventoRelacionador {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'evento_id', type: 'bigint', nullable: true })
  evento_id: number;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'evento_id' })
  evento: Evento;

  @Column({ name: 'relacionador_id', type: 'bigint' })
  relacionador_id: number;

  @ManyToOne(() => Relacionador, (r) => r.evento_relacionadores)
  @JoinColumn({ name: 'relacionador_id' })
  relacionador: Relacionador;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  comision: number;

  @Column({ type: 'integer', nullable: true })
  cupo_invitados: number;

  @Column({ type: 'integer', nullable: true })
  cupo_entradas: number;

  @Column({ type: 'varchar', nullable: true })
  estado: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  aceptado_en: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  rechazado_en: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
