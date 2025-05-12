import { Request,Response, NextFunction } from "express";
import jwt  from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const verifyAuth = (req:Request,res:Response,next: NextFunction): void =>{


    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        
           res.status(401).json({message: 'Acceso denegado: token no proporcionado'});
           return;
    }

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message: 'Token no valido o expirado'});
        return;
    }
};