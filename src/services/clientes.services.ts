import { db } from "../config/db";
import bcrypt from 'bcryptjs';
import { generateToken, compareContrasenas } from '../services/auth.service';



export const obtenerClientes = async () => {
  return await db.clientes.findAll({
    include: ['persona'], // Relación definida en el modelo Sequelize
  });
};

export const obtenerClientePorId = async (id: number) => {
  const cliente = await db.clientes.findByPk(id, {
    include: ['persona'], // Relación definida en el modelo Sequelize
  });
  if (!cliente) throw new Error('Cliente no encontrado');
  return cliente;
};



export const registerCliente = async (
    nombre_usuario: string,
    correo: string,
    contrasena: string,
    nombre_completo: string,
    telefono: string,
    carnet: string) => {

        const existingCliente = await db.personas.findOne({
            where: {correo: correo.toLowerCase().trim(),rol: 'cliente'}
        })
        if (existingCliente) {
            throw new Error("El correo ya esta registrado");
        }

        const existingUsername = await db.personas.findOne({
            where: {nombre_usuario: nombre_usuario}
        })
        if (existingUsername) {
            throw new Error("El nombre de usuario ya esta registrado");
            
        }
    const hashedConstrasena = bcrypt.hashSync(contrasena, 10);
    const newPersonaCliente = await db.personas.create({
        nombre_usuario,
        correo,
        contrasena: hashedConstrasena,
        nombre_completo,
        telefono,
        carnet,
        rol: 'cliente',
        estado: 'activo'
    });
    const newCliente = await db.clientes.create({
    persona_id: newPersonaCliente.id,
    fecha_registro: new Date(),
    estado: 'activo'
  });
    const token = generateToken(newPersonaCliente.id, 'cliente');
    return { persona: newPersonaCliente,cliente: newCliente, token };
};

export const updateCliente = async (id: number, data: any) => {
  const cliente = await db.clientes.findByPk(id);   
  if (!cliente) throw new Error('Cliente no encontrado');
  const allowedFields = [   'preferencia','fecha_registro','tipo_cliente','fecha_ultima_actualizacion','estado'];
  const updateData: any = {};
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  } );
  await cliente.update(updateData);
  return cliente; 
}

export const loginCliente = async (correo: string, contrasena: string) => {

    // Verificar si el cliente existe
    const personaCliente = await db.personas.findOne({ where: { correo, rol: 'cliente' } });
    if (!personaCliente) throw new Error('Cliente no encontrado');

    // Verificar la contraseña
    const isPasswordValid = !compareContrasenas(contrasena, String(personaCliente.contrasena));
    if (isPasswordValid) throw new Error('Constraseña incorrecta');

    // Verificar si el cliente está activo
    const cliente = await db.clientes.findOne({ where: { persona_id: personaCliente.id } });
    if (!cliente) throw new Error('El usuario no tiene datos como cliente');
    if (cliente.estado !== 'activo') throw new Error('Cliente inactivo');

    // Generar el token
    const token = generateToken(personaCliente.id, 'cliente');

    return {
    persona: {
      id: personaCliente.id,
      nombre_completo: personaCliente.nombre_completo,
      nombre_usuario: personaCliente.nombre_usuario,
      correo: personaCliente.correo,
      telefono: personaCliente.telefono,
      carnet: personaCliente.carnet,
      rol: personaCliente.rol
    },
    cliente: {
      id: cliente.id,
      preferencia: cliente.preferencia,
      tipo_cliente: cliente.tipo_cliente,
      estado: cliente.estado,
      fecha_registro: cliente.fecha_registro
    },
    token
  };
}