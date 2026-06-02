import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';
import { Colectivo } from './colectivo.entity';
import { EventoRelacionador } from './evento-relacionador.entity';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'local_id', type: 'integer', nullable: true })
  local_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.eventos)
  @JoinColumn({ name: 'local_id' })
  discoteca: Discoteca;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_evento: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualizado_en: Date;

  @Column({ type: 'text', nullable: true })
  imagen_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_entrada: number;

  // Nuevos campos para colectivos
  @Column({ name: 'colectivos_id', type: 'integer', nullable: true })
  colectivos_id: number;

  @ManyToOne(() => Colectivo, (colectivo) => colectivo.eventos)
  @JoinColumn({ name: 'colectivos_id' })
  colectivo: Colectivo;

  @Column({ type: 'varchar', nullable: true, unique: true })
  slug: string;

  @Column({ type: 'integer', nullable: true })
  aforo_maximo: number;

  @Column({ type: 'varchar', nullable: true })
  organizador_principal: string;

  // Relación con relacionadores
  @OneToMany(() => EventoRelacionador, (er) => er.evento)
  evento_relacionadores: EventoRelacionador[];
}
