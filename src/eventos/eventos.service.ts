import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not } from 'typeorm';
import { Evento } from '../entities/evento.entity';
import { Discoteca } from '../entities/discoteca.entity';
import { Colectivo } from '../entities/colectivo.entity';
import { Personal } from '../entities/personal.entity';
import { ColectivoAdministrador } from '../entities/colectivo-administrador.entity';
import { PersonalDiscoteca } from '../entities/personal-discoteca.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { UserRole } from '../common/enums/roles.enum';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Discoteca)
    private discotecaRepository: Repository<Discoteca>,
    @InjectRepository(Colectivo)
    private colectivoRepository: Repository<Colectivo>,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
    @InjectRepository(ColectivoAdministrador)
    private colectivoAdminRepository: Repository<ColectivoAdministrador>,
    @InjectRepository(PersonalDiscoteca)
    private personalDiscotecaRepository: Repository<PersonalDiscoteca>,
  ) {}

  // ==================== CREATE ====================

  async create(dto: CreateEventoDto, personaId: number, rol: string): Promise<Evento> {
    // Validar que tenga al menos un local o colectivo
    if (!dto.local_id && !dto.colectivos_id) {
      throw new BadRequestException('Se requiere local_id o colectivos_id');
    }

    // Validar que el local existe si se especificó
    if (dto.local_id) {
      const local = await this.discotecaRepository.findOne({
        where: { id: dto.local_id },
      });
      if (!local) throw new NotFoundException(`Local con ID ${dto.local_id} no encontrado`);
    }

    // Si es colectivo, asignar automáticamente su colectivo_id
    if (rol === UserRole.COLECTIVO) {
      const personal = await this.personalRepository.findOne({
        where: { persona_id: personaId },
      });
      if (!personal) throw new ForbiddenException('No se encontró perfil de personal');

      const adminRecord = await this.colectivoAdminRepository.findOne({
        where: { personal_id: personal.id },
      });
      if (!adminRecord) throw new ForbiddenException('No tienes un colectivo asociado');

      dto.colectivos_id = adminRecord.colectivo_id;
    }

    // Si es personal, verificar que el local_id pertenece a su local
    if (rol === UserRole.PERSONAL && dto.local_id) {
      await this.verificarPropietarioLocal(dto.local_id, personaId);
    }

    const slug = dto.slug || this.generateSlug(dto.nombre);

    const evento = this.eventoRepository.create({
      ...dto,
      fecha_inicio: dto.fecha_inicio ? new Date(dto.fecha_inicio) : undefined,
      fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : undefined,
      slug,
      estado: 'activo',
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    return await this.eventoRepository.save(evento);
  }

  // ==================== READ ====================

  async findAll(): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: { estado: Not('cancelado') },
      relations: ['discoteca', 'colectivo'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: ['discoteca', 'colectivo'],
    });

    if (!evento) throw new NotFoundException(`Evento con ID ${id} no encontrado`);

    return evento;
  }

  async findProximos(): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: {
        estado: 'activo',
        fecha_inicio: MoreThan(new Date()),
      },
      relations: ['discoteca', 'colectivo'],
      order: { fecha_inicio: 'ASC' },
      take: 20,
    });
  }

  async findByLocal(localId: number): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: { local_id: localId, estado: Not('cancelado') },
      relations: ['colectivo'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findByColectivo(colectivoId: number): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: { colectivos_id: colectivoId, estado: Not('cancelado') },
      relations: ['discoteca'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findMisEventos(personaId: number, rol: string): Promise<Evento[]> {
    if (rol === UserRole.PERSONAL) {
      // Buscar el local del personal
      const personal = await this.personalRepository.findOne({
        where: { persona_id: personaId },
      });
      if (!personal) throw new NotFoundException('Perfil de personal no encontrado');

      const localAdmin = await this.personalDiscotecaRepository.findOne({
        where: { personal_id: personal.id },
      });
      if (!localAdmin) throw new NotFoundException('No tienes un local asociado');

      return this.findByLocal(localAdmin.local_id);
    }

    if (rol === UserRole.COLECTIVO) {
      const personal = await this.personalRepository.findOne({
        where: { persona_id: personaId },
      });
      if (!personal) throw new NotFoundException('Perfil no encontrado');

      const adminRecord = await this.colectivoAdminRepository.findOne({
        where: { personal_id: personal.id },
      });
      if (!adminRecord) throw new NotFoundException('No tienes un colectivo asociado');

      return this.findByColectivo(adminRecord.colectivo_id);
    }

    throw new ForbiddenException('Rol no autorizado');
  }

  // ==================== UPDATE ====================

  async update(id: number, dto: UpdateEventoDto, personaId: number, rol: string): Promise<Evento> {
    const evento = await this.findOne(id);

    await this.verificarPropietarioEvento(evento, personaId, rol);

    // Validar nuevo local si se cambia
    if (dto.local_id && dto.local_id !== evento.local_id) {
      const local = await this.discotecaRepository.findOne({
        where: { id: dto.local_id },
      });
      if (!local) throw new NotFoundException(`Local con ID ${dto.local_id} no encontrado`);
    }

    Object.assign(evento, {
      ...dto,
      fecha_inicio: dto.fecha_inicio ? new Date(dto.fecha_inicio) : evento.fecha_inicio,
      fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : evento.fecha_fin,
      actualizado_en: new Date(),
    });

    return await this.eventoRepository.save(evento);
  }

  async cancelar(id: number, personaId: number, rol: string): Promise<Evento> {
    const evento = await this.findOne(id);

    await this.verificarPropietarioEvento(evento, personaId, rol);

    evento.estado = 'cancelado';
    evento.actualizado_en = new Date();

    return await this.eventoRepository.save(evento);
  }

  // ==================== HELPERS ====================

  private async verificarPropietarioEvento(
    evento: Evento,
    personaId: number,
    rol: string,
  ): Promise<void> {
    const personal = await this.personalRepository.findOne({
      where: { persona_id: personaId },
    });
    if (!personal) throw new ForbiddenException('No tienes permisos sobre este evento');

    if (rol === UserRole.PERSONAL) {
      const localAdmin = await this.personalDiscotecaRepository.findOne({
        where: { personal_id: personal.id, local_id: evento.local_id },
      });
      if (!localAdmin) throw new ForbiddenException('Este evento no pertenece a tu local');
    }

    if (rol === UserRole.COLECTIVO) {
      const adminRecord = await this.colectivoAdminRepository.findOne({
        where: { personal_id: personal.id, colectivo_id: evento.colectivos_id },
      });
      if (!adminRecord) throw new ForbiddenException('Este evento no pertenece a tu colectivo');
    }
  }

  private async verificarPropietarioLocal(localId: number, personaId: number): Promise<void> {
    const personal = await this.personalRepository.findOne({
      where: { persona_id: personaId },
    });
    if (!personal) throw new ForbiddenException('No tienes permisos sobre este local');

    const localAdmin = await this.personalDiscotecaRepository.findOne({
      where: { personal_id: personal.id, local_id: localId },
    });
    if (!localAdmin) throw new ForbiddenException('No eres administrador de este local');
  }

  private generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now();
  }
}
