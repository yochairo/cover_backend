import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Personal } from './personal.entity';
import { Discoteca } from './discoteca.entity';

@Entity('personal_discotecas')
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

  @Column({ name: 'discoteca_id', type: 'integer' })
  discoteca_id: number;

  @ManyToOne(() => Discoteca, (discoteca) => discoteca.personal_discotecas, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discoteca_id' })
  discoteca: Discoteca;

  @Column({ type: 'varchar', length: 50 })
  rol_personal: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;
}
