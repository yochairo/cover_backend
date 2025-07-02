import { Op } from "sequelize";
import { db } from "../config/db";

export const crearDiscoteca = async (data: {
  nombre: string;
  direccion?: string;
  telefono?: string;
  correo_contacto?: string;
  capacidad_total?: number;
  horario_apertura?: string;
  horario_cierre?: string;
}) => {
  const existingDiscoteca = await db.discotecas.findOne({
    where: { 
      nombre: data.nombre.trim(),
      estado: {
        [Op.ne]: 'eliminado'
      }
    }
  });

  if (existingDiscoteca) {
    throw new Error("Ya existe una discoteca con ese nombre");
  }

  const nuevaDiscoteca = await db.discotecas.create({
    ...data,
    nombre: data.nombre.trim(),
    correo_contacto: data.correo_contacto?.toLowerCase().trim(),
    estado: 'activo',
    creado_en: new Date(),
  });

  return nuevaDiscoteca;
};

export const obtenerDiscotecas = async () => {
  return await db.discotecas.findAll({
    where: { 
      estado: {
        [Op.ne]: 'eliminado'  // Excluir eliminados
      } 
    },
  });
};

export const obtenerDiscotecaPorId = async (id: number) => {
  const discoteca = await db.discotecas.findByPk(id);
  
  if (!discoteca || discoteca.estado === 'eliminado') {
    throw new Error('Discoteca no encontrada');
  }
  
  return discoteca;
};

export const actualizarDiscoteca = async (id: number, data: Partial<{
  nombre: string;
  direccion: string;
  telefono: string;
  correo_contacto: string;
  capacidad_total: number;
  horario_apertura: string;
  horario_cierre: string;
  estado: string;
}>) => {
  const discoteca = await db.discotecas.findByPk(id);

  if (!discoteca || discoteca.estado === 'eliminado') {
    throw new Error('Discoteca no encontrada o eliminada');
  }

  // Si se está actualizando el nombre, verificar que no exista otra discoteca con ese nombre
  if (data.nombre && data.nombre.trim() !== discoteca.nombre) {
    const existingDiscoteca = await db.discotecas.findOne({
      where: { 
        nombre: data.nombre.trim(),
        id: { [Op.ne]: id },
        estado: { [Op.ne]: 'eliminado' }
      }
    });

    if (existingDiscoteca) {
      throw new Error("Ya existe una discoteca con ese nombre");
    }
  }

  // Preparar datos para actualizar
  const updateData: any = {};
  const allowedFields = [
    'nombre', 'direccion', 'telefono', 'correo_contacto', 
    'capacidad_total', 'horario_apertura', 'horario_cierre', 'estado'
  ];

  allowedFields.forEach(field => {
    if (data[field as keyof typeof data] !== undefined) {
      if (field === 'nombre' && data.nombre) {
        updateData[field] = data.nombre.trim();
      } else if (field === 'correo_contacto' && data.correo_contacto) {
        updateData[field] = data.correo_contacto.toLowerCase().trim();
      } else {
        updateData[field] = data[field as keyof typeof data];
      }
    }
  });

  await discoteca.update(updateData);
  return discoteca;
};

export const eliminarDiscoteca = async (id: number) => {
  const discoteca = await db.discotecas.findByPk(id);

  if (!discoteca || discoteca.estado === 'eliminado') {
    throw new Error('Discoteca no encontrada o ya eliminada');
  }

  await discoteca.update({
    estado: 'eliminado'
  });

  return { mensaje: 'Discoteca eliminada correctamente' };
};

export const obtenerDiscotecasActivas = async () => {
  return await db.discotecas.findAll({
    where: { estado: 'activo' },
    order: [['nombre', 'ASC']]
  });
};

export const buscarDiscotecas = async (termino: string) => {
  return await db.discotecas.findAll({
    where: {
      [Op.and]: [
        {
          estado: {
            [Op.ne]: 'eliminado'
          }
        },
        {
          [Op.or]: [
            { nombre: { [Op.iLike]: `%${termino}%` } },
            { direccion: { [Op.iLike]: `%${termino}%` } }
          ]
        }
      ]
    },
    order: [['nombre', 'ASC']]
  });
};



export const getPersonalByDiscoteca = async (discoteca_id: number) => {
  const personal = await db.personal.findAll({
    include: [
      {
        model: db.personas,
        as: 'persona',
        attributes: ['id', 'nombre_completo', 'correo', 'telefono']
      },
      {
        model: db.personal_discotecas,
        as: 'personal_discotecas',
        where: { discoteca_id },
        include: [
          {
            model: db.discotecas,
            as: 'discoteca',
            attributes: ['id', 'nombre']
          }
        ]
      }
    ],
    where: { activo: true }
  });

  return personal;
};
