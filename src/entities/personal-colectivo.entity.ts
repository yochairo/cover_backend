import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Colectivo } from './colectivo.entity';

/**
 * Miembros internos de un colectivo.
 * NO son necesariamente usuarios de la app (no tienen persona_id).
 * Son el equipo/directorio de contactos del colectivo.
 */
@Entity('personal_colectivo')
export class PersonalColectivo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'colectivo_id', type: 'bigint' })
  colectivo_id: number;

  @ManyToOne(() => Colectivo, (colectivo) => colectivo.personal_colectivo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'colectivo_id' })
  colectivo: Colectivo;

  @Column({ type: 'varchar' })
  nombres: string;

  @Column({ type: 'varchar' })
  apellidos: string;

  @Column({ type: 'varchar', nullable: true })
  cargo: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'varchar', nullable: true })
  rol_asignado: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
