import { Request, Response } from 'express';
import * as ClienteService from '../services/clientes.services';

export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await ClienteService.obtenerClientes();
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
     const {
      nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet
    } = req.body;

    const nuevo = await ClienteService.registerCliente(nombre_usuario,
      correo,
      contrasena,
      nombre_completo,
      telefono,
      carnet);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error interno del servidor' });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const cliente = await ClienteService.obtenerClientePorId(Number(req.params.id));
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const clienteId = Number(req.params.id);
    const updatedCliente = await ClienteService.updateCliente(clienteId, req.body);
    res.status(200).json(updatedCliente);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const loginCliente = async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body;
    const resultado = await ClienteService.loginCliente(correo, contrasena);
    res.json(resultado);
  } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Error de autenticación' });
  }
}