import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Persona } from './persona.entity';
import { Personal } from './personal.entity';

@Entity('verificaciones_identidad')
export class VerificacionIdentidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'persona_id', type: 'integer', unique: true })
  persona_id: number;

  @OneToOne(() => Persona, (persona) => persona.verificacion)
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Column({ type: 'text' })
  foto_carnet_frontal_url: string;

  @Column({ type: 'text', nullable: true })
  foto_carnet_reverso_url: string;

  @Column({ type: 'text', nullable: true })
  foto_selfie_url: string;

  @Column({ type: 'varchar', nullable: true })
  numero_carnet: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento_carnet: Date;

  @Column({ type: 'boolean', default: false })
  es_mayor_de_edad: boolean;

  @Column({ type: 'varchar', default: 'pendiente' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  motivo_rechazo: string;

  @Column({ name: 'verificado_por', type: 'integer', nullable: true })
  verificado_por: number;

  @ManyToOne(() => Personal, { nullable: true })
  @JoinColumn({ name: 'verificado_por' })
  verificador: Personal;

  @Column({ type: 'timestamp', nullable: true })
  verificado_en: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  actualizado_en: Date;
}
