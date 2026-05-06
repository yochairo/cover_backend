import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Persona } from '../entities/persona.entity';
import { Cliente } from '../entities/cliente.entity';
import { Personal } from '../entities/personal.entity';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/types/jwt-payload.interface';
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { RegisterPersonalDto } from './dto/register-personal.dto';
import { LoginDto } from './dto/login.dto';

type RegistrableRol = 'cliente' | 'personal' | 'admin';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private authService: AuthService,
  ) {}

  async registerCliente(dto: RegisterClienteDto) {
    return this.register(dto, 'cliente');
  }

  async loginCliente(dto: LoginDto) {
    return this.login(dto, 'cliente');
  }

  async registerPersonal(dto: RegisterPersonalDto) {
    // 'personal' es el rol por defecto cuando un admin invita.
    return this.register(dto, 'personal');
  }

  async loginPersonal(dto: LoginDto) {
    return this.login(dto, 'personal');
  }

  async findAll() {
    // El campo `contrasena_hash` queda excluido por @Exclude() en la entidad
    // + ClassSerializerInterceptor global, no hace falta limpiar a mano.
    return await this.personaRepository.find();
  }

  async findOne(id: number) {
    const persona = await this.personaRepository.findOne({ where: { id } });

    if (!persona) {
      throw new NotFoundException('Persona no encontrada');
    }

    return persona;
  }

  // ==================== HELPERS ====================

  private async validateUniqueEmail(
    manager: EntityManager,
    correo: string,
    rol: string,
  ): Promise<void> {
    const existing = await manager.findOne(Persona, {
      where: { correo: correo.toLowerCase().trim(), rol },
    });

    if (existing) {
      throw new ConflictException(`El correo ya está registrado como ${rol}`);
    }
  }

  private async validateUniqueUsername(
    manager: EntityManager,
    nombre_usuario: string,
  ): Promise<void> {
    const existing = await manager.findOne(Persona, {
      where: { nombre_usuario },
    });

    if (existing) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }
  }

  private buildPersona(
    dto: RegisterClienteDto | RegisterPersonalDto,
    hashedPassword: string,
    rol: string,
  ): Persona {
    return this.personaRepository.create({
      nombre_usuario: dto.nombre_usuario,
      correo: dto.correo.toLowerCase().trim(),
      contrasena_hash: hashedPassword,
      nombre_completo: dto.nombre_completo,
      telefono: dto.telefono,
      carnet: dto.carnet,
      fecha_nacimiento: dto.fecha_nacimiento
        ? new Date(dto.fecha_nacimiento)
        : undefined,
      foto_perfil_url: dto.foto_perfil_url,
      rol,
      estado: 'activo',
      creado_en: new Date(),
      actualizado_en: new Date(),
    });
  }

  private buildAuthResponse(
    persona: Persona,
    extra: { clienteId?: number; personalId?: number },
  ): { persona: Persona; token: string } {
    const payload: JwtPayload = {
      userId: persona.id,
      rol: persona.rol,
      clienteId: extra.clienteId,
      personalId: extra.personalId,
    };
    const token = this.authService.generateToken(payload);
    return { persona, token };
  }

  // ==================== REGISTER (transaccional) ====================

  private async register(
    dto: RegisterClienteDto | RegisterPersonalDto,
    rol: RegistrableRol,
  ) {
    const hashedPassword = await this.authService.hashPassword(dto.contrasena);

    // Toda la creación (Persona + Cliente|Personal) corre en una sola
    // transacción: si la segunda inserción falla, la primera se revierte.
    return this.dataSource.transaction(async (manager) => {
      await this.validateUniqueEmail(manager, dto.correo, rol);
      await this.validateUniqueUsername(manager, dto.nombre_usuario);

      const persona = this.buildPersona(dto, hashedPassword, rol);
      const savedPersona = await manager.save(Persona, persona);

      let extra: { clienteId?: number; personalId?: number } = {};

      if (rol === 'cliente') {
        const cliente = manager.create(Cliente, {
          persona_id: savedPersona.id,
          fecha_registro: new Date(),
        });
        const savedCliente = await manager.save(Cliente, cliente);
        extra = { clienteId: savedCliente.id };
      } else {
        const personal = manager.create(Personal, {
          persona_id: savedPersona.id,
          fecha_ingreso: new Date(),
          activo: true,
        });
        const savedPersonal = await manager.save(Personal, personal);
        extra = { personalId: savedPersonal.id };
      }

      return this.buildAuthResponse(savedPersona, extra);
    });
  }

  // ==================== LOGIN ====================

  private async login(dto: LoginDto, rol: 'cliente' | 'personal') {
    if (!dto.correo || !dto.contrasena) {
      throw new BadRequestException('Correo y contraseña son obligatorios');
    }

    // En login de personal aceptamos también rol 'admin' para que un
    // admin pueda autenticarse por la misma puerta.
    const rolesPermitidos = rol === 'cliente' ? ['cliente'] : ['personal', 'admin'];

    const persona = await this.personaRepository
      .createQueryBuilder('p')
      .where('LOWER(p.correo) = LOWER(:correo)', { correo: dto.correo })
      .andWhere('p.rol IN (:...roles)', { roles: rolesPermitidos })
      .andWhere(rol === 'cliente' ? `p.estado = 'activo'` : '1 = 1')
      .getOne();

    if (!persona) {
      const rolName = rol === 'cliente' ? 'Cliente' : 'Personal de discoteca';
      throw new NotFoundException(`${rolName} no encontrado`);
    }

    const isPasswordValid = await this.authService.comparePasswords(
      dto.contrasena,
      persona.contrasena_hash,
    );

    if (!isPasswordValid) {
      // Mismo mensaje genérico que cuando no existe el correo: no leak de cuentas.
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Resolver el id específico (clienteId / personalId) que va dentro del JWT.
    let extra: { clienteId?: number; personalId?: number } = {};
    if (persona.rol === 'cliente') {
      const cliente = await this.clienteRepository.findOne({
        where: { persona_id: persona.id },
      });
      if (!cliente) {
        throw new UnauthorizedException(
          'La cuenta de cliente está incompleta. Contacta a soporte.',
        );
      }
      extra = { clienteId: cliente.id };
    } else {
      const personal = await this.personalRepository.findOne({
        where: { persona_id: persona.id },
      });
      if (!personal) {
        throw new UnauthorizedException(
          'La cuenta de personal está incompleta. Contacta a soporte.',
        );
      }
      extra = { personalId: personal.id };
    }

    persona.ultimo_login = new Date();
    await this.personaRepository.save(persona);

    return this.buildAuthResponse(persona, extra);
  }
}
