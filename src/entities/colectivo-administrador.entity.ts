import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Personal } from './personal.entity';
import { Colectivo } from './colectivo.entity';

@Entity('colectivo_administrador')
export class ColectivoAdministrador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'personal_id', type: 'integer', nullable: false })
  personal_id: number;

  @Column({ name: 'colectivo_id', type: 'integer', nullable: false })
  colectivo_id: number;

  @Column({ name: 'rol_personal', type: 'varchar', nullable: false })
  rol_personal: string;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp without time zone' })
  creado_en: Date;

  // Relaciones
  @ManyToOne(() => Personal)
  @JoinColumn({ name: 'personal_id' })
  personal: Personal;

  @ManyToOne(() => Colectivo)
  @JoinColumn({ name: 'colectivo_id' })
  colectivo: Colectivo;
}
