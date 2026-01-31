import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Personal } from './personal.entity';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nombre_usuario: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contrasena: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre_completo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  carnet: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  rol: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualizado_en: Date;

  @OneToMany(() => Cliente, (cliente) => cliente.persona)
  clientes: Cliente[];

  @OneToMany(() => Personal, (personal) => personal.persona)
  personals: Personal[];
}
