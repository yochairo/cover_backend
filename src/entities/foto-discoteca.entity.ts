import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';

@Entity('fotos_discoteca')
export class FotoDiscoteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.fotos)
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ type: 'text' })
  url_imagen: string;

  @Column({ type: 'varchar', default: 'galeria' })
  tipo: string;

  @Column({ type: 'varchar', nullable: true })
  titulo: string;

  @Column({ type: 'integer', default: 0 })
  orden: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;
}
