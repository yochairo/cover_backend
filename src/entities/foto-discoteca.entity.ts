import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';

@Entity('fotos_local')
export class FotoDiscoteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'local_id', type: 'bigint' })
  local_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.fotos)
  @JoinColumn({ name: 'local_id' })
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
