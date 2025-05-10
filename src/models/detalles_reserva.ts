import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { reservas, reservasId } from './reservas';

export interface detalles_reservaAttributes {
  reserva_id: number;
  motivado?: string;
  nota?: string;
}

export type detalles_reservaPk = "reserva_id";
export type detalles_reservaId = detalles_reserva[detalles_reservaPk];
export type detalles_reservaOptionalAttributes = "motivado" | "nota";
export type detalles_reservaCreationAttributes = Optional<detalles_reservaAttributes, detalles_reservaOptionalAttributes>;

export class detalles_reserva extends Model<detalles_reservaAttributes, detalles_reservaCreationAttributes> implements detalles_reservaAttributes {
  reserva_id!: number;
  motivado?: string;
  nota?: string;

  // detalles_reserva belongsTo reservas via reserva_id
  reserva!: reservas;
  getReserva!: Sequelize.BelongsToGetAssociationMixin<reservas>;
  setReserva!: Sequelize.BelongsToSetAssociationMixin<reservas, reservasId>;
  createReserva!: Sequelize.BelongsToCreateAssociationMixin<reservas>;

  static initModel(sequelize: Sequelize.Sequelize): typeof detalles_reserva {
    return detalles_reserva.init({
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'reservas',
        key: 'id'
      }
    },
    motivado: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nota: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'detalles_reserva',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "detalles_reserva_pkey",
        unique: true,
        fields: [
          { name: "reserva_id" },
        ]
      },
    ]
  });
  }
}
