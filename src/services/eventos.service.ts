import { Op } from "sequelize";
import { db } from "../config/db";

export const crearEvento = async (data: {
  discoteca_id: number,
  nombre: string,
  tipo_evento?: string,
  descripcion?: string,
  fecha_inicio?: Date,
  fecha_fin?: Date,
}) => {
  const nuevoEvento = await db.eventos.create({
    ...data,
    estado: 'activo',
    creado_en: new Date(),
  });

  return nuevoEvento;
};

export const obtenerEventos = async () => {
  return await db.eventos.findAll({
    where: { estado:  {
        [Op.ne]: 'eliminado'  // Excluir eliminados
      } },
    include: [{ model: db.discotecas , as: 'discoteca' }] // si deseas traer también datos de la discoteca
  });
};
export const obtenerEventoPorId = async (id: number) => {
  const evento = await db.eventos.findByPk(id, {
    include: [{ model: db.discotecas , as: 'discoteca' }] // si deseas traer también datos de la discoteca
  });
  
  if (!evento) throw new Error('Evento no encontrado');
  return evento;
};

export const actualizarEvento = async (id: number, data: Partial<{
  nombre: string,
  tipo_evento: string,
  descripcion: string,
  fecha_inicio: Date,
  fecha_fin: Date,
}>) => {
  const evento = await db.eventos.findByPk(id);

  if (!evento || evento.estado === 'eliminado') {
    throw new Error('Evento no encontrado o eliminado');
  }

  await evento.update({
    ...data,
    actualizado_en: new Date()
  });

  return evento;
};

export const eliminarEvento = async (id: number) => {
  const evento = await db.eventos.findByPk(id);

  if (!evento || evento.estado === 'eliminado') {
    throw new Error('Evento no encontrado o ya eliminado');
  }

  await evento.update({
    estado: 'eliminado',
    actualizado_en: new Date()
  });

  return { mensaje: 'Evento eliminado correctamente' };
};

export const obtenerEventosPorDiscoteca = async (discoteca_id: number) => {
  const eventos = await db.eventos.findAll({
    where: {
      discoteca_id,
      estado:  {
        [Op.ne]: 'eliminado'  // Excluir eliminados
      }
    },
    order: [['fecha_inicio', 'ASC']],
    include: [{ model: db.discotecas , as: 'discoteca' }]
  });

  return eventos;
};

export const updateEvento = async (id: number, data: any) => {
  const evento = await db.eventos.findByPk(id);

  if (!evento) {
    throw new Error("Evento no encontrado");
  }

  // Campos permitidos para actualizar
  const allowedFields = [
    'nombre',
    'tipo_evento',
    'descripcion',
    'fecha_inicio',
    'fecha_fin',
    'estado'
  ];

  const updateData: any = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  updateData.actualizado_en = new Date(); // Marca de tiempo

  await evento.update(updateData);

  return evento;
};

