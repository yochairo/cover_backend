import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { discotecas, discotecasId } from './discotecas';
import type { personal, personalId } from './personal';

export interface personal_discotecasAttributes {
  id: number;
  personal_id: number;
  discoteca_id: number;
  rol_personal: string;
  creado_en?: Date;
}

export type personal_discotecasPk = "id";
export type personal_discotecasId = personal_discotecas[personal_discotecasPk];
export type personal_discotecasOptionalAttributes = "id" | "creado_en";
export type personal_discotecasCreationAttributes = Optional<personal_discotecasAttributes, personal_discotecasOptionalAttributes>;

export class personal_discotecas extends Model<personal_discotecasAttributes, personal_discotecasCreationAttributes> implements personal_discotecasAttributes {
  id!: number;
  personal_id!: number;
  discoteca_id!: number;
  rol_personal!: string;
  creado_en?: Date;

  // personal_discotecas belongsTo discotecas via discoteca_id
  discoteca!: discotecas;
  getDiscoteca!: Sequelize.BelongsToGetAssociationMixin<discotecas>;
  setDiscoteca!: Sequelize.BelongsToSetAssociationMixin<discotecas, discotecasId>;
  createDiscoteca!: Sequelize.BelongsToCreateAssociationMixin<discotecas>;
  // personal_discotecas belongsTo personal via personal_id
  personal!: personal;
  getPersonal!: Sequelize.BelongsToGetAssociationMixin<personal>;
  setPersonal!: Sequelize.BelongsToSetAssociationMixin<personal, personalId>;
  createPersonal!: Sequelize.BelongsToCreateAssociationMixin<personal>;

  static initModel(sequelize: Sequelize.Sequelize): typeof personal_discotecas {
    return personal_discotecas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    personal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personal',
        key: 'id'
      }
    },
    discoteca_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discotecas',
        key: 'id'
      }
    },
    rol_personal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personal_discotecas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "personal_discotecas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
