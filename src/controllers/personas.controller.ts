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

export const getPersona = async (req:Request,res:Response)=>{
  try {
    const persona = await personaService.getPersona(Number(req.params.id));
    res.json(persona);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener persona', error });

  }
}

export const create = async (req:Request, res: Response) => {
  try {
    const persona = await personaService.createPersona(req.body);
    res.json(persona);
  } catch (error) {
    res.status(404).json({ message: "Error al crear persona",error });

  }
}





