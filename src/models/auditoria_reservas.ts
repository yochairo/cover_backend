import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface auditoria_reservasAttributes {
  id: number;
  reserva_id: number;
  operacion: string;
  estado_anterior?: object;
  estado_nuevo?: object;
  fecha_auditoria?: Date;
  usuario?: string;
}

export type auditoria_reservasPk = "id";
export type auditoria_reservasId = auditoria_reservas[auditoria_reservasPk];
export type auditoria_reservasOptionalAttributes = "id" | "estado_anterior" | "estado_nuevo" | "fecha_auditoria" | "usuario";
export type auditoria_reservasCreationAttributes = Optional<auditoria_reservasAttributes, auditoria_reservasOptionalAttributes>;

export class auditoria_reservas extends Model<auditoria_reservasAttributes, auditoria_reservasCreationAttributes> implements auditoria_reservasAttributes {
  id!: number;
  reserva_id!: number;
  operacion!: string;
  estado_anterior?: object;
  estado_nuevo?: object;
  fecha_auditoria?: Date;
  usuario?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof auditoria_reservas {
    return auditoria_reservas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    operacion: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    estado_anterior: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    estado_nuevo: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    fecha_auditoria: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'auditoria_reservas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "auditoria_reservas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
