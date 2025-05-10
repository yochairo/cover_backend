import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { personal_discotecas, personal_discotecasId } from './personal_discotecas';

export interface personasAttributes {
  id: number;
  nombre_usuario?: string;
  correo?: string;
  contrasena?: string;
  nombre_completo?: string;
  telefono?: string;
  carnet?: string;
  rol?: string;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type personasPk = "id";
export type personasId = personas[personasPk];
export type personasOptionalAttributes = "id" | "nombre_usuario" | "correo" | "contrasena" | "nombre_completo" | "telefono" | "carnet" | "rol" | "estado" | "creado_en" | "actualizado_en";
export type personasCreationAttributes = Optional<personasAttributes, personasOptionalAttributes>;

export class personas extends Model<personasAttributes, personasCreationAttributes> implements personasAttributes {
  id!: number;
  nombre_usuario?: string;
  correo?: string;
  contrasena?: string;
  nombre_completo?: string;
  telefono?: string;
  carnet?: string;
  rol?: string;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;

  // personas hasMany clientes via persona_id
  clientes!: clientes[];
  getClientes!: Sequelize.HasManyGetAssociationsMixin<clientes>;
  setClientes!: Sequelize.HasManySetAssociationsMixin<clientes, clientesId>;
  addCliente!: Sequelize.HasManyAddAssociationMixin<clientes, clientesId>;
  addClientes!: Sequelize.HasManyAddAssociationsMixin<clientes, clientesId>;
  createCliente!: Sequelize.HasManyCreateAssociationMixin<clientes>;
  removeCliente!: Sequelize.HasManyRemoveAssociationMixin<clientes, clientesId>;
  removeClientes!: Sequelize.HasManyRemoveAssociationsMixin<clientes, clientesId>;
  hasCliente!: Sequelize.HasManyHasAssociationMixin<clientes, clientesId>;
  hasClientes!: Sequelize.HasManyHasAssociationsMixin<clientes, clientesId>;
  countClientes!: Sequelize.HasManyCountAssociationsMixin;
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
      type: DataTypes.STRING(50),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    carnet: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rol: {
      type: DataTypes.STRING(30),
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
    tableName: 'personas',
    schema: 'public',
    timestamps: false,
    indexes: [
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
