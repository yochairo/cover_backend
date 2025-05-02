import { db } from "../config/db";

export const getPersonas = async () => {
    return await db.personas.findAll();
};

export const getPersona = async (id:number) => {
    const persona = await db.personas.findByPk(id);

    if (!persona) throw new Error("Persona no encontrada");
    return persona;
};



/* import { User } from '../models/user.model';

export const getAllUsers = async (): Promise<User[]> => {
    const { rows } = await db.query('SELECT id, nombre_completo AS nombre, correo, nombre_usuario AS usuario, rol, estado FROM personas');
    return rows as User[];
};
 */