import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { metodos_pago, metodos_pagoId } from './metodos_pago';
import type { reservas, reservasId } from './reservas';

export interface pagosAttributes {
  id: number;
  reserva_id: number;
  cliente_id: number;
  metodo_pago_id: number;
  monto?: number;
  estado?: string;
  fecha_pago?: Date;
  referencia_pago?: string;
}

export type pagosPk = "id";
export type pagosId = pagos[pagosPk];
export type pagosOptionalAttributes = "id" | "monto" | "estado" | "fecha_pago" | "referencia_pago";
export type pagosCreationAttributes = Optional<pagosAttributes, pagosOptionalAttributes>;

export class pagos extends Model<pagosAttributes, pagosCreationAttributes> implements pagosAttributes {
  id!: number;
  reserva_id!: number;
  cliente_id!: number;
  metodo_pago_id!: number;
  monto?: number;
  estado?: string;
  fecha_pago?: Date;
  referencia_pago?: string;

  // pagos belongsTo clientes via cliente_id
  cliente!: clientes;
  getCliente!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setCliente!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createCliente!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // pagos belongsTo metodos_pago via metodo_pago_id
  metodo_pago!: metodos_pago;
  getMetodo_pago!: Sequelize.BelongsToGetAssociationMixin<metodos_pago>;
  setMetodo_pago!: Sequelize.BelongsToSetAssociationMixin<metodos_pago, metodos_pagoId>;
  createMetodo_pago!: Sequelize.BelongsToCreateAssociationMixin<metodos_pago>;
  // pagos belongsTo reservas via reserva_id
  reserva!: reservas;
  getReserva!: Sequelize.BelongsToGetAssociationMixin<reservas>;
  setReserva!: Sequelize.BelongsToSetAssociationMixin<reservas, reservasId>;
  createReserva!: Sequelize.BelongsToCreateAssociationMixin<reservas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof pagos {
    return pagos.init({
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
    metodo_pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'metodos_pago',
        key: 'id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true
    },
    referencia_pago: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pagos',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "pagos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
