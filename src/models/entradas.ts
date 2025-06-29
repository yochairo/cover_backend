import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { categorias_entradas, categorias_entradasId } from './categorias_entradas';
import type { clientes, clientesId } from './clientes';
import type { discotecas, discotecasId } from './discotecas';

export interface entradasAttributes {
  id: number;
  discoteca_id: number;
  categoria_id: number;
  tipo_entrada: string;
  precio: number;
  disponible?: boolean;
  fecha_disponible?: Date;
  creado_en?: Date;
  id_cliente?: number;
}

export type entradasPk = "id";
export type entradasId = entradas[entradasPk];
export type entradasOptionalAttributes = "id" | "disponible" | "fecha_disponible" | "creado_en" | "id_cliente";
export type entradasCreationAttributes = Optional<entradasAttributes, entradasOptionalAttributes>;

export class entradas extends Model<entradasAttributes, entradasCreationAttributes> implements entradasAttributes {
  id!: number;
  discoteca_id!: number;
  categoria_id!: number;
  tipo_entrada!: string;
  precio!: number;
  disponible?: boolean;
  fecha_disponible?: Date;
  creado_en?: Date;
  id_cliente?: number;

  // entradas belongsTo categorias_entradas via categoria_id
  categorium!: categorias_entradas;
  getCategorium!: Sequelize.BelongsToGetAssociationMixin<categorias_entradas>;
  setCategorium!: Sequelize.BelongsToSetAssociationMixin<categorias_entradas, categorias_entradasId>;
  createCategorium!: Sequelize.BelongsToCreateAssociationMixin<categorias_entradas>;
  // entradas belongsTo clientes via id_cliente
  id_cliente_cliente!: clientes;
  getId_cliente_cliente!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setId_cliente_cliente!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createId_cliente_cliente!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // entradas belongsTo discotecas via discoteca_id
  discoteca!: discotecas;
  getDiscoteca!: Sequelize.BelongsToGetAssociationMixin<discotecas>;
  setDiscoteca!: Sequelize.BelongsToSetAssociationMixin<discotecas, discotecasId>;
  createDiscoteca!: Sequelize.BelongsToCreateAssociationMixin<discotecas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof entradas {
    return entradas.init({
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
        model: 'categorias_entradas',
        key: 'id'
      }
    },
    tipo_entrada: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    fecha_disponible: {
      type: DataTypes.DATE,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'entradas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "entradas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
