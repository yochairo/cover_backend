import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { historial_pagos, historial_pagosId } from './historial_pagos';
import type { historial_reservas, historial_reservasId } from './historial_reservas';
import type { pagos, pagosId } from './pagos';
import type { personas, personasId } from './personas';
import type { reservas, reservasId } from './reservas';
import type { reservas_clientes, reservas_clientesId } from './reservas_clientes';

export interface clientesAttributes {
  id: number;
  persona_id: number;
  preferencias?: string;
  fecha_registro?: Date;
  ultima_reserva?: Date;
}

export type clientesPk = "id";
export type clientesId = clientes[clientesPk];
export type clientesOptionalAttributes = "id" | "preferencias" | "fecha_registro" | "ultima_reserva";
export type clientesCreationAttributes = Optional<clientesAttributes, clientesOptionalAttributes>;

export class clientes extends Model<clientesAttributes, clientesCreationAttributes> implements clientesAttributes {
  id!: number;
  persona_id!: number;
  preferencias?: string;
  fecha_registro?: Date;
  ultima_reserva?: Date;

  // clientes hasMany historial_pagos via cliente_id
  historial_pagos!: historial_pagos[];
  getHistorial_pagos!: Sequelize.HasManyGetAssociationsMixin<historial_pagos>;
  setHistorial_pagos!: Sequelize.HasManySetAssociationsMixin<historial_pagos, historial_pagosId>;
  addHistorial_pago!: Sequelize.HasManyAddAssociationMixin<historial_pagos, historial_pagosId>;
  addHistorial_pagos!: Sequelize.HasManyAddAssociationsMixin<historial_pagos, historial_pagosId>;
  createHistorial_pago!: Sequelize.HasManyCreateAssociationMixin<historial_pagos>;
  removeHistorial_pago!: Sequelize.HasManyRemoveAssociationMixin<historial_pagos, historial_pagosId>;
  removeHistorial_pagos!: Sequelize.HasManyRemoveAssociationsMixin<historial_pagos, historial_pagosId>;
  hasHistorial_pago!: Sequelize.HasManyHasAssociationMixin<historial_pagos, historial_pagosId>;
  hasHistorial_pagos!: Sequelize.HasManyHasAssociationsMixin<historial_pagos, historial_pagosId>;
  countHistorial_pagos!: Sequelize.HasManyCountAssociationsMixin;
  // clientes hasMany historial_reservas via cliente_id
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
      },
      unique: "clientes_persona_id_key"
    },
    preferencias: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
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
        name: "clientes_persona_id_key",
        unique: true,
        fields: [
          { name: "persona_id" },
        ]
      },
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
