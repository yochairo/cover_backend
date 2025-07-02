import { Request, Response } from "express";
import * as personalService from "../services/personal.services";

// REGISTRO Y AUTENTICACIÓN ESPECÍFICA
export const registerPersonal = async (req: Request, res: Response) => {
  try {
    const {
      nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet,
      numero_referencia,
      tipo_contrato
    } = req.body;

    const result = await personalService.registerPersonal(
      nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet,
      numero_referencia,
      tipo_contrato
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Error al registrar personal' 
    });
  }
};

export const createPersonalFromPersona = async (req: Request, res: Response) => {
  try {
    const { persona_id, numero_referencia, tipo_contrato, fecha_ingreso } = req.body;

    const personal = await personalService.createPersonalFromPersona(
      persona_id,
      numero_referencia,
      tipo_contrato,
      fecha_ingreso
    );

    res.status(201).json(personal);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Error al crear personal' 
    });
  }
};



export const completePersonalProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const personal = await personalService.updatePersonal(Number(id), updateData);

    res.json({
      message: 'Perfil completado exitosamente',
      personal
    });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Error al completar perfil' 
    });
  }
};

// CRUD PERSONAL


export const getPersonalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const personal = await personalService.getPersonalById(Number(id));

    res.json(personal);
  } catch (error) {
    res.status(404).json({ 
      message: error instanceof Error ? error.message : 'Personal no encontrado' 
    });
  }
};



export const updatePersonal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const personal = await personalService.updatePersonal(Number(id), updateData);

    res.json({
      message: 'Personal actualizado exitosamente',
      personal
    });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Error al actualizar personal' 
    });
  }
};

export const deletePersonal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user; // Del middleware de auth

    const result = await personalService.deletePersonal(Number(id), user?.id);

    res.json(result);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Error al eliminar personal' 
    });
  }
};



// RELACIONES CON DISCOTECAS
export const getPersonalByDiscoteca = async (req: Request, res: Response) => {
  try {
    const { discotecaId } = req.params;
    const personal = await personalService.getPersonalByDiscoteca(Number(discotecaId));

    res.json(personal);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Error al obtener personal de la discoteca' 
    });
  }
};



// LOGIN ESPECÍFICO (mantener compatibilidad)
export const loginPersonalD = async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body;
    const resultado = await personalService.loginPersonalD(correo, contrasena);

    res.json(resultado);
  } catch (error) {
    res.status(401).json({ 
      message: error instanceof Error ? error.message : 'Error de autenticación' 
    });
  }
};