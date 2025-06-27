import { db } from "../config/db";
import bcrypt from 'bcryptjs';
import { generateToken, compareContrasenas } from '../services/auth.service';


export const registerCliente = async (
    nombre_usuario: string,
    correo: string,
    contrasena: string,
    nombre_completo: string,
    telefono: string,
    carnet: string) => {


        const existingCliente = await db.personas.findOne({
            where: {correo: correo.toLowerCase().trim(),rol: 'cliente'}
        })
        if (existingCliente) {
            throw new Error("El correo ya esta registrado");
        }


        const existingUsername = await db.personas.findOne({
            where: {nombre_usuario: nombre_usuario}
        })
        if (existingUsername) {
            throw new Error("El nombre de usuario ya esta registrado");
            
        }
    const hashedConstrasena = bcrypt.hashSync(contrasena, 10);
    const newPersonaCliente = await db.personas.create({
        nombre_usuario,
        correo,
        contrasena: hashedConstrasena,
        nombre_completo,
        telefono,
        carnet,
        rol: 'cliente',
        estado: 'activo'
    });
    const token = generateToken(newPersonaCliente.id, 'cliente');
    return { persona: newPersonaCliente, token };
};


export const loginCliente = async (correo: string, contrasena: string) => {
    const personaCliente = await db.personas.findOne({ where: { correo, rol: 'cliente' } });
    if (!personaCliente) throw new Error('Cliente no encontrado');

    if (!compareContrasenas(contrasena, String(personaCliente.contrasena))) throw new Error('Constraseña incorrecta');

    const token = generateToken(personaCliente.id, 'cliente');
    return { persona: personaCliente, token };
}


//REGISTRO DE PERSONAL DE DISCOTECA
export const registerPersonalD = async (
    nombre_usuario: string,
    correo: string,
    contrasena: string,
    nombre_completo: string,
    telefono: string,
    carnet: string) => {
    // Verificar si el usuario ya existe     
    const existingUser = await db.personas.findOne({
        where: { correo: correo.toLowerCase().trim(), rol: 'personal' }
    });

    if (existingUser) {
        throw new Error('El correo ya esta registrado como personal');
    }
    // Verificar si el nombre de usuario ya existe
    const existingUsername = await db.personas.findOne({
        where: { nombre_usuario: nombre_usuario }
    })
    if (existingUsername) {
        throw new Error("El nombre de usuario ya esta registrado");
    }

    const hashedConstrasena = bcrypt.hashSync(contrasena, 10);
    const newPersonaPD = await db.personas.create({
        nombre_usuario,
        correo: correo.toLowerCase().trim(),
        contrasena: hashedConstrasena,
        nombre_completo,
        telefono,
        carnet,
        rol: 'personal',
        estado: 'activo'
    });
    const token = generateToken(newPersonaPD.id, 'personal');
    // quitar la contrasena antes de enviar 
    const { contrasena: _, ...personaSinPassword } = newPersonaPD.toJSON();

    return { persona: personaSinPassword, token };
};

export const loginPersonalD = async (correo: string, contrasena: string) => {
    const personalD = await db.personas.findOne({ where: { correo, rol: 'personal' } });
    if (!personalD) throw new Error('Personal de discoteca no encontrado');

    if (!compareContrasenas(contrasena, String(personalD.contrasena))) throw new Error('Constraseña incorrecta');

    const token = generateToken(personalD.id, 'personal');
    return { persona: personalD, token };
}






















export const getPersonas = async () => {
    return await db.personas.findAll();
};

export const getPersona = async (id: number) => {
    const persona = await db.personas.findByPk(id);

    if (!persona) throw new Error("Persona no encontrada");
    return persona;
};


export const createPersona = async (data: any) => {
    return await db.personas.create(data);
}


export const updatePersonaBasico = async (id: number, data: any) => {
  const persona = await db.personas.findByPk(id);

  if (!persona) {
    throw new Error("Persona no encontrada");
  }

  // Solo campos básicos permitidos
  const allowedFields = ['nombre_completo', 'correo', 'nombre_usuario', 'telefono'];
  const updateData: any = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = field === 'correo' ? data[field].toLowerCase().trim() : data[field];
    }
  });

  await persona.update(updateData);
  
  const { contrasena: _, ...personaSinPassword } = persona.toJSON();
  return personaSinPassword;
};

export const updatePersonaAdmin = async (id: number, data: any) => {
    const persona = await db.personas.findByPk(id);

    if (!persona) {
        throw new Error("Persona no encontrada");
    }

    // Admin puede actualizar todo
    await persona.update(data);
    return persona;
};