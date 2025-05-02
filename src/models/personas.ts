import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesCreationAttributes, clientesId } from './clientes';
import type { personal_discotecas, personal_discotecasId } from './personal_discotecas';

export interface personasAttributes {
  id: number;
  nombre_usuario: string;
  correo: string;
  contrasena: string;
  nombre_completo: string;
  telefono?: string;
  carnet?: string;
  rol?: string;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type personasPk = "id";
export type personasId = personas[personasPk];
export type personasOptionalAttributes = "id" | "telefono" | "carnet" | "rol" | "estado" | "creado_en" | "actualizado_en";
export type personasCreationAttributes = Optional<personasAttributes, personasOptionalAttributes>;

export class personas extends Model<personasAttributes, personasCreationAttributes> implements personasAttributes {
  id!: number;
  nombre_usuario!: string;
  correo!: string;
  contrasena!: string;
  nombre_completo!: string;
  telefono?: string;
  carnet?: string;
  rol?: string;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;

  // personas hasOne clientes via persona_id
  cliente!: clientes;
  getCliente!: Sequelize.HasOneGetAssociationMixin<clientes>;
  setCliente!: Sequelize.HasOneSetAssociationMixin<clientes, clientesId>;
  createCliente!: Sequelize.HasOneCreateAssociationMixin<clientes>;
  // personas hasMany personal_discotecas via persona_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof personas {
    return personas.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre_usuario: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "personas_nombre_usuario_key"
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "personas_correo_key"
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre_completo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    carnet: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "personas_carnet_key"
    },
    rol: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "cliente"
    },
    estado: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "activo"
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
    tableName: 'personas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "personas_carnet_key",
        unique: true,
        fields: [
          { name: "carnet" },
        ]
      },
      {
        name: "personas_correo_key",
        unique: true,
        fields: [
          { name: "correo" },
        ]
      },
      {
        name: "personas_nombre_usuario_key",
        unique: true,
        fields: [
          { name: "nombre_usuario" },
        ]
      },
      {
        name: "personas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
