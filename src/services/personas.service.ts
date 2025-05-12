import { db } from "../config/db";
import bcrypt from 'bcryptjs';
import { generateToken,compareContrasenas } from '../services/auth.service';


export const registerCliente = async (
    nombre_usuario: string,
    correo: string,
    contrasena:string,
    nombre_completo:string,
    telefono: string,
    carnet:string)=>{
        const hashedConstrasena = bcrypt.hashSync(contrasena,10);
        const newPersonaCliente = await db.personas.create({
            nombre_usuario,
            correo,
            contrasena:hashedConstrasena,
            nombre_completo,
            telefono,
            carnet,
            rol:'cliente',
            estado:'activo'
        });
        const token = generateToken(newPersonaCliente.id,'cliente');
        return {persona:newPersonaCliente, token};
};


export const loginCliente = async(correo:string,contrasena:string)=>{
    const personaCliente = await db.personas.findOne({where: {correo,rol:'cliente'}});
    if (!personaCliente) throw new Error('Cliente no encontrado');

    if(!compareContrasenas(contrasena,String(personaCliente.contrasena) )) throw new Error('Constraseña incorrecta');

    const token = generateToken(personaCliente.id,'cliente');
    return {persona:personaCliente,token};
}


//REGISTRO DE PERSONAL DE DISCOTECA
export const registerPersonalD = async (
    nombre_usuario: string,
    correo: string,
    contrasena:string,
    nombre_completo:string,
    telefono: string,
    carnet:string)=>{
        const hashedConstrasena = bcrypt.hashSync(contrasena,10);
        const newPersonaPD = await db.personas.create({
            nombre_usuario,
            correo,
            contrasena:hashedConstrasena,
            nombre_completo,
            telefono,
            carnet,
            rol:'personal',
            estado:'activo'
        });
        const token = generateToken(newPersonaPD.id,'personal');
        return {person:newPersonaPD, token};
};

export const loginPersonalD = async(correo:string,contrasena:string)=>{
    const personalD = await db.personas.findOne({where: {correo,rol:'personal'}});
    if (!personalD) throw new Error('Personal de discoteca no encontrado');

    if(!compareContrasenas(contrasena,String(personalD.contrasena) )) throw new Error('Constraseña incorrecta');

    const token = generateToken(personalD.id,'personal');
    return {persona:personalD,token};
}






















export const getPersonas = async () => {
    return await db.personas.findAll();
};

export const getPersona = async (id:number) => {
    const persona = await db.personas.findByPk(id);

    if (!persona) throw new Error("Persona no encontrada");
    return persona;
};


export const createPersona = async (data:any) => {
    return await db.personas.create(data);
}


export const updatePersonaBasico = async (id: number, data: any) => {
    const persona = await db.personas.findByPk(id);

    if (!persona) {
        throw new Error("Persona no encontrada");
    }

    // Solo campos básicos
    const { nombre_completo, correo, nombre_usuario } = data;

    await persona.update({ nombre_completo, correo, nombre_usuario });
    return persona;
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