import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Pago } from './pago.entity';

@Entity('metodos_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true })
  creado_en: Date;

  @Column({ type: 'varchar', nullable: true })
  tipo: string;

  @Column({ type: 'text', nullable: true })
  icono_url: string;

  @OneToMany(() => Pago, (pago) => pago.metodo_pago)
  pagos: Pago[];
}
