import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { Colectivo } from '../entities/colectivo.entity';
import { ColectivoAdministrador } from '../entities/colectivo-administrador.entity';
import { Personal } from '../entities/personal.entity';
import { CreateColectivoDto } from './dto/create-colectivo.dto';
import { UpdateColectivoDto } from './dto/update-colectivo.dto';

@Injectable()
export class ColectivosService {
  constructor(
    @InjectRepository(Colectivo)
    private colectivoRepository: Repository<Colectivo>,
    @InjectRepository(ColectivoAdministrador)
    private colectivoAdminRepository: Repository<ColectivoAdministrador>,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
  ) {}

  // ==================== CRUD ====================

  async findAll() {
    return await this.colectivoRepository.find({
      where: { estado: Not('eliminado') },
      order: { nombre: 'ASC' },
    });
  }

  async findActivos() {
    return await this.colectivoRepository.find({
      where: { estado:'activo' },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const colectivo = await this.colectivoRepository.findOne({
      where: { id },
      relations: ['eventos'],
    });

    if (!colectivo || colectivo.estado === 'eliminado') {
      throw new NotFoundException('Colectivo no encontrado');
    }

    return colectivo;
  }

  async findMiColectivo(personaId: number) {
    // persona → personal → colectivo_administrador → colectivo
    const personal = await this.personalRepository.findOne({
      where: { persona_id: personaId },
    });

    if (!personal) {
      throw new NotFoundException('No se encontró perfil de personal para esta persona');
    }

    const adminRecord = await this.colectivoAdminRepository.findOne({
      where: { personal_id: personal.id },
      relations: ['colectivo'],
      order: { creado_en: 'ASC' },
    });

    if (!adminRecord) {
      throw new NotFoundException('No tienes un colectivo asociado');
    }

    return adminRecord.colectivo;
  }

  async findPendientes() {
    return await this.colectivoRepository.find({
      where: { estado: 'pendiente' },
      order: { created_at: 'ASC' },
    });
  }

  async verificar(id: number, verificado: boolean) {
    await this.findOne(id);

    await this.colectivoRepository.update(id, {
      verificado,
      estado: verificado ? 'activo' : 'rechazado',
      fecha_verificacion: new Date(),
    });

    return await this.colectivoRepository.findOne({
      where: { id },
      relations: ['eventos'],
      cache: false,
    });
  }

  async search(termino: string) {
    return await this.colectivoRepository.find({
      where: [
        { nombre: ILike(`%${termino}%`), estado: Not('eliminado') },
        { descripcion: ILike(`%${termino}%`), estado: Not('eliminado') },
      ],
      order: { nombre: 'ASC' },
    });
  }

  async update(id: number, dto: UpdateColectivoDto, personaId: number) {
    const colectivo = await this.findOne(id);

    // Verificar que quien edita es admin del colectivo
    await this.verificarAdmin(id, personaId);

    // Si cambia el nombre, verificar que no exista otro igual
    if (dto.nombre && dto.nombre.trim() !== colectivo.nombre) {
      const existente = await this.colectivoRepository.findOne({
        where: { nombre: dto.nombre.trim(), estado: Not('eliminado') },
      });
      if (existente) {
        throw new ConflictException('Ya existe un colectivo con ese nombre');
      }
    }

    const updateData: any = { ...dto };
    if (dto.nombre) updateData.nombre = dto.nombre.trim();
    if (dto.correo_contacto) updateData.correo_contacto = dto.correo_contacto.toLowerCase().trim();
    if (dto.verificado) updateData.fecha_verificacion = new Date();

    await this.colectivoRepository.update(id, updateData);

    return await this.colectivoRepository.findOne({
      where: { id },
      relations: ['eventos'],
      cache: false,
    });
  }

  async remove(id: number, personaId: number) {
    await this.findOne(id);
    await this.verificarAdmin(id, personaId);

    await this.colectivoRepository.update(id, { estado: 'eliminado' });

    return { mensaje: 'Colectivo eliminado correctamente' };
  }

  // ==================== HELPER ====================

  private async verificarAdmin(colectivoId: number, personaId: number): Promise<void> {
    const personal = await this.personalRepository.findOne({
      where: { persona_id: personaId },
    });

    if (!personal) throw new ForbiddenException('No tienes permisos sobre este colectivo');

    const adminRecord = await this.colectivoAdminRepository.findOne({
      where: { colectivo_id: colectivoId, personal_id: personal.id },
    });

    if (!adminRecord) throw new ForbiddenException('No eres administrador de este colectivo');
  }
}
