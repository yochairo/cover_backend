import { Request, Response } from 'express';
import * as discotecaService from '../services/discotecas.service';

export const crearDiscoteca = async (req: Request, res: Response) => {
  try {
    const discoteca = await discotecaService.crearDiscoteca(req.body);
    res.status(201).json({
      success: true,
      message: 'Discoteca creada exitosamente',
      data: discoteca
    });
  } catch (error) {
    console.error('Error al crear discoteca:', error);
    res.status(400).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};

export const obtenerDiscotecas = async (req: Request, res: Response) => {
  try {
    const discotecas = await discotecaService.obtenerDiscotecas();
    res.status(200).json({ discotecas });
  } catch (error) {
    console.error('Error al obtener discotecas:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};

export const obtenerDiscotecaPorId = async (req: Request, res: Response) => {
  try {
    const discoteca = await discotecaService.obtenerDiscotecaPorId(Number(req.params.id));
    res.status(200).json({
      success: true,
      data: discoteca
    });
  } catch (error) {
    console.error('Error al obtener discoteca por ID:', error);
    res.status(404).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};

export const actualizarDiscoteca = async (req: Request, res: Response) => {
  try {  
    const discotecaId = Number(req.params.id);
    const updatedDiscoteca = await discotecaService.actualizarDiscoteca(discotecaId, req.body);
    res.status(200).json({
      success: true,
      message: 'Discoteca actualizada exitosamente',
      data: updatedDiscoteca
    });   
  } catch (error) {
    console.error('Error al actualizar discoteca:', error);  
    res.status(400).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};

export const eliminarDiscoteca = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const resultado = await discotecaService.eliminarDiscoteca(id);
    res.status(200).json({
      success: true,
      message: resultado.mensaje
    });
  } catch (error) {
    console.error('Error al eliminar discoteca:', error);
    res.status(400).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};

export const obtenerDiscotecasActivas = async (req: Request, res: Response) => {
  try {
    const discotecas = await discotecaService.obtenerDiscotecasActivas();
    res.status(200).json({
      success: true,
      data: discotecas
    });
  } catch (error) {
    console.error('Error al obtener discotecas activas:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};

export const buscarDiscotecas = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda requerido'
      });
    }

    const discotecas = await discotecaService.buscarDiscotecas(q);
    res.status(200).json({
      success: true,
      data: discotecas
    });
  } catch (error) {
    console.error('Error al buscar discotecas:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
};
