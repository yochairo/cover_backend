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
}
