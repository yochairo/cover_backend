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
