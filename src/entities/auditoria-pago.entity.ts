import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('auditoria_pagos')
export class AuditoriaPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pago_id', type: 'integer' })
  pago_id: number;

  @Column({ type: 'varchar', length: 10 })
  operacion: string;

  @Column({ type: 'jsonb', nullable: true })
  estado_anterior: object;

  @Column({ type: 'jsonb', nullable: true })
  estado_nuevo: object;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_auditoria: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  usuario: string;
}
