import { Request, Response } from 'express';
import * as eventoService from '../services/eventos.service';

export const crearEvento = async (req: Request, res: Response) => {
  try {
    const evento = await eventoService.crearEvento(req.body);
     res.status(201).json(evento);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error interno del servidor' });
  }
};
export const obtenerEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await eventoService.obtenerEventos();
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({message: error instanceof Error ? error.message : 'Error interno del servidor' });
  }
};

export const obtenerEventoPorId = async (req: Request, res: Response) => {
  try {
    const evento = await eventoService.obtenerEventoPorId(Number(req.params.id));
    res.status(200).json(evento);
  } catch (error) {
    console.error('Error al obtener evento por ID:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error interno del servidor' });
  }
};

export const actualizarEvento = async (req: Request, res: Response) => {
  try {  
    const eventoId = Number(req.params.id);
    const updatedEvento = await eventoService.actualizarEvento(eventoId, req.body);
    res.status(200).json(updatedEvento);   
  } catch (error) {
    console.error('Error al actualizar evento:', error);  
    res.status(500).json({ message: error instanceof Error ? error.message : 'Error interno del servidor' });
    }
};

export const eliminarEvento = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await eventoService.eliminarEvento(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Error interno del servidor' });
  }
};

export const obtenerEventosPorDiscoteca = async (req: Request<{ discoteca_id: string }>, res: Response) => {
  try {
    const discotecaId = parseInt(req.params.discoteca_id); // 👈 CONVERSIÓN

    if (isNaN(discotecaId)) {
      return res.status(400).json({ message: 'ID de discoteca inválido' });
    }

    const eventos = await eventoService.obtenerEventosPorDiscoteca(discotecaId);
    res.status(200).json(eventos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
