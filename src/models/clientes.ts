import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { pagos, pagosId } from './pagos';
import type { personas, personasId } from './personas';
import type { reservas, reservasId } from './reservas';
import type { reservas_clientes, reservas_clientesId } from './reservas_clientes';

export interface clientesAttributes {
  id: number;
  persona_id: number;
  preferencia?: string;
  fecha_registro?: Date;
  ultima_reserva?: Date;
}

export type clientesPk = "id";
export type clientesId = clientes[clientesPk];
export type clientesOptionalAttributes = "id" | "preferencia" | "fecha_registro" | "ultima_reserva";
export type clientesCreationAttributes = Optional<clientesAttributes, clientesOptionalAttributes>;

export class clientes extends Model<clientesAttributes, clientesCreationAttributes> implements clientesAttributes {
  id!: number;
  persona_id!: number;
  preferencia?: string;
  fecha_registro?: Date;
  ultima_reserva?: Date;

  // clientes hasMany pagos via cliente_id
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
  // clientes hasMany reservas via cliente_organizador_id
  reservas!: reservas[];
  getReservas!: Sequelize.HasManyGetAssociationsMixin<reservas>;
  setReservas!: Sequelize.HasManySetAssociationsMixin<reservas, reservasId>;
  addReserva!: Sequelize.HasManyAddAssociationMixin<reservas, reservasId>;
  addReservas!: Sequelize.HasManyAddAssociationsMixin<reservas, reservasId>;
  createReserva!: Sequelize.HasManyCreateAssociationMixin<reservas>;
  removeReserva!: Sequelize.HasManyRemoveAssociationMixin<reservas, reservasId>;
  removeReservas!: Sequelize.HasManyRemoveAssociationsMixin<reservas, reservasId>;
  hasReserva!: Sequelize.HasManyHasAssociationMixin<reservas, reservasId>;
  hasReservas!: Sequelize.HasManyHasAssociationsMixin<reservas, reservasId>;
  countReservas!: Sequelize.HasManyCountAssociationsMixin;
  // clientes hasMany reservas_clientes via cliente_id
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
  // clientes belongsTo personas via persona_id
  persona!: personas;
  getPersona!: Sequelize.BelongsToGetAssociationMixin<personas>;
  setPersona!: Sequelize.BelongsToSetAssociationMixin<personas, personasId>;
  createPersona!: Sequelize.BelongsToCreateAssociationMixin<personas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof clientes {
    return clientes.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    persona_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personas',
        key: 'id'
      }
    },
    preferencia: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ultima_reserva: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'clientes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "clientes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
