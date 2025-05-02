import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { historial_reservas, historial_reservasId } from './historial_reservas';
import type { mesas, mesasId } from './mesas';
import type { pagos, pagosId } from './pagos';
import type { promociones, promocionesId } from './promociones';
import type { reservas_clientes, reservas_clientesId } from './reservas_clientes';

export interface reservasAttributes {
  id: number;
  cliente_organizador_id: number;
  mesa_id: number;
  promocion_id?: number;
  fecha_reserva: Date;
  estado?: string;
  invitados: number;
  precio_total?: number;
  notas?: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type reservasPk = "id";
export type reservasId = reservas[reservasPk];
export type reservasOptionalAttributes = "id" | "promocion_id" | "estado" | "precio_total" | "notas" | "creado_en" | "actualizado_en";
export type reservasCreationAttributes = Optional<reservasAttributes, reservasOptionalAttributes>;

export class reservas extends Model<reservasAttributes, reservasCreationAttributes> implements reservasAttributes {
  id!: number;
  cliente_organizador_id!: number;
  mesa_id!: number;
  promocion_id?: number;
  fecha_reserva!: Date;
  estado?: string;
  invitados!: number;
  precio_total?: number;
  notas?: string;
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
  // reservas hasMany historial_reservas via reserva_id
  historial_reservas!: historial_reservas[];
  getHistorial_reservas!: Sequelize.HasManyGetAssociationsMixin<historial_reservas>;
  setHistorial_reservas!: Sequelize.HasManySetAssociationsMixin<historial_reservas, historial_reservasId>;
  addHistorial_reserva!: Sequelize.HasManyAddAssociationMixin<historial_reservas, historial_reservasId>;
  addHistorial_reservas!: Sequelize.HasManyAddAssociationsMixin<historial_reservas, historial_reservasId>;
  createHistorial_reserva!: Sequelize.HasManyCreateAssociationMixin<historial_reservas>;
  removeHistorial_reserva!: Sequelize.HasManyRemoveAssociationMixin<historial_reservas, historial_reservasId>;
  removeHistorial_reservas!: Sequelize.HasManyRemoveAssociationsMixin<historial_reservas, historial_reservasId>;
  hasHistorial_reserva!: Sequelize.HasManyHasAssociationMixin<historial_reservas, historial_reservasId>;
  hasHistorial_reservas!: Sequelize.HasManyHasAssociationsMixin<historial_reservas, historial_reservasId>;
  countHistorial_reservas!: Sequelize.HasManyCountAssociationsMixin;
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
      allowNull: false,
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
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "pendiente"
    },
    invitados: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_total: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    actualizado_en: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'reservas',
    schema: 'public',
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
