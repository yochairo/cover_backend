import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';
import { Reserva } from './reserva.entity';

@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.promociones)
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ type: 'varchar', length: 30, nullable: true })
  codigo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  descuento_porcentaje: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  descuento_fijo: number;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @OneToMany(() => Reserva, (reserva) => reserva.promocion)
  reservas: Reserva[];
}
