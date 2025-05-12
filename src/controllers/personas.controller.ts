import { Request, Response } from 'express';
import * as personaService from '../services/personas.service';

//REGISTRO DE CLIENTE
export const registerCliente = async (req:Request,res:Response)=>{
  try {
    const {
      nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet
    } = req.body;
    const result = await personaService.registerCliente(nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet);
      res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ message: error});
  }
};

//INICIAR SESION DE CLIENTE
export const loginCliente = async(req:Request,res:Response)=>{
  try {
    const {correo,contrasena} = req.body;
    const resultado = await personaService.loginCliente(correo,contrasena);
    res.json(resultado);
  } catch (error) {
    res.status(401).json({message: error});
  }
};

//REGISTRO DE PERSONAL DISCOTECA
export const registerPersonalD = async (req:Request,res:Response)=>{
  try {
    const {
      nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet
    } = req.body;
    const result = await personaService.registerPersonalD(nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet);
      res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ message: error});
  }
};

//LOGIN PERSONAL DISCOTECA
export const loginPersonalD = async(req:Request,res:Response)=>{
  try {
    const {correo,contrasena} = req.body;
    const resultado = await personaService.loginPersonalD(correo,contrasena);
    res.json(resultado);
  } catch (error) {
    res.status(401).json({message: error});
  }
};







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

export const updatePersonaBasico = async (req: Request, res: Response) => {
  try {
    const persona = await personaService.updatePersonaBasico(Number(req.params.id), req.body);
    res.json(persona);
  } catch (error) {
    res.status(403).json({ message: "No autorizado para editar completamente", error });
  }
}

export const updatePersonaAdmin = async (req: Request, res: Response) => {
  try {
    // Validamos que el usuario esté autenticado y sea admin
    const user = await personaService.updatePersonaBasico(Number(req.params.id), req.body);

    if (user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: solo administradores pueden realizar esta acción.' });
    }

    const persona = await personaService.updatePersonaAdmin(Number(req.params.id), req.body);
    res.json(persona);
  } catch (error) {
    res.status(403).json({ message: "Error en edición admin", error });
  }
}



