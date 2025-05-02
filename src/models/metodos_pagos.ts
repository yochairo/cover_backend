import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { historial_pagos, historial_pagosId } from './historial_pagos';
import type { pagos, pagosId } from './pagos';

export interface metodos_pagosAttributes {
  id: number;
  nombre: string;
  'descripción'?: string;
  estado?: string;
  creado_en?: Date;
}

export type metodos_pagosPk = "id";
export type metodos_pagosId = metodos_pagos[metodos_pagosPk];
export type metodos_pagosOptionalAttributes = "id" | "descripción" | "estado" | "creado_en";
export type metodos_pagosCreationAttributes = Optional<metodos_pagosAttributes, metodos_pagosOptionalAttributes>;

export class metodos_pagos extends Model<metodos_pagosAttributes, metodos_pagosCreationAttributes> implements metodos_pagosAttributes {
  id!: number;
  nombre!: string;
  'descripción'?: string;
  estado?: string;
  creado_en?: Date;

  // metodos_pagos hasMany historial_pagos via metodo_pago_id
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
  // metodos_pagos hasMany pagos via metodo_pago_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof metodos_pagos {
    return metodos_pagos.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "metodos_pagos_nombre_key"
    },
    'descripción': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "activo"
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'metodos_pagos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "metodos_pagos_nombre_key",
        unique: true,
        fields: [
          { name: "nombre" },
        ]
      },
      {
        name: "metodos_pagos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
