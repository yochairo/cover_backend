import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { mesas, mesasId } from './mesas';

export interface categorias_mesasAttributes {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base?: number;
  creado_en?: Date;
}

export type categorias_mesasPk = "id";
export type categorias_mesasId = categorias_mesas[categorias_mesasPk];
export type categorias_mesasOptionalAttributes = "id" | "descripcion" | "precio_base" | "creado_en";
export type categorias_mesasCreationAttributes = Optional<categorias_mesasAttributes, categorias_mesasOptionalAttributes>;

export class categorias_mesas extends Model<categorias_mesasAttributes, categorias_mesasCreationAttributes> implements categorias_mesasAttributes {
  id!: number;
  nombre!: string;
  descripcion?: string;
  precio_base?: number;
  creado_en?: Date;

  // categorias_mesas hasMany mesas via categoria_id
  mesas!: mesas[];
  getMesas!: Sequelize.HasManyGetAssociationsMixin<mesas>;
  setMesas!: Sequelize.HasManySetAssociationsMixin<mesas, mesasId>;
  addMesa!: Sequelize.HasManyAddAssociationMixin<mesas, mesasId>;
  addMesas!: Sequelize.HasManyAddAssociationsMixin<mesas, mesasId>;
  createMesa!: Sequelize.HasManyCreateAssociationMixin<mesas>;
  removeMesa!: Sequelize.HasManyRemoveAssociationMixin<mesas, mesasId>;
  removeMesas!: Sequelize.HasManyRemoveAssociationsMixin<mesas, mesasId>;
  hasMesa!: Sequelize.HasManyHasAssociationMixin<mesas, mesasId>;
  hasMesas!: Sequelize.HasManyHasAssociationsMixin<mesas, mesasId>;
  countMesas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof categorias_mesas {
    return categorias_mesas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    precio_base: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'categorias_mesas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "categorias_mesas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
