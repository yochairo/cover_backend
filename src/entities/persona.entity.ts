import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Cliente } from './cliente.entity';
import { Personal } from './personal.entity';
import { VerificacionIdentidad } from './verificacion-identidad.entity';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nombre_usuario: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo: string;

  // Excluido de toda respuesta JSON gracias al ClassSerializerInterceptor
  // global. Nunca debe filtrarse al cliente.
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  contrasena_hash: string;

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

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'text', nullable: true })
  foto_perfil_url: string;

  @Column({ type: 'timestamp', nullable: true })
  ultimo_login: Date;

  @OneToMany(() => Cliente, (cliente) => cliente.persona)
  clientes: Cliente[];

  @OneToMany(() => Personal, (personal) => personal.persona)
  personals: Personal[];

  @OneToOne(
    () => VerificacionIdentidad,
    (verificacion) => verificacion.persona,
  )
  verificacion: VerificacionIdentidad;
}
