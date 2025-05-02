import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { clientes, clientesId } from './clientes';
import type { reservas, reservasId } from './reservas';

export interface reservas_clientesAttributes {
  id: number;
  reserva_id: number;
  cliente_id: number;
  creado_en?: Date;
}

export type reservas_clientesPk = "id";
export type reservas_clientesId = reservas_clientes[reservas_clientesPk];
export type reservas_clientesOptionalAttributes = "id" | "creado_en";
export type reservas_clientesCreationAttributes = Optional<reservas_clientesAttributes, reservas_clientesOptionalAttributes>;

export class reservas_clientes extends Model<reservas_clientesAttributes, reservas_clientesCreationAttributes> implements reservas_clientesAttributes {
  id!: number;
  reserva_id!: number;
  cliente_id!: number;
  creado_en?: Date;

  // reservas_clientes belongsTo clientes via cliente_id
  cliente!: clientes;
  getCliente!: Sequelize.BelongsToGetAssociationMixin<clientes>;
  setCliente!: Sequelize.BelongsToSetAssociationMixin<clientes, clientesId>;
  createCliente!: Sequelize.BelongsToCreateAssociationMixin<clientes>;
  // reservas_clientes belongsTo reservas via reserva_id
  reserva!: reservas;
  getReserva!: Sequelize.BelongsToGetAssociationMixin<reservas>;
  setReserva!: Sequelize.BelongsToSetAssociationMixin<reservas, reservasId>;
  createReserva!: Sequelize.BelongsToCreateAssociationMixin<reservas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof reservas_clientes {
    return reservas_clientes.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservas',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'reservas_clientes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "reservas_clientes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
