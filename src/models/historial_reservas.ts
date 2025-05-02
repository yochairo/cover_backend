import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { reservas, reservasId } from './reservas';

export interface historial_reservasAttributes {
  id: number;
  reserva_id: number;
  cliente_id: number;
  'acción'?: string;
  detalles?: string;
  fecha_accion?: Date;
}

export type historial_reservasPk = "id";
export type historial_reservasId = historial_reservas[historial_reservasPk];
export type historial_reservasOptionalAttributes = "id" | "acción" | "detalles" | "fecha_accion";
export type historial_reservasCreationAttributes = Optional<historial_reservasAttributes, historial_reservasOptionalAttributes>;

export class historial_reservas extends Model<historial_reservasAttributes, historial_reservasCreationAttributes> implements historial_reservasAttributes {
  id!: number;
  reserva_id!: number;
  cliente_id!: number;
  'acción'?: string;
  detalles?: string;
  fecha_accion?: Date;

  // historial_reservas belongsTo clientes via cliente_id
  cliente!: clientes;
  getCliente!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setCliente!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createCliente!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // historial_reservas belongsTo reservas via reserva_id
  reserva!: reservas;
  getReserva!: Sequelize.BelongsToGetAssociationMixin<reservas>;
  setReserva!: Sequelize.BelongsToSetAssociationMixin<reservas, reservasId>;
  createReserva!: Sequelize.BelongsToCreateAssociationMixin<reservas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof historial_reservas {
    return historial_reservas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservas',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    'acción': {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    detalles: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_accion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'historial_reservas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "historial_reservas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
