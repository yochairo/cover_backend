import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { pagos, pagosId } from './pagos';

export interface metodos_pagoAttributes {
  id: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
  creado_en?: Date;
}

export type metodos_pagoPk = "id";
export type metodos_pagoId = metodos_pago[metodos_pagoPk];
export type metodos_pagoOptionalAttributes = "id" | "nombre" | "descripcion" | "estado" | "creado_en";
export type metodos_pagoCreationAttributes = Optional<metodos_pagoAttributes, metodos_pagoOptionalAttributes>;

export class metodos_pago extends Model<metodos_pagoAttributes, metodos_pagoCreationAttributes> implements metodos_pagoAttributes {
  id!: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
  creado_en?: Date;

  // metodos_pago hasMany pagos via metodo_pago_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof metodos_pago {
    return metodos_pago.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'metodos_pago',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "metodos_pago_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
