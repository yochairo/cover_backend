import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { personal_discotecas, personal_discotecasId } from './personal_discotecas';
import type { personas, personasId } from './personas';

export interface personalAttributes {
  id: number;
  persona_id: number;
  numero_referencia?: string;
  tipo_contrato?: string;
  fecha_ingreso?: string;
  activo?: boolean;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type personalPk = "id";
export type personalId = personal[personalPk];
export type personalOptionalAttributes = "id" | "numero_referencia" | "tipo_contrato" | "fecha_ingreso" | "activo" | "creado_en" | "actualizado_en";
export type personalCreationAttributes = Optional<personalAttributes, personalOptionalAttributes>;

export class personal extends Model<personalAttributes, personalCreationAttributes> implements personalAttributes {
  id!: number;
  persona_id!: number;
  numero_referencia?: string;
  tipo_contrato?: string;
  fecha_ingreso?: string;
  activo?: boolean;
  creado_en?: Date;
  actualizado_en?: Date;

  // personal hasMany personal_discotecas via personal_id
  personal_discotecas!: personal_discotecas[];
  getPersonal_discotecas!: Sequelize.HasManyGetAssociationsMixin<personal_discotecas>;
  setPersonal_discotecas!: Sequelize.HasManySetAssociationsMixin<personal_discotecas, personal_discotecasId>;
  addPersonal_discoteca!: Sequelize.HasManyAddAssociationMixin<personal_discotecas, personal_discotecasId>;
  addPersonal_discotecas!: Sequelize.HasManyAddAssociationsMixin<personal_discotecas, personal_discotecasId>;
  createPersonal_discoteca!: Sequelize.HasManyCreateAssociationMixin<personal_discotecas>;
  removePersonal_discoteca!: Sequelize.HasManyRemoveAssociationMixin<personal_discotecas, personal_discotecasId>;
  removePersonal_discotecas!: Sequelize.HasManyRemoveAssociationsMixin<personal_discotecas, personal_discotecasId>;
  hasPersonal_discoteca!: Sequelize.HasManyHasAssociationMixin<personal_discotecas, personal_discotecasId>;
  hasPersonal_discotecas!: Sequelize.HasManyHasAssociationsMixin<personal_discotecas, personal_discotecasId>;
  countPersonal_discotecas!: Sequelize.HasManyCountAssociationsMixin;
  // personal belongsTo personas via persona_id
  persona!: personas;
  getPersona!: Sequelize.BelongsToGetAssociationMixin<personas>;
  setPersona!: Sequelize.BelongsToSetAssociationMixin<personas, personasId>;
  createPersona!: Sequelize.BelongsToCreateAssociationMixin<personas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof personal {
    return personal.init({
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
    numero_referencia: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tipo_contrato: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    actualizado_en: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'personal',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "personal_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
