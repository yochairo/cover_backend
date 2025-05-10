import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface auditoria_pagosAttributes {
  id: number;
  pago_id: number;
  operacion: string;
  estado_anterior?: object;
  estado_nuevo?: object;
  fecha_auditoria?: Date;
  usuario?: string;
}

export type auditoria_pagosPk = "id";
export type auditoria_pagosId = auditoria_pagos[auditoria_pagosPk];
export type auditoria_pagosOptionalAttributes = "id" | "estado_anterior" | "estado_nuevo" | "fecha_auditoria" | "usuario";
export type auditoria_pagosCreationAttributes = Optional<auditoria_pagosAttributes, auditoria_pagosOptionalAttributes>;

export class auditoria_pagos extends Model<auditoria_pagosAttributes, auditoria_pagosCreationAttributes> implements auditoria_pagosAttributes {
  id!: number;
  pago_id!: number;
  operacion!: string;
  estado_anterior?: object;
  estado_nuevo?: object;
  fecha_auditoria?: Date;
  usuario?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof auditoria_pagos {
    return auditoria_pagos.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pago_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    operacion: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    estado_anterior: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    estado_nuevo: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    fecha_auditoria: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'auditoria_pagos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "auditoria_pagos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
