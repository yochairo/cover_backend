import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { discotecas, discotecasId } from './discotecas';

export interface eventosAttributes {
  id: number;
  discoteca_id: number;
  nombre: string;
  tipo_evento?: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;
}

export type eventosPk = "id";
export type eventosId = eventos[eventosPk];
export type eventosOptionalAttributes = "id" | "tipo_evento" | "descripcion" | "fecha_inicio" | "fecha_fin" | "estado" | "creado_en" | "actualizado_en";
export type eventosCreationAttributes = Optional<eventosAttributes, eventosOptionalAttributes>;

export class eventos extends Model<eventosAttributes, eventosCreationAttributes> implements eventosAttributes {
  id!: number;
  discoteca_id!: number;
  nombre!: string;
  tipo_evento?: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado?: string;
  creado_en?: Date;
  actualizado_en?: Date;

  // eventos belongsTo discotecas via discoteca_id
  discoteca!: discotecas;
  getDiscoteca!: Sequelize.BelongsToGetAssociationMixin<discotecas>;
  setDiscoteca!: Sequelize.BelongsToSetAssociationMixin<discotecas, discotecasId>;
  createDiscoteca!: Sequelize.BelongsToCreateAssociationMixin<discotecas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof eventos {
    return eventos.init({
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
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo_evento: {
      type: DataTypes.STRING(50),
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
    tableName: 'eventos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "eventos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
