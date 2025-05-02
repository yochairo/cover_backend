import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { historial_pagos, historial_pagosId } from './historial_pagos';
import type { metodos_pagos, metodos_pagosId } from './metodos_pagos';
import type { reservas, reservasId } from './reservas';

export interface pagosAttributes {
  id: number;
  reserva_id: number;
  cliente_id: number;
  metodo_pago_id: number;
  monto: number;
  estado?: string;
  fecha_pago?: Date;
  referencia_pago?: string;
}

export type pagosPk = "id";
export type pagosId = pagos[pagosPk];
export type pagosOptionalAttributes = "id" | "estado" | "fecha_pago" | "referencia_pago";
export type pagosCreationAttributes = Optional<pagosAttributes, pagosOptionalAttributes>;

export class pagos extends Model<pagosAttributes, pagosCreationAttributes> implements pagosAttributes {
  id!: number;
  reserva_id!: number;
  cliente_id!: number;
  metodo_pago_id!: number;
  monto!: number;
  estado?: string;
  fecha_pago?: Date;
  referencia_pago?: string;

  // pagos belongsTo clientes via cliente_id
  cliente!: clientes;
  getCliente!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setCliente!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createCliente!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // pagos belongsTo metodos_pagos via metodo_pago_id
  metodo_pago!: metodos_pagos;
  getMetodo_pago!: Sequelize.BelongsToGetAssociationMixin<metodos_pagos>;
  setMetodo_pago!: Sequelize.BelongsToSetAssociationMixin<metodos_pagos, metodos_pagosId>;
  createMetodo_pago!: Sequelize.BelongsToCreateAssociationMixin<metodos_pagos>;
  // pagos hasMany historial_pagos via pago_id
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
        model: 'metodos_pagos',
        key: 'id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "pendiente"
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    referencia_pago: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pagos',
    schema: 'public',
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
