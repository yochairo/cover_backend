import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { discotecas, discotecasId } from './discotecas';
import type { personas, personasId } from './personas';

export interface personal_discotecasAttributes {
  id: number;
  persona_id: number;
  discoteca_id: number;
  rol_personal?: string;
  creado_en?: Date;
}

export type personal_discotecasPk = "id";
export type personal_discotecasId = personal_discotecas[personal_discotecasPk];
export type personal_discotecasOptionalAttributes = "id" | "rol_personal" | "creado_en";
export type personal_discotecasCreationAttributes = Optional<personal_discotecasAttributes, personal_discotecasOptionalAttributes>;

export class personal_discotecas extends Model<personal_discotecasAttributes, personal_discotecasCreationAttributes> implements personal_discotecasAttributes {
  id!: number;
  persona_id!: number;
  discoteca_id!: number;
  rol_personal?: string;
  creado_en?: Date;

  // personal_discotecas belongsTo discotecas via discoteca_id
  discoteca!: discotecas;
  getDiscoteca!: Sequelize.BelongsToGetAssociationMixin<discotecas>;
  setDiscoteca!: Sequelize.BelongsToSetAssociationMixin<discotecas, discotecasId>;
  createDiscoteca!: Sequelize.BelongsToCreateAssociationMixin<discotecas>;
  // personal_discotecas belongsTo personas via persona_id
  persona!: personas;
  getPersona!: Sequelize.BelongsToGetAssociationMixin<personas>;
  setPersona!: Sequelize.BelongsToSetAssociationMixin<personas, personasId>;
  createPersona!: Sequelize.BelongsToCreateAssociationMixin<personas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof personal_discotecas {
    return personal_discotecas.init({
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
      type: DataTypes.STRING(255),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
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
