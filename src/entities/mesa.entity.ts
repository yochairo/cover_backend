import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';
import { CategoriaMesa } from './categoria-mesa.entity';
import { Reserva } from './reserva.entity';
import { ZonaDiscoteca } from './zona-discoteca.entity';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.mesas)
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ name: 'categoria_id', type: 'integer' })
  categoria_id: number;

  @ManyToOne(() => CategoriaMesa, (categoria) => categoria.mesas)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaMesa;

  @Column({ type: 'varchar', length: 10 })
  numero_mesa: string;

  @Column({ type: 'integer' })
  capacidad: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @Column({ name: 'zona_id', type: 'integer', nullable: true })
  zona_id: number;

  @ManyToOne(() => ZonaDiscoteca, (zona) => zona.mesas, { nullable: true })
  @JoinColumn({ name: 'zona_id' })
  zona: ZonaDiscoteca;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pos_x: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pos_y: number;

  @Column({ type: 'varchar', default: 'circular', nullable: true })
  forma: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ancho: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  alto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_reserva: number;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @OneToMany(() => Reserva, (reserva) => reserva.mesa)
  reservas: Reserva[];
}
