import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { error } from "console";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1h";

export const generateToken = (id: number, rol: string) => {
  return jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: "1h" });
};


export const verifyToken = (token:string)=>{

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token no valido');
    }
};

export const compareContrasenas = (contrasena: string, hash:string)=>{

    return bcrypt.compareSync(contrasena,hash);
}



/* 
export const register = async (
  nombre_usuario: string,
  correo: string,
  contrasena: string,
  nombre_completo: string,
  telefono: string,
  carnet: string,
  rol: string
) => {
  const hashPwrd = await bcrypt.hash(contrasena, 10);

  const newUser = await db.personas.create({
    nombre_usuario,
    correo,
    contrasena: hashPwrd,
    nombre_completo,
    telefono,
    carnet,
    rol,
    estado: "activo",
  });

  const token = generateToken(newUser.id, rol);
  return{user:newUser,token}
};

export const login = async (correo:string, contrasena:string)=>{
    const persona = await db.personas.findOne({where:{correo}});
    if (!persona) throw new Error('Usuario no encontrado');

    const isValid = bcrypt.compareSync(contrasena, String(persona.contrasena));
    if(!isValid) throw new Error('Contraseña incorrecta');

    const token = generateToken(persona.id,String(persona.rol));


    return{user:persona,token};

}
 */