import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Persona } from './persona.entity';
import { PersonalDiscoteca } from './personal-discoteca.entity';

@Entity('personal')
export class Personal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'persona_id', type: 'integer' })
  persona_id: number;

  @ManyToOne(() => Persona, (persona) => persona.personals)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_referencia: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo_contrato: string;

  @Column({ type: 'date', nullable: true })
  fecha_ingreso: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  actualizado_en: Date;

  @OneToMany(
    () => PersonalDiscoteca,
    (personalDiscoteca) => personalDiscoteca.personal,
  )
  personal_discotecas: PersonalDiscoteca[];
}
