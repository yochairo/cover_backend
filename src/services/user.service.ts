import db from '../config/db';
import { User } from '../model/user.model';

export const getAllUsers = async (): Promise<User[]> => {
    const { rows } = await db.query('SELECT id, nombre_completo AS nombre, correo, nombre_usuario AS usuario, rol, estado FROM personas');
    return rows as User[];
};
