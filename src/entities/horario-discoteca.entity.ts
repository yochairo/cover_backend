import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';

@Entity('horarios_local')
export class HorarioDiscoteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'local_id', type: 'integer' })
  local_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.horarios)
  @JoinColumn({ name: 'local_id' })
  discoteca: Discoteca;

  @Column({ type: 'varchar' })
  dia: string;

  @Column({ type: 'time' })
  hora_apertura: string;

  @Column({ type: 'time' })
  hora_cierre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
