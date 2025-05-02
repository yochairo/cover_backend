import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { metodos_pagos, metodos_pagosId } from './metodos_pagos';
import type { pagos, pagosId } from './pagos';

export interface historial_pagosAttributes {
  id: number;
  pago_id: number;
  cliente_id: number;
  'acción'?: string;
  monto: number;
  metodo_pago_id: number;
  estado_anterior?: string;
  estado_nuevo?: string;
  fecha_accion?: Date;
  detalles?: string;
}

export type historial_pagosPk = "id";
export type historial_pagosId = historial_pagos[historial_pagosPk];
export type historial_pagosOptionalAttributes = "id" | "acción" | "estado_anterior" | "estado_nuevo" | "fecha_accion" | "detalles";
export type historial_pagosCreationAttributes = Optional<historial_pagosAttributes, historial_pagosOptionalAttributes>;

export class historial_pagos extends Model<historial_pagosAttributes, historial_pagosCreationAttributes> implements historial_pagosAttributes {
  id!: number;
  pago_id!: number;
  cliente_id!: number;
  'acción'?: string;
  monto!: number;
  metodo_pago_id!: number;
  estado_anterior?: string;
  estado_nuevo?: string;
  fecha_accion?: Date;
  detalles?: string;

  // historial_pagos belongsTo clientes via cliente_id
  cliente!: clientes;
  getCliente!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setCliente!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createCliente!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // historial_pagos belongsTo metodos_pagos via metodo_pago_id
  metodo_pago!: metodos_pagos;
  getMetodo_pago!: Sequelize.BelongsToGetAssociationMixin<metodos_pagos>;
  setMetodo_pago!: Sequelize.BelongsToSetAssociationMixin<metodos_pagos, metodos_pagosId>;
  createMetodo_pago!: Sequelize.BelongsToCreateAssociationMixin<metodos_pagos>;
  // historial_pagos belongsTo pagos via pago_id
  pago!: pagos;
  getPago!: Sequelize.BelongsToGetAssociationMixin<pagos>;
  setPago!: Sequelize.BelongsToSetAssociationMixin<pagos, pagosId>;
  createPago!: Sequelize.BelongsToCreateAssociationMixin<pagos>;

  static initModel(sequelize: Sequelize.Sequelize): typeof historial_pagos {
    return historial_pagos.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pagos',
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
    monto: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    metodo_pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'metodos_pagos',
        key: 'id'
      }
    },
    estado_anterior: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado_nuevo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_accion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    detalles: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'historial_pagos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "historial_pagos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
