import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Discoteca } from './discoteca.entity';
import { CategoriaMenu } from './categoria-menu.entity';

@Entity('items_menu')
export class ItemMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.items_menu)
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ name: 'categoria_menu_id', type: 'integer' })
  categoria_menu_id: number;

  @ManyToOne(() => CategoriaMenu, (categoria) => categoria.items)
  @JoinColumn({ name: 'categoria_menu_id' })
  categoria_menu: CategoriaMenu;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', default: 'bebida' })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'text', nullable: true })
  foto_url: string;

  @Column({ type: 'boolean', default: true })
  disponible: boolean;

  @Column({ type: 'boolean', default: false })
  destacado: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  actualizado_en: Date;
}
