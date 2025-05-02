import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { discotecas, discotecasId } from './discotecas';
import type { reservas, reservasId } from './reservas';

export interface promocionesAttributes {
  id: number;
  discoteca_id?: number;
  'código': string;
  'descripción'?: string;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado?: string;
  creado_en?: Date;
}

export type promocionesPk = "id";
export type promocionesId = promociones[promocionesPk];
export type promocionesOptionalAttributes = "id" | "discoteca_id" | "descripción" | "descuento_porcentaje" | "descuento_fijo" | "estado" | "creado_en";
export type promocionesCreationAttributes = Optional<promocionesAttributes, promocionesOptionalAttributes>;

export class promociones extends Model<promocionesAttributes, promocionesCreationAttributes> implements promocionesAttributes {
  id!: number;
  discoteca_id?: number;
  'código'!: string;
  'descripción'?: string;
  descuento_porcentaje?: number;
  descuento_fijo?: number;
  fecha_inicio!: Date;
  fecha_fin!: Date;
  estado?: string;
  creado_en?: Date;

  // promociones belongsTo discotecas via discoteca_id
  discoteca!: discotecas;
  getDiscoteca!: Sequelize.BelongsToGetAssociationMixin<discotecas>;
  setDiscoteca!: Sequelize.BelongsToSetAssociationMixin<discotecas, discotecasId>;
  createDiscoteca!: Sequelize.BelongsToCreateAssociationMixin<discotecas>;
  // promociones hasMany reservas via promocion_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof promociones {
    return promociones.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    discoteca_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'discotecas',
        key: 'id'
      }
    },
    'código': {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "promociones_código_key"
    },
    'descripción': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descuento_porcentaje: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    descuento_fijo: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false
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
    }
  }, {
    sequelize,
    tableName: 'promociones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "promociones_código_key",
        unique: true,
        fields: [
          { name: "código" },
        ]
      },
      {
        name: "promociones_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
