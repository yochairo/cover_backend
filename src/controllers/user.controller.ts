import { Request, Response } from 'express';
import { getAllUsers } from '../services/user.service';

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};