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
import { Colectivo } from '../entities/colectivo.entity';
import { ColectivoAdministrador } from '../entities/colectivo-administrador.entity';
import { Relacionador } from '../entities/relacionador.entity';
import { AuthService } from '../auth/auth.service';
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { RegisterPersonalDto } from './dto/register-personal.dto';
import { RegisterColectivoDto } from './dto/register-colectivo.dto';
import { RegisterRelacionadorDto } from './dto/register-relacionador.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../common/enums/roles.enum';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
    @InjectRepository(Colectivo)
    private colectivoRepository: Repository<Colectivo>,
    @InjectRepository(ColectivoAdministrador)
    private colectivoAdministradorRepository: Repository<ColectivoAdministrador>,
    @InjectRepository(Relacionador)
    private relacionadorRepository: Repository<Relacionador>,
    private authService: AuthService,
  ) {}

  async registerCliente(dto: RegisterClienteDto) {
    return this.register(dto, UserRole.CLIENTE);
  }

  async loginCliente(dto: LoginDto) {
    return this.login(dto, UserRole.CLIENTE);
  }

  async registerPersonal(dto: RegisterPersonalDto) {
    return this.register(dto, UserRole.PERSONAL);
  }

  async loginPersonal(dto: LoginDto) {
    return this.login(dto, UserRole.PERSONAL);
  }

  async registerColectivo(dto: RegisterColectivoDto) {
    return this.register(dto, UserRole.COLECTIVO);
  }

  async loginColectivo(dto: LoginDto) {
    return this.login(dto, UserRole.COLECTIVO);
  }

  async registerRelacionador(dto: RegisterRelacionadorDto) {
    return this.register(dto, UserRole.RELACIONADOR);
  }

  async loginRelacionador(dto: LoginDto) {
    return this.login(dto, UserRole.RELACIONADOR);
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
    dto: RegisterClienteDto | RegisterPersonalDto | RegisterColectivoDto | RegisterRelacionadorDto,
    hashedPassword: string,
    rol: string,
  ): Promise<Persona> {
    const newPersona = this.personaRepository.create({
      nombre_usuario: dto.nombre_usuario,
      correo: dto.correo.toLowerCase().trim(),
      contrasena_hash: hashedPassword,
      nombre_completo: dto.nombre_completo || (dto as any).nombre_colectivo,
      telefono: dto.telefono,
      carnet: (dto as any).carnet,
      fecha_nacimiento: (dto as any).fecha_nacimiento ? new Date((dto as any).fecha_nacimiento) : undefined,
      foto_perfil_url: (dto as any).foto_perfil_url,
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

  private async createColectivoRecord(
    persona_id: number,
    dto: RegisterColectivoDto,
  ): Promise<void> {
    // 1. Create Personal record
    const newPersonal = this.personalRepository.create({
      persona_id,
      fecha_ingreso: new Date(),
      activo: true,
    });
    const savedPersonal = await this.personalRepository.save(newPersonal);

    // 2. Create Colectivo record
    const newColectivo = this.colectivoRepository.create({
      nombre: dto.nombre_colectivo,
      descripcion: dto.descripcion,
      telefono: dto.telefono,
      correo_contacto: dto.correo,
      slug: this.generateSlug(dto.nombre_colectivo),
      estado: 'pendiente',
      verificado: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const savedColectivo = await this.colectivoRepository.save(newColectivo);

    // 3. Create ColectivoAdministrador linking them
    const newColectivoAdmin = this.colectivoAdministradorRepository.create({
      personal_id: savedPersonal.id,
      colectivo_id: savedColectivo.id,
      rol_personal: 'creador',
      creado_en: new Date(),
    });
    await this.colectivoAdministradorRepository.save(newColectivoAdmin);
  }

  private async createRelacionadorRecord(
    persona_id: number,
  ): Promise<void> {
    const newRelacionador = this.relacionadorRepository.create({
      persona_id,
      codigo_referencia: await this.generateCodigoReferencia(),
      comision_defecto: 0,
      estado: 'activo',
      verificado: false,
      fecha_registro: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });
    await this.relacionadorRepository.save(newRelacionador);
  }

  private generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateCodigoReferencia(): Promise<string> {
    let codigo: string = '';
    let existe = true;

    while (existe) {
      codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
      const relacionador = await this.relacionadorRepository.findOne({
        where: { codigo_referencia: codigo },
      });
      existe = !!relacionador;
    }

    return codigo;
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
    dto: RegisterClienteDto | RegisterPersonalDto | RegisterColectivoDto | RegisterRelacionadorDto,
    rol: UserRole,
  ) {
    // Validaciones
    await this.validateUniqueEmail(dto.correo, rol);
    await this.validateUniqueUsername(dto.nombre_usuario);

    // Crear persona
    const hashedPassword = await this.authService.hashPassword(dto.contrasena);
    const savedPersona = await this.createPersona(dto, hashedPassword, rol);

    // Crear registro específico según rol
    if (rol === UserRole.CLIENTE) {
      await this.createClienteRecord(savedPersona.id);
    } else if (rol === UserRole.PERSONAL) {
      await this.createPersonalRecord(savedPersona.id);
    } else if (rol === UserRole.COLECTIVO) {
      await this.createColectivoRecord(savedPersona.id, dto as RegisterColectivoDto);
    } else if (rol === UserRole.RELACIONADOR) {
      await this.createRelacionadorRecord(savedPersona.id);
    }

    // Generar token y retornar
    return this.generateAuthResponse(savedPersona, rol);
  }

  private async login(dto: LoginDto, rol: UserRole) {
    // Validación de campos requeridos
    if (!dto.correo || !dto.contrasena) {
      throw new BadRequestException('Correo y contraseña son obligatorios');
    }

    // Buscar persona según rol
    const whereCondition: any = { correo: dto.correo, rol };
    if (rol === UserRole.CLIENTE) {
      whereCondition.estado = 'activo';
    }

    const persona = await this.personaRepository.findOne({
      where: whereCondition,
    });

    if (!persona) {
      const rolNames = {
        [UserRole.CLIENTE]: 'Cliente',
        [UserRole.PERSONAL]: 'Personal de discoteca',
        [UserRole.COLECTIVO]: 'Colectivo',
        [UserRole.RELACIONADOR]: 'Relacionador',
        [UserRole.ADMIN]: 'Administrador',
      };
      throw new NotFoundException(`${rolNames[rol]} no encontrado`);
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
