import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { detalles_reserva, detalles_reservaCreationAttributes, detalles_reservaId } from './detalles_reserva';
import type { mesas, mesasId } from './mesas';
import type { pagos, pagosId } from './pagos';
import type { promociones, promocionesId } from './promociones';
import type { reservas_clientes, reservas_clientesId } from './reservas_clientes';

export interface reservasAttributes {
  id: number;
  cliente_organizador_id: number;
  mesa_id?: number;
  promocion_id?: number;
  fecha_reserva?: Date;
  estado?: string;
  precio_total?: number;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type reservasPk = "id";
export type reservasId = reservas[reservasPk];
export type reservasOptionalAttributes = "id" | "mesa_id" | "promocion_id" | "fecha_reserva" | "estado" | "precio_total" | "creado_en" | "actualizado_en";
export type reservasCreationAttributes = Optional<reservasAttributes, reservasOptionalAttributes>;

export class reservas extends Model<reservasAttributes, reservasCreationAttributes> implements reservasAttributes {
  id!: number;
  cliente_organizador_id!: number;
  mesa_id?: number;
  promocion_id?: number;
  fecha_reserva?: Date;
  estado?: string;
  precio_total?: number;
  creado_en?: Date;
  actualizado_en?: Date;

  // reservas belongsTo clientes via cliente_organizador_id
  cliente_organizador!: clientes;
  getCliente_organizador!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setCliente_organizador!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createCliente_organizador!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // reservas belongsTo mesas via mesa_id
  mesa!: mesas;
  getMesa!: Sequelize.BelongsToGetAssociationMixin<mesas>;
  setMesa!: Sequelize.BelongsToSetAssociationMixin<mesas, mesasId>;
  createMesa!: Sequelize.BelongsToCreateAssociationMixin<mesas>;
  // reservas belongsTo promociones via promocion_id
  promocion!: promociones;
  getPromocion!: Sequelize.BelongsToGetAssociationMixin<promociones>;
  setPromocion!: Sequelize.BelongsToSetAssociationMixin<promociones, promocionesId>;
  createPromocion!: Sequelize.BelongsToCreateAssociationMixin<promociones>;
  // reservas hasOne detalles_reserva via reserva_id
  detalles_reserva!: detalles_reserva;
  getDetalles_reserva!: Sequelize.HasOneGetAssociationMixin<detalles_reserva>;
  setDetalles_reserva!: Sequelize.HasOneSetAssociationMixin<detalles_reserva, detalles_reservaId>;
  createDetalles_reserva!: Sequelize.HasOneCreateAssociationMixin<detalles_reserva>;
  // reservas hasMany pagos via reserva_id
  pagos!: pagos[];
  getPagos!: Sequelize.HasManyGetAssociationsMixin<pagos>;
  setPagos!: Sequelize.HasManySetAssociationsMixin<pagos, pagosId>;
  addPago!: Sequelize.HasManyAddAssociationMixin<pagos, pagosId>;
  addPagos!: Sequelize.HasManyAddAssociationsMixin<pagos, pagosId>;
  createPago!: Sequelize.HasManyCreateAssociationMixin<pagos>;
  removePago!: Sequelize.HasManyRemoveAssociationMixin<pagos, pagosId>;
  removePagos!: Sequelize.HasManyRemoveAssociationsMixin<pagos, pagosId>;
  hasPago!: Sequelize.HasManyHasAssociationMixin<pagos, pagosId>;
  hasPagos!: Sequelize.HasManyHasAssociationsMixin<pagos, pagosId>;
  countPagos!: Sequelize.HasManyCountAssociationsMixin;
  // reservas hasMany reservas_clientes via reserva_id
  reservas_clientes!: reservas_clientes[];
  getReservas_clientes!: Sequelize.HasManyGetAssociationsMixin<reservas_clientes>;
  setReservas_clientes!: Sequelize.HasManySetAssociationsMixin<reservas_clientes, reservas_clientesId>;
  addReservas_cliente!: Sequelize.HasManyAddAssociationMixin<reservas_clientes, reservas_clientesId>;
  addReservas_clientes!: Sequelize.HasManyAddAssociationsMixin<reservas_clientes, reservas_clientesId>;
  createReservas_cliente!: Sequelize.HasManyCreateAssociationMixin<reservas_clientes>;
  removeReservas_cliente!: Sequelize.HasManyRemoveAssociationMixin<reservas_clientes, reservas_clientesId>;
  removeReservas_clientes!: Sequelize.HasManyRemoveAssociationsMixin<reservas_clientes, reservas_clientesId>;
  hasReservas_cliente!: Sequelize.HasManyHasAssociationMixin<reservas_clientes, reservas_clientesId>;
  hasReservas_clientes!: Sequelize.HasManyHasAssociationsMixin<reservas_clientes, reservas_clientesId>;
  countReservas_clientes!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof reservas {
    return reservas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cliente_organizador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    mesa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mesas',
        key: 'id'
      }
    },
    promocion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'promociones',
        key: 'id'
      }
    },
    fecha_reserva: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    precio_total: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actualizado_en: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'reservas',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "reservas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
