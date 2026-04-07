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
import { Personal } from '../entities/personal.entity';
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
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
    private authService: AuthService,
  ) {}

  async registerCliente(dto: RegisterClienteDto) {
    return this.register(dto, 'cliente');
  }

  async loginCliente(dto: LoginDto) {
    return this.login(dto, 'cliente');
  }

  async registerPersonal(dto: RegisterPersonalDto) {
    return this.register(dto, 'personal');
  }

  async loginPersonal(dto: LoginDto) {
    return this.login(dto, 'personal');
  }

  async findAll() {
    return await this.personaRepository.find();
  }

  async findOne(id: number) {
    const persona = await this.personaRepository.findOne({ where: { id } });

    if (!persona) {
      throw new NotFoundException('Persona no encontrada');
    }

    const { contrasena_hash, ...personaSinPassword } = persona;
    return personaSinPassword;
  }

  // ==================== MÉTODOS PRIVADOS HELPERS ====================

  private async validateUniqueEmail(correo: string, rol: string): Promise<void> {
    const existing = await this.personaRepository.findOne({
      where: { correo: correo.toLowerCase().trim(), rol },
    });

    if (existing) {
      const rolName = rol === 'cliente' ? 'cliente' : 'personal';
      throw new ConflictException(`El correo ya está registrado como ${rolName}`);
    }
  }

  private async validateUniqueUsername(nombre_usuario: string): Promise<void> {
    const existing = await this.personaRepository.findOne({
      where: { nombre_usuario },
    });

    if (existing) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }
  }

  private async createPersona(
    dto: RegisterClienteDto | RegisterPersonalDto,
    hashedPassword: string,
    rol: string,
  ): Promise<Persona> {
    const newPersona = this.personaRepository.create({
      nombre_usuario: dto.nombre_usuario,
      correo: dto.correo.toLowerCase().trim(),
      contrasena_hash: hashedPassword,
      nombre_completo: dto.nombre_completo,
      telefono: dto.telefono,
      carnet: dto.carnet,
      fecha_nacimiento: dto.fecha_nacimiento ? new Date(dto.fecha_nacimiento) : undefined,
      foto_perfil_url: dto.foto_perfil_url,
      rol,
      estado: 'activo',
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    return await this.personaRepository.save(newPersona);
  }

  private async createClienteRecord(persona_id: number): Promise<void> {
    const newCliente = this.clienteRepository.create({
      persona_id,
      fecha_registro: new Date(),
    });
    await this.clienteRepository.save(newCliente);
  }

  private async createPersonalRecord(persona_id: number): Promise<void> {
    const newPersonal = this.personalRepository.create({
      persona_id,
      fecha_ingreso: new Date(),
      activo: true,
    });
    await this.personalRepository.save(newPersonal);
  }

  private generateAuthResponse(
    persona: Persona,
    rol: string,
  ): { persona: Partial<Persona>; token: string } {
    const token = this.authService.generateToken(persona.id, rol);
    const { contrasena_hash, ...personaSinPassword } = persona;
    return { persona: personaSinPassword, token };
  }

  // ==================== MÉTODOS GENÉRICOS ====================

  private async register(
    dto: RegisterClienteDto | RegisterPersonalDto,
    rol: 'cliente' | 'personal',
  ) {
    // Validaciones
    await this.validateUniqueEmail(dto.correo, rol);
    await this.validateUniqueUsername(dto.nombre_usuario);

    // Crear persona
    const hashedPassword = await this.authService.hashPassword(dto.contrasena);
    const savedPersona = await this.createPersona(dto, hashedPassword, rol);

    // Crear registro específico según rol
    if (rol === 'cliente') {
      await this.createClienteRecord(savedPersona.id);
    } else {
      await this.createPersonalRecord(savedPersona.id);
    }

    // Generar token y retornar
    return this.generateAuthResponse(savedPersona, rol);
  }

  private async login(dto: LoginDto, rol: 'cliente' | 'personal') {
    // Validación de campos requeridos
    if (!dto.correo || !dto.contrasena) {
      throw new BadRequestException('Correo y contraseña son obligatorios');
    }

    // Buscar persona según rol
    const whereCondition: any = { correo: dto.correo, rol };
    if (rol === 'cliente') {
      whereCondition.estado = 'activo';
    }

    const persona = await this.personaRepository.findOne({
      where: whereCondition,
    });

    if (!persona) {
      const rolName = rol === 'cliente' ? 'Cliente' : 'Personal de discoteca';
      throw new NotFoundException(`${rolName} no encontrado`);
    }

    // Verificar contraseña
    const isPasswordValid = await this.authService.comparePasswords(
      dto.contrasena,
      persona.contrasena_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Actualizar último login
    persona.ultimo_login = new Date();
    await this.personaRepository.save(persona);

    // Generar token y retornar
    return this.generateAuthResponse(persona, rol);
  }
}
