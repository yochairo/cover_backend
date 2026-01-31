import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../entities/persona.entity';
import { Cliente } from '../entities/cliente.entity';
import { AuthService } from '../auth/auth.service';
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { RegisterPersonalDto } from './dto/register-personal.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private authService: AuthService,
  ) {}

  async registerCliente(dto: RegisterClienteDto) {
    // Verificar si el correo ya existe
    const existingCliente = await this.personaRepository.findOne({
      where: { correo: dto.correo.toLowerCase().trim(), rol: 'cliente' },
    });

    if (existingCliente) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Verificar si el nombre de usuario ya existe
    const existingUsername = await this.personaRepository.findOne({
      where: { nombre_usuario: dto.nombre_usuario },
    });

    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    // Hash de contraseña
    const hashedPassword = await this.authService.hashPassword(dto.contrasena);

    // Crear persona
    const newPersona = this.personaRepository.create({
      nombre_usuario: dto.nombre_usuario,
      correo: dto.correo.toLowerCase().trim(),
      contrasena: hashedPassword,
      nombre_completo: dto.nombre_completo,
      telefono: dto.telefono,
      carnet: dto.carnet,
      rol: 'cliente',
      estado: 'activo',
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    const savedPersona = await this.personaRepository.save(newPersona);

    // Crear registro de cliente
    const newCliente = this.clienteRepository.create({
      persona_id: savedPersona.id,
      fecha_registro: new Date(),
    });

    await this.clienteRepository.save(newCliente);

    // Generar token
    const token = this.authService.generateToken(savedPersona.id, 'cliente');

    // Eliminar contraseña antes de retornar
    const { contrasena, ...personaSinPassword } = savedPersona;

    return { persona: personaSinPassword, token };
  }

  async loginCliente(dto: LoginDto) {
    if (!dto.correo || !dto.contrasena) {
      throw new BadRequestException('Correo y contraseña son obligatorios');
    }

    const persona = await this.personaRepository.findOne({
      where: { correo: dto.correo, rol: 'cliente', estado: 'activo' },
    });

    if (!persona) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const isPasswordValid = await this.authService.comparePasswords(
      dto.contrasena,
      persona.contrasena,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const token = this.authService.generateToken(persona.id, 'cliente');

    const { contrasena, ...personaSinPassword } = persona;

    return { persona: personaSinPassword, token };
  }

  async registerPersonal(dto: RegisterPersonalDto) {
    // Verificar si el correo ya existe
    const existingPersonal = await this.personaRepository.findOne({
      where: { correo: dto.correo.toLowerCase().trim(), rol: 'personal' },
    });

    if (existingPersonal) {
      throw new ConflictException(
        'El correo ya está registrado como personal',
      );
    }

    // Verificar si el nombre de usuario ya existe
    const existingUsername = await this.personaRepository.findOne({
      where: { nombre_usuario: dto.nombre_usuario },
    });

    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    // Hash de contraseña
    const hashedPassword = await this.authService.hashPassword(dto.contrasena);

    // Crear persona
    const newPersona = this.personaRepository.create({
      nombre_usuario: dto.nombre_usuario,
      correo: dto.correo.toLowerCase().trim(),
      contrasena: hashedPassword,
      nombre_completo: dto.nombre_completo,
      telefono: dto.telefono,
      carnet: dto.carnet,
      rol: 'personal',
      estado: 'activo',
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    const savedPersona = await this.personaRepository.save(newPersona);

    // Generar token
    const token = this.authService.generateToken(savedPersona.id, 'personal');

    // Eliminar contraseña antes de retornar
    const { contrasena, ...personaSinPassword } = savedPersona;

    return { persona: personaSinPassword, token };
  }

  async loginPersonal(dto: LoginDto) {
    const persona = await this.personaRepository.findOne({
      where: { correo: dto.correo, rol: 'personal' },
    });

    if (!persona) {
      throw new NotFoundException('Personal de discoteca no encontrado');
    }

    const isPasswordValid = await this.authService.comparePasswords(
      dto.contrasena,
      persona.contrasena,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const token = this.authService.generateToken(persona.id, 'personal');

    const { contrasena, ...personaSinPassword } = persona;

    return { persona: personaSinPassword, token };
  }

  async findAll() {
    return await this.personaRepository.find();
  }

  async findOne(id: number) {
    const persona = await this.personaRepository.findOne({ where: { id } });

    if (!persona) {
      throw new NotFoundException('Persona no encontrada');
    }

    const { contrasena, ...personaSinPassword } = persona;
    return personaSinPassword;
  }
}
