import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Persona } from './persona.entity';
import { EventoRelacionador } from './evento-relacionador.entity';

@Entity('relacionadores')
export class Relacionador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'persona_id', type: 'integer' })
  persona_id: number;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column({ type: 'varchar', unique: true, nullable: false })
  codigo_referencia: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  comision_defecto: number;

  @Column({ type: 'boolean', default: false })
  verificado: boolean;

  @Column({ type: 'varchar', nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_registro: Date;

  @Column({ type: 'timestamp', nullable: true })
  ultima_reserva: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relaciones
  @OneToMany(() => EventoRelacionador, (er) => er.relacionador)
  evento_relacionadores: EventoRelacionador[];
}
