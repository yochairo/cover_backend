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

  @OneToMany(() => Reserva, (reserva) => reserva.mesa)
  reservas: Reserva[];
}
