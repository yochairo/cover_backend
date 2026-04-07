import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';
import { ItemMenu } from './item-menu.entity';

@Entity('categorias_menu')
export class CategoriaMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.categorias_menu)
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'integer', default: 0 })
  orden: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;

  @OneToMany(() => ItemMenu, (item) => item.categoria_menu)
  items: ItemMenu[];
}
