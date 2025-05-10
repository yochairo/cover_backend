import { db } from "../config/db";

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