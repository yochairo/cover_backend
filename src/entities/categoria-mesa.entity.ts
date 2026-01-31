import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Mesa } from './mesa.entity';

@Entity('categorias_mesas')
export class CategoriaMesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_base: number;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @OneToMany(() => Mesa, (mesa) => mesa.categoria)
  mesas: Mesa[];
}
