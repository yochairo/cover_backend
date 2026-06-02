import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Personal } from './personal.entity';
import { Discoteca } from './discoteca.entity';

@Entity('local_administrador')
export class PersonalDiscoteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'personal_id', type: 'integer' })
  personal_id: number;

  @ManyToOne(() => Personal, (personal) => personal.personal_discotecas, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'personal_id' })
  personal: Personal;

  @Column({ name: 'local_id', type: 'integer' })
  local_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.personal_discotecas, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'local_id' })
  discoteca: Discoteca;

  @Column({ type: 'varchar', length: 50 })
  rol_personal: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;
}
