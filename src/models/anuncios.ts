import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { discotecas, discotecasId } from './discotecas';

export interface anunciosAttributes {
  id: number;
  discoteca_id: number;
  titulo?: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type anunciosPk = "id";
export type anunciosId = anuncios[anunciosPk];
export type anunciosOptionalAttributes = "id" | "titulo" | "descripcion" | "fecha_inicio" | "fecha_fin" | "estado" | "creado_en" | "actualizado_en";
export type anunciosCreationAttributes = Optional<anunciosAttributes, anunciosOptionalAttributes>;

export class anuncios extends Model<anunciosAttributes, anunciosCreationAttributes> implements anunciosAttributes {
  id!: number;
  discoteca_id!: number;
  titulo?: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;

  // anuncios belongsTo discotecas via discoteca_id
  discoteca!: discotecas;
  getDiscoteca!: Sequelize.BelongsToGetAssociationMixin<discotecas>;
  setDiscoteca!: Sequelize.BelongsToSetAssociationMixin<discotecas, discotecasId>;
  createDiscoteca!: Sequelize.BelongsToCreateAssociationMixin<discotecas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof anuncios {
    return anuncios.init({
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
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actualizado_en: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'anuncios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "anuncios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
