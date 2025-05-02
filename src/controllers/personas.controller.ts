import { Request, Response } from 'express';
import * as personaService from '../services/personas.service';


export const getPersonas = async (req:Request, res: Response) => {
  try {
    const personas = await personaService.getPersonas();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener personas', error });
  }
};





