import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Evento } from './evento.entity';
import { PersonalColectivo } from './personal-colectivo.entity';

@Entity('colectivos')
export class Colectivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  correo_contacto: string;

  @Column({ type: 'text', nullable: true })
  logo_url: string;

  @Column({ type: 'boolean', default: false })
  verificado: boolean;

  @Column({ type: 'varchar', nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_verificacion: Date;

  @Column({ type: 'varchar', nullable: true, unique: true })
  slug: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relaciones
  @OneToMany(() => Evento, (evento) => evento.colectivo)
  eventos: Evento[];

  @OneToMany(() => PersonalColectivo, (pc) => pc.colectivo)
  personal_colectivo: PersonalColectivo[];
}
