import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Mesa } from './mesa.entity';
import { Entrada } from './entrada.entity';
import { Promocion } from './promocion.entity';
import { Anuncio } from './anuncio.entity';
import { PersonalDiscoteca } from './personal-discoteca.entity';
import { CategoriaMenu } from './categoria-menu.entity';
import { ItemMenu } from './item-menu.entity';
import { FotoDiscoteca } from './foto-discoteca.entity';
import { HorarioDiscoteca } from './horario-discoteca.entity';
import { ZonaDiscoteca } from './zona-discoteca.entity';

@Entity('discotecas')
export class Discoteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo_contacto: string;

  @Column({ type: 'integer', nullable: true })
  capacidad_total: number;

  @Column({ type: 'time', nullable: true })
  horario_apertura: string;

  @Column({ type: 'time', nullable: true })
  horario_cierre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualizado_en: Date;

  @Column({ type: 'varchar', default: 'bar', nullable: true })
  tipo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  zona_barrio: string;

  @Column({ type: 'varchar', default: 'La Paz', nullable: true })
  ciudad: string;

  @Column({ type: 'varchar', nullable: true })
  referencia: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_minimo_mesa: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_mesa_vip: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0, nullable: true })
  rating_promedio: number;

  @Column({ type: 'integer', default: 0, nullable: true })
  total_resenas: number;

  @Column({ type: 'text', nullable: true })
  logo_url: string;

  @Column({ type: 'boolean', default: false })
  verificado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_verificacion: Date;

  @OneToMany(() => Evento, (evento) => evento.discoteca)
  eventos: Evento[];

  @OneToMany(() => Mesa, (mesa) => mesa.discoteca)
  mesas: Mesa[];

  @OneToMany(() => Entrada, (entrada) => entrada.discoteca)
  entradas: Entrada[];

  @OneToMany(() => Promocion, (promocion) => promocion.discoteca)
  promociones: Promocion[];

  @OneToMany(() => Anuncio, (anuncio) => anuncio.discoteca)
  anuncios: Anuncio[];

  @OneToMany(
    () => PersonalDiscoteca,
    (personalDiscoteca) => personalDiscoteca.discoteca,
  )
  personal_discotecas: PersonalDiscoteca[];

  @OneToMany(() => CategoriaMenu, (categoriaMenu) => categoriaMenu.discoteca)
  categorias_menu: CategoriaMenu[];

  @OneToMany(() => ItemMenu, (itemMenu) => itemMenu.discoteca)
  items_menu: ItemMenu[];

  @OneToMany(() => FotoDiscoteca, (foto) => foto.discoteca)
  fotos: FotoDiscoteca[];

  @OneToMany(() => HorarioDiscoteca, (horario) => horario.discoteca)
  horarios: HorarioDiscoteca[];

  @OneToMany(() => ZonaDiscoteca, (zona) => zona.discoteca)
  zonas: ZonaDiscoteca[];
}
