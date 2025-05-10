import type { Sequelize } from "sequelize";
import { anuncios as _anuncios } from "./anuncios";
import type { anunciosAttributes, anunciosCreationAttributes } from "./anuncios";
import { auditoria_pagos as _auditoria_pagos } from "./auditoria_pagos";
import type { auditoria_pagosAttributes, auditoria_pagosCreationAttributes } from "./auditoria_pagos";
import { auditoria_reservas as _auditoria_reservas } from "./auditoria_reservas";
import type { auditoria_reservasAttributes, auditoria_reservasCreationAttributes } from "./auditoria_reservas";
import { categorias_entradas as _categorias_entradas } from "./categorias_entradas";
import type { categorias_entradasAttributes, categorias_entradasCreationAttributes } from "./categorias_entradas";
import { categorias_mesas as _categorias_mesas } from "./categorias_mesas";
import type { categorias_mesasAttributes, categorias_mesasCreationAttributes } from "./categorias_mesas";
import { clientes as _clientes } from "./clientes";
import type { clientesAttributes, clientesCreationAttributes } from "./clientes";
import { detalles_reserva as _detalles_reserva } from "./detalles_reserva";
import type { detalles_reservaAttributes, detalles_reservaCreationAttributes } from "./detalles_reserva";
import { discotecas as _discotecas } from "./discotecas";
import type { discotecasAttributes, discotecasCreationAttributes } from "./discotecas";
import { entradas as _entradas } from "./entradas";
import type { entradasAttributes, entradasCreationAttributes } from "./entradas";
import { eventos as _eventos } from "./eventos";
import type { eventosAttributes, eventosCreationAttributes } from "./eventos";
import { mesas as _mesas } from "./mesas";
import type { mesasAttributes, mesasCreationAttributes } from "./mesas";
import { metodos_pago as _metodos_pago } from "./metodos_pago";
import type { metodos_pagoAttributes, metodos_pagoCreationAttributes } from "./metodos_pago";
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
  _anuncios as anuncios,
  _auditoria_pagos as auditoria_pagos,
  _auditoria_reservas as auditoria_reservas,
  _categorias_entradas as categorias_entradas,
  _categorias_mesas as categorias_mesas,
  _clientes as clientes,
  _detalles_reserva as detalles_reserva,
  _discotecas as discotecas,
  _entradas as entradas,
  _eventos as eventos,
  _mesas as mesas,
  _metodos_pago as metodos_pago,
  _pagos as pagos,
  _personal_discotecas as personal_discotecas,
  _personas as personas,
  _promociones as promociones,
  _reservas as reservas,
  _reservas_clientes as reservas_clientes,
};

export type {
  anunciosAttributes,
  anunciosCreationAttributes,
  auditoria_pagosAttributes,
  auditoria_pagosCreationAttributes,
  auditoria_reservasAttributes,
  auditoria_reservasCreationAttributes,
  categorias_entradasAttributes,
  categorias_entradasCreationAttributes,
  categorias_mesasAttributes,
  categorias_mesasCreationAttributes,
  clientesAttributes,
  clientesCreationAttributes,
  detalles_reservaAttributes,
  detalles_reservaCreationAttributes,
  discotecasAttributes,
  discotecasCreationAttributes,
  entradasAttributes,
  entradasCreationAttributes,
  eventosAttributes,
  eventosCreationAttributes,
  mesasAttributes,
  mesasCreationAttributes,
  metodos_pagoAttributes,
  metodos_pagoCreationAttributes,
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
  const anuncios = _anuncios.initModel(sequelize);
  const auditoria_pagos = _auditoria_pagos.initModel(sequelize);
  const auditoria_reservas = _auditoria_reservas.initModel(sequelize);
  const categorias_entradas = _categorias_entradas.initModel(sequelize);
  const categorias_mesas = _categorias_mesas.initModel(sequelize);
  const clientes = _clientes.initModel(sequelize);
  const detalles_reserva = _detalles_reserva.initModel(sequelize);
  const discotecas = _discotecas.initModel(sequelize);
  const entradas = _entradas.initModel(sequelize);
  const eventos = _eventos.initModel(sequelize);
  const mesas = _mesas.initModel(sequelize);
  const metodos_pago = _metodos_pago.initModel(sequelize);
  const pagos = _pagos.initModel(sequelize);
  const personal_discotecas = _personal_discotecas.initModel(sequelize);
  const personas = _personas.initModel(sequelize);
  const promociones = _promociones.initModel(sequelize);
  const reservas = _reservas.initModel(sequelize);
  const reservas_clientes = _reservas_clientes.initModel(sequelize);

  entradas.belongsTo(categorias_entradas, { as: "categorium", foreignKey: "categoria_id"});
  categorias_entradas.hasMany(entradas, { as: "entradas", foreignKey: "categoria_id"});
  mesas.belongsTo(categorias_mesas, { as: "categorium", foreignKey: "categoria_id"});
  categorias_mesas.hasMany(mesas, { as: "mesas", foreignKey: "categoria_id"});
  pagos.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(pagos, { as: "pagos", foreignKey: "cliente_id"});
  reservas.belongsTo(clientes, { as: "cliente_organizador", foreignKey: "cliente_organizador_id"});
  clientes.hasMany(reservas, { as: "reservas", foreignKey: "cliente_organizador_id"});
  reservas_clientes.belongsTo(clientes, { as: "cliente", foreignKey: "cliente_id"});
  clientes.hasMany(reservas_clientes, { as: "reservas_clientes", foreignKey: "cliente_id"});
  anuncios.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(anuncios, { as: "anuncios", foreignKey: "discoteca_id"});
  entradas.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(entradas, { as: "entradas", foreignKey: "discoteca_id"});
  eventos.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(eventos, { as: "eventos", foreignKey: "discoteca_id"});
  mesas.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(mesas, { as: "mesas", foreignKey: "discoteca_id"});
  personal_discotecas.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(personal_discotecas, { as: "personal_discotecas", foreignKey: "discoteca_id"});
  promociones.belongsTo(discotecas, { as: "discoteca", foreignKey: "discoteca_id"});
  discotecas.hasMany(promociones, { as: "promociones", foreignKey: "discoteca_id"});
  reservas.belongsTo(mesas, { as: "mesa", foreignKey: "mesa_id"});
  mesas.hasMany(reservas, { as: "reservas", foreignKey: "mesa_id"});
  pagos.belongsTo(metodos_pago, { as: "metodo_pago", foreignKey: "metodo_pago_id"});
  metodos_pago.hasMany(pagos, { as: "pagos", foreignKey: "metodo_pago_id"});
  clientes.belongsTo(personas, { as: "persona", foreignKey: "persona_id"});
  personas.hasMany(clientes, { as: "clientes", foreignKey: "persona_id"});
  personal_discotecas.belongsTo(personas, { as: "persona", foreignKey: "persona_id"});
  personas.hasMany(personal_discotecas, { as: "personal_discotecas", foreignKey: "persona_id"});
  reservas.belongsTo(promociones, { as: "promocion", foreignKey: "promocion_id"});
  promociones.hasMany(reservas, { as: "reservas", foreignKey: "promocion_id"});
  detalles_reserva.belongsTo(reservas, { as: "reserva", foreignKey: "reserva_id"});
  reservas.hasOne(detalles_reserva, { as: "detalles_reserva", foreignKey: "reserva_id"});
  pagos.belongsTo(reservas, { as: "reserva", foreignKey: "reserva_id"});
  reservas.hasMany(pagos, { as: "pagos", foreignKey: "reserva_id"});
  reservas_clientes.belongsTo(reservas, { as: "reserva", foreignKey: "reserva_id"});
  reservas.hasMany(reservas_clientes, { as: "reservas_clientes", foreignKey: "reserva_id"});

  return {
    anuncios: anuncios,
    auditoria_pagos: auditoria_pagos,
    auditoria_reservas: auditoria_reservas,
    categorias_entradas: categorias_entradas,
    categorias_mesas: categorias_mesas,
    clientes: clientes,
    detalles_reserva: detalles_reserva,
    discotecas: discotecas,
    entradas: entradas,
    eventos: eventos,
    mesas: mesas,
    metodos_pago: metodos_pago,
    pagos: pagos,
    personal_discotecas: personal_discotecas,
    personas: personas,
    promociones: promociones,
    reservas: reservas,
    reservas_clientes: reservas_clientes,
  };
}
