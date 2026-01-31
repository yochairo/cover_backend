import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Entrada } from './entrada.entity';

@Entity('categorias_entradas')
export class CategoriaEntrada {
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

  @OneToMany(() => Entrada, (entrada) => entrada.categoria)
  entradas: Entrada[];
}
