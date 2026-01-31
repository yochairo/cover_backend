import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';
import { CategoriaEntrada } from './categoria-entrada.entity';
import { Cliente } from './cliente.entity';

@Entity('entradas')
export class Entrada {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.entradas)
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ name: 'categoria_id', type: 'integer' })
  categoria_id: number;

  @ManyToOne(() => CategoriaEntrada, (categoria) => categoria.entradas)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaEntrada;

  @Column({ type: 'varchar', length: 50 })
  tipo_entrada: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'boolean', default: true })
  disponible: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_disponible: Date;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  // Relación adicional que vi en los modelos de Sequelize
  @ManyToOne(() => Cliente, (cliente) => cliente.entradas, { nullable: true })
  cliente: Cliente;
}
