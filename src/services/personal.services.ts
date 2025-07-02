import { db } from "../config/db";
import bcrypt from 'bcryptjs';
import { generateToken,compareContrasenas } from "./auth.service";
import { Op } from "sequelize";

export const registerPersonal = async (
    nombre_usuario: string,
    correo: string,
    contrasena: string,
    nombre_completo: string,
    telefono: string,
    carnet: string,
    numero_referencia?: string,
    tipo_contrato?: string
) => {
    try {
        const existingPersonal = await db.personas.findOne({
            where: { correo: correo, rol: 'personal' }
        })
        if (existingPersonal) {
            throw new Error('El correo ya esta registrado como personal');
        }

        const existingUsername = await db.personas.findOne({
            where: { nombre_usuario: nombre_usuario }
        })
        if (existingUsername) {
            throw new Error('El nombre de ususario ya esta regsitrado');
        }

        const hashedConstrasena = bcrypt.hashSync(contrasena, 10);
        const newPersona = await db.personas.create({
            nombre_usuario,
            correo,
            contrasena: hashedConstrasena,
            nombre_completo,
            telefono,
            carnet,
            rol: 'personal',
            estado: 'activo'
        });


        const newPersonal = await db.personal.create({
            persona_id: newPersona.id,
            numero_referencia: numero_referencia,
            tipo_contrato: tipo_contrato,
            fecha_ingreso: new Date().toISOString().split('T')[0],
            activo: true
        });

        const token = generateToken(newPersona.id, 'personal');

        // Quitar contraseña antes de enviar
        const { contrasena: _, ...personaSinPassword } = newPersona.toJSON();

        return {
            persona: personaSinPassword,
            personal: newPersonal,
            token
        };
    } catch (error) {
        throw error;
    }
}

export const createPersonalFromPersona = async (
  persona_id: number,
  numero_referencia?: string,
  tipo_contrato?: string,
  fecha_ingreso?: string
) => {
  // Verificar que la persona existe
  const persona = await db.personas.findByPk(persona_id);
  if (!persona) {
    throw new Error('Persona no encontrada');
  }

  // Verificar que no existe ya un personal para esta persona
  const existingPersonal = await db.personal.findOne({ 
    where: { persona_id } 
  });
  
  if (existingPersonal) {
    throw new Error('Ya existe un registro de personal para esta persona');
  }

  // Crear registro de personal
  const newPersonal = await db.personal.create({
    persona_id,
    numero_referencia: numero_referencia || `PER${persona_id.toString().padStart(4, '0')}`,
    tipo_contrato: tipo_contrato || 'permanente',
    fecha_ingreso: fecha_ingreso || new Date().toISOString().split('T')[0],
    activo: true
  });

  return newPersonal;
};


//CRUD DE PERSONAL
export const getAllPersonal = async () => {
    return await db.personal.findAll({
        include: ['persona'],
    });
}

export const getPersonalById = async (id: number) => {

    try {
        const personal = await db.personal.findByPk(id, {
            include: ['persona']
        });
        if (!personal) {
            throw new Error('Personal no encontrado');
        }

        return personal;

    } catch (error) {
        throw error;
    }

}

export const updatePersonal = async (id: number, data: any) => {

    try {
        const personal = await db.personal.findByPk(id);
        if (!personal) {
            throw new Error('Personal no encontrado');
        }
        const allowedFields = [
            'numero_referencia',
            'tipo_contrato',
            'fecha_ingreso',
            'activo'
        ];

        const updateData: any = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        updateData.actualizado_en = new Date();
        await personal.update(updateData);
        return await getPersonalById(id);


    } catch (error) {
        throw error;
    }
}

export const deletePersonal = async (id: number, usuario_id?: number) => {
  const personal = await db.personal.findByPk(id);

  if (!personal) {
    throw new Error('Personal no encontrado');
  }

  // Verificar relaciones activas
  const hasActiveRelations = await checkActiveRelations(id);
  if (hasActiveRelations) {
    throw new Error('No se puede eliminar: tiene relaciones activas con discotecas');
  }

  // Soft delete - marcar como inactivo
  await personal.update({ 
    activo: false,
    actualizado_en: new Date()
  });

  // Log de auditoría (opcional)
  if (usuario_id) {
    // Aquí podrías agregar log de auditoría
    console.log(`Personal ${id} eliminado por usuario ${usuario_id}`);
  }

  return { message: 'Personal eliminado exitosamente' };
};

export const checkActiveRelations = async (personal_id: number) => {
  const activeRelations = await db.personal_discotecas.count({
    where: { personal_id }
  });

  return activeRelations > 0;
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


// LOGIN ESPECÍFICO (mantener compatibilidad)
export const loginPersonalD = async (correo: string, contrasena: string) => {
  // Verificar si el personal existe
  const persona = await db.personas.findOne({ 
    where: { correo: correo.toLowerCase().trim(), rol: 'personal' } 
  });
  
  if (!persona) {
    throw new Error('Personal no encontrado');
  }

  // Verificar la contraseña
  if (!compareContrasenas(contrasena, String(persona.contrasena))) {
    throw new Error('Contraseña incorrecta');
  }

  // Verificar si tiene registro de personal
  const personal = await db.personal.findOne({ 
    where: { persona_id: persona.id },
    include: [
      {
        model: db.personal_discotecas,
        as: 'personal_discotecas',
        include: [
          {
            model: db.discotecas,
            as: 'discoteca',
            attributes: ['id', 'nombre']
          }
        ]
      }
    ]
  });

  if (!personal) {
    throw new Error('El usuario no tiene datos como personal');
  }

  if (!personal.activo) {
    throw new Error('Personal inactivo');
  }

  // Generar el token
  const token = generateToken(persona.id, 'personal');

  return {
    persona: {
      id: persona.id,
      nombre_completo: persona.nombre_completo,
      nombre_usuario: persona.nombre_usuario,
      correo: persona.correo,
      telefono: persona.telefono,
      carnet: persona.carnet,
      rol: persona.rol
    },
    personal: {
      id: personal.id,
      numero_referencia: personal.numero_referencia,
      tipo_contrato: personal.tipo_contrato,
      fecha_ingreso: personal.fecha_ingreso,
      activo: personal.activo,
      discotecas: personal.personal_discotecas
    },
    token
  };
};