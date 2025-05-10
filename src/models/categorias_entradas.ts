import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { entradas, entradasId } from './entradas';

export interface categorias_entradasAttributes {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base?: number;
  creado_en?: Date;
}

export type categorias_entradasPk = "id";
export type categorias_entradasId = categorias_entradas[categorias_entradasPk];
export type categorias_entradasOptionalAttributes = "id" | "descripcion" | "precio_base" | "creado_en";
export type categorias_entradasCreationAttributes = Optional<categorias_entradasAttributes, categorias_entradasOptionalAttributes>;

export class categorias_entradas extends Model<categorias_entradasAttributes, categorias_entradasCreationAttributes> implements categorias_entradasAttributes {
  id!: number;
  nombre!: string;
  descripcion?: string;
  precio_base?: number;
  creado_en?: Date;

  // categorias_entradas hasMany entradas via categoria_id
  entradas!: entradas[];
  getEntradas!: Sequelize.HasManyGetAssociationsMixin<entradas>;
  setEntradas!: Sequelize.HasManySetAssociationsMixin<entradas, entradasId>;
  addEntrada!: Sequelize.HasManyAddAssociationMixin<entradas, entradasId>;
  addEntradas!: Sequelize.HasManyAddAssociationsMixin<entradas, entradasId>;
  createEntrada!: Sequelize.HasManyCreateAssociationMixin<entradas>;
  removeEntrada!: Sequelize.HasManyRemoveAssociationMixin<entradas, entradasId>;
  removeEntradas!: Sequelize.HasManyRemoveAssociationsMixin<entradas, entradasId>;
  hasEntrada!: Sequelize.HasManyHasAssociationMixin<entradas, entradasId>;
  hasEntradas!: Sequelize.HasManyHasAssociationsMixin<entradas, entradasId>;
  countEntradas!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof categorias_entradas {
    return categorias_entradas.init({
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
    tableName: 'categorias_entradas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "categorias_entradas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
