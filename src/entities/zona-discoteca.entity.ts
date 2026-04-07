import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';
import { Mesa } from './mesa.entity';

@Entity('zonas_discoteca')
export class ZonaDiscoteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.zonas)
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'integer', default: 0 })
  piso: number;

  @Column({ type: 'integer', default: 0 })
  orden: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;

  @OneToMany(() => Mesa, (mesa) => mesa.zona)
  mesas: Mesa[];
}
