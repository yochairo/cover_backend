import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';

@Entity('horarios_discoteca')
export class HorarioDiscoteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.horarios)
  @JoinColumn({ name: 'discoteca_id' })
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
