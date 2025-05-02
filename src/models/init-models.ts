import type { Sequelize } from "sequelize";
import { categorias_mesas as _categorias_mesas } from "./categorias_mesas";
import type { categorias_mesasAttributes, categorias_mesasCreationAttributes } from "./categorias_mesas";
import { clientes as _clientes } from "./clientes";
import type { clientesAttributes, clientesCreationAttributes } from "./clientes";
import { discotecas as _discotecas } from "./discotecas";
import type { discotecasAttributes, discotecasCreationAttributes } from "./discotecas";
import { historial_pagos as _historial_pagos } from "./historial_pagos";
import type { historial_pagosAttributes, historial_pagosCreationAttributes } from "./historial_pagos";
import { historial_reservas as _historial_reservas } from "./historial_reservas";
import type { historial_reservasAttributes, historial_reservasCreationAttributes } from "./historial_reservas";
import { mesas as _mesas } from "./mesas";
import type { mesasAttributes, mesasCreationAttributes } from "./mesas";
import { metodos_pagos as _metodos_pagos } from "./metodos_pagos";
import type { metodos_pagosAttributes, metodos_pagosCreationAttributes } from "./metodos_pagos";
import { pagos as _pagos } from "./pagos";
import type { pagosAttributes, pagosCreationAttributes } from "./pagos";
import { personal_discotecas as _personal_discotecas } from "./personal_discotecas";
import type { personal_discotecasAttributes, personal_discotecasCreationAttributes } from "./personal_discotecas";
import { personas as _personas } from "./personas";
import type { personasAttributes, personasCreationAttributes } from "./personas";
import { promociones as _promociones } from "./promociones";
import type { promocionesAttributes, promocionesCreationAttributes } from "./promociones";
import { reservas as _reservas } from "./reservas";
import type { reservasAttributes, reservasCreationAttributes } from "./reservas";
import { reservas_clientes as _reservas_clientes } from "./reservas_clientes";
import type { reservas_clientesAttributes, reservas_clientesCreationAttributes } from "./reservas_clientes";

export {
  _categorias_mesas as categorias_mesas,
  _clientes as clientes,
  _discotecas as discotecas,
  _historial_pagos as historial_pagos,
  _historial_reservas as historial_reservas,
  _mesas as mesas,
  _metodos_pagos as metodos_pagos,
  _pagos as pagos,
  _personal_discotecas as personal_discotecas,
  _personas as personas,
  _promociones as promociones,
  _reservas as reservas,
  _reservas_clientes as reservas_clientes,
};

export type {
  categorias_mesasAttributes,
  categorias_mesasCreationAttributes,
  clientesAttributes,
  clientesCreationAttributes,
  discotecasAttributes,
  discotecasCreationAttributes,
  historial_pagosAttributes,
  historial_pagosCreationAttributes,
  historial_reservasAttributes,
  historial_reservasCreationAttributes,
  mesasAttributes,
  mesasCreationAttributes,
  metodos_pagosAttributes,
  metodos_pagosCreationAttributes,
  pagosAttributes,
  pagosCreationAttributes,
  personal_discotecasAttributes,
  personal_discotecasCreationAttributes,
  personasAttributes,
  personasCreationAttributes,
  promocionesAttributes,
  promocionesCreationAttributes,
  reservasAttributes,
  reservasCreationAttributes,
  reservas_clientesAttributes,
  reservas_clientesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const categorias_mesas = _categorias_mesas.initModel(sequelize);
  const clientes = _clientes.initModel(sequelize);
  const discotecas = _discotecas.initModel(sequelize);
  const historial_pagos = _historial_pagos.initModel(sequelize);
  const historial_reservas = _historial_reservas.initModel(sequelize);
  const mesas = _mesas.initModel(sequelize);
  const metodos_pagos = _metodos_pagos.initModel(sequelize);
  const pagos = _pagos.initModel(sequelize);
  const personal_discotecas = _personal_discotecas.initModel(sequelize);
  const personas = _personas.initModel(sequelize);
  const promociones = _promociones.initModel(sequelize);
  const reservas = _reservas.initModel(sequelize);
  const reservas_clientes = _reservas_clientes.initModel(sequelize);

  mesas.belongsTo(categorias_mesas, { as: "categorium", foreignKey: "categoria_id"});
  categorias_mesas.hasMany(mesas, { as: "mesas", foreignKey: "categoria_id"});
  historial_pagos.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(historial_pagos, { as: "historial_pagos", foreignKey: "cliente_id"});
  historial_reservas.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(historial_reservas, { as: "historial_reservas", foreignKey: "cliente_id"});
  pagos.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(pagos, { as: "pagos", foreignKey: "cliente_id"});
  reservas.belongsTo(clientes, { as: "cliente_organizador", foreignKey: "cliente_organizador_id"});
  clientes.hasMany(reservas, { as: "reservas", foreignKey: "cliente_organizador_id"});
  reservas_clientes.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(reservas_clientes, { as: "reservas_clientes", foreignKey: "cliente_id"});
  mesas.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(mesas, { as: "mesas", foreignKey: "discoteca_id"});
  personal_discotecas.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(personal_discotecas, { as: "personal_discotecas", foreignKey: "discoteca_id"});
  promociones.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(promociones, { as: "promociones", foreignKey: "discoteca_id"});
  reservas.belongsTo(mesas, { as: "mesa", foreignKey: "mesa_id"});
  mesas.hasMany(reservas, { as: "reservas", foreignKey: "mesa_id"});
  historial_pagos.belongsTo(metodos_pagos, { as: "metodo_pago", foreignKey: "metodo_pago_id"});
  metodos_pagos.hasMany(historial_pagos, { as: "historial_pagos", foreignKey: "metodo_pago_id"});
  pagos.belongsTo(metodos_pagos, { as: "metodo_pago", foreignKey: "metodo_pago_id"});
  metodos_pagos.hasMany(pagos, { as: "pagos", foreignKey: "metodo_pago_id"});
  historial_pagos.belongsTo(pagos, { as: "pago", foreignKey: "pago_id"});
  pagos.hasMany(historial_pagos, { as: "historial_pagos", foreignKey: "pago_id"});
  clientes.belongsTo(personas, { as: "persona", foreignKey: "persona_id"});
  personas.hasOne(clientes, { as: "cliente", foreignKey: "persona_id"});
  personal_discotecas.belongsTo(personas, { as: "persona", foreignKey: "persona_id"});
  personas.hasMany(personal_discotecas, { as: "personal_discotecas", foreignKey: "persona_id"});
  reservas.belongsTo(promociones, { as: "promocion", foreignKey: "promocion_id"});
  promociones.hasMany(reservas, { as: "reservas", foreignKey: "promocion_id"});
  historial_reservas.belongsTo(reservas, { as: "reserva", foreignKey: "reserva_id"});
  reservas.hasMany(historial_reservas, { as: "historial_reservas", foreignKey: "reserva_id"});
  pagos.belongsTo(reservas, { as: "reserva", foreignKey: "reserva_id"});
  reservas.hasMany(pagos, { as: "pagos", foreignKey: "reserva_id"});
  reservas_clientes.belongsTo(reservas, { as: "reserva", foreignKey: "reserva_id"});
  reservas.hasMany(reservas_clientes, { as: "reservas_clientes", foreignKey: "reserva_id"});

  return {
    categorias_mesas: categorias_mesas,
    clientes: clientes,
    discotecas: discotecas,
    historial_pagos: historial_pagos,
    historial_reservas: historial_reservas,
    mesas: mesas,
    metodos_pagos: metodos_pagos,
    pagos: pagos,
    personal_discotecas: personal_discotecas,
    personas: personas,
    promociones: promociones,
    reservas: reservas,
    reservas_clientes: reservas_clientes,
  };
}
