import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { mesas, mesasId } from './mesas';
import type { personal_discotecas, personal_discotecasId } from './personal_discotecas';
import type { promociones, promocionesId } from './promociones';

export interface discotecasAttributes {
  id: number;
  nombre: string;
  'dirección': string;
  'teléfono': string;
  correo_contacto?: string;
  capacidad_total?: number;
  horario_apertura?: string;
  horario_cierre?: string;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type discotecasPk = "id";
export type discotecasId = discotecas[discotecasPk];
export type discotecasOptionalAttributes = "id" | "correo_contacto" | "capacidad_total" | "horario_apertura" | "horario_cierre" | "estado" | "creado_en" | "actualizado_en";
export type discotecasCreationAttributes = Optional<discotecasAttributes, discotecasOptionalAttributes>;

export class discotecas extends Model<discotecasAttributes, discotecasCreationAttributes> implements discotecasAttributes {
  id!: number;
  nombre!: string;
  'dirección'!: string;
  'teléfono'!: string;
  correo_contacto?: string;
  capacidad_total?: number;
  horario_apertura?: string;
  horario_cierre?: string;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;

  // discotecas hasMany mesas via discoteca_id
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
  // discotecas hasMany personal_discotecas via discoteca_id
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
  // discotecas hasMany promociones via discoteca_id
  promociones!: promociones[];
  getPromociones!: Sequelize.HasManyGetAssociationsMixin<promociones>;
  setPromociones!: Sequelize.HasManySetAssociationsMixin<promociones, promocionesId>;
  addPromocione!: Sequelize.HasManyAddAssociationMixin<promociones, promocionesId>;
  addPromociones!: Sequelize.HasManyAddAssociationsMixin<promociones, promocionesId>;
  createPromocione!: Sequelize.HasManyCreateAssociationMixin<promociones>;
  removePromocione!: Sequelize.HasManyRemoveAssociationMixin<promociones, promocionesId>;
  removePromociones!: Sequelize.HasManyRemoveAssociationsMixin<promociones, promocionesId>;
  hasPromocione!: Sequelize.HasManyHasAssociationMixin<promociones, promocionesId>;
  hasPromociones!: Sequelize.HasManyHasAssociationsMixin<promociones, promocionesId>;
  countPromociones!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof discotecas {
    return discotecas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    'dirección': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    'teléfono': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    correo_contacto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    capacidad_total: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    horario_apertura: {
      type: DataTypes.TIME,
      allowNull: true
    },
    horario_cierre: {
      type: DataTypes.TIME,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "activa"
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
    tableName: 'discotecas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "discotecas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
