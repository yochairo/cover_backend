import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { categorias_mesas, categorias_mesasId } from './categorias_mesas';
import type { discotecas, discotecasId } from './discotecas';
import type { reservas, reservasId } from './reservas';

export interface mesasAttributes {
  id: number;
  discoteca_id: number;
  categoria_id: number;
  'número_mesa': string;
  capacidad: number;
  estado?: string;
  precio?: number;
  'ubicación'?: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type mesasPk = "id";
export type mesasId = mesas[mesasPk];
export type mesasOptionalAttributes = "id" | "estado" | "precio" | "ubicación" | "creado_en" | "actualizado_en";
export type mesasCreationAttributes = Optional<mesasAttributes, mesasOptionalAttributes>;

export class mesas extends Model<mesasAttributes, mesasCreationAttributes> implements mesasAttributes {
  id!: number;
  discoteca_id!: number;
  categoria_id!: number;
  'número_mesa'!: string;
  capacidad!: number;
  estado?: string;
  precio?: number;
  'ubicación'?: string;
  creado_en?: Date;
  actualizado_en?: Date;

  // mesas belongsTo categorias_mesas via categoria_id
  categorium!: categorias_mesas;
  getCategorium!: Sequelize.BelongsToGetAssociationMixin<categorias_mesas>;
  setCategorium!: Sequelize.BelongsToSetAssociationMixin<categorias_mesas, categorias_mesasId>;
  createCategorium!: Sequelize.BelongsToCreateAssociationMixin<categorias_mesas>;
  // mesas belongsTo discotecas via discoteca_id
  discoteca!: discotecas;
  getDiscoteca!: Sequelize.BelongsToGetAssociationMixin<discotecas>;
  setDiscoteca!: Sequelize.BelongsToSetAssociationMixin<discotecas, discotecasId>;
  createDiscoteca!: Sequelize.BelongsToCreateAssociationMixin<discotecas>;
  // mesas hasMany reservas via mesa_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof mesas {
    return mesas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    discoteca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discotecas',
        key: 'id'
      }
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias_mesas',
        key: 'id'
      }
    },
    'número_mesa': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "disponible"
    },
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    'ubicación': {
      type: DataTypes.STRING(255),
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
    tableName: 'mesas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "mesas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
