import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { Discoteca } from '../entities/discoteca.entity';
import { CreateDiscotecaDto } from './dto/create-discoteca.dto';
import { UpdateDiscotecaDto } from './dto/update-discoteca.dto';

@Injectable()
export class DiscotecasService {
  constructor(
    @InjectRepository(Discoteca)
    private discotecaRepository: Repository<Discoteca>,
  ) {}

  async create(createDiscotecaDto: CreateDiscotecaDto) {
    // Verificar si ya existe una discoteca con ese nombre
    const existingDiscoteca = await this.discotecaRepository.findOne({
      where: {
        nombre: createDiscotecaDto.nombre.trim(),
        estado: Not('eliminado'),
      },
    });

    if (existingDiscoteca) {
      throw new ConflictException('Ya existe una discoteca con ese nombre');
    }

    // Crear nueva discoteca
    const nuevaDiscoteca = this.discotecaRepository.create({
      ...createDiscotecaDto,
      nombre: createDiscotecaDto.nombre.trim(),
      correo_contacto: createDiscotecaDto.correo_contacto
        ?.toLowerCase()
        .trim(),
      estado: 'activo',
      creado_en: new Date(),
    });

    return await this.discotecaRepository.save(nuevaDiscoteca);
  }

  async findAll() {
    return await this.discotecaRepository.find({
      where: {
        estado: Not('eliminado'),
      },
    });
  }

  async findOne(id: number) {
    const discoteca = await this.discotecaRepository.findOne({
      where: { id },
    });

    if (!discoteca || discoteca.estado === 'eliminado') {
      throw new NotFoundException('Discoteca no encontrada');
    }

    return discoteca;
  }

  async findActivas() {
    return await this.discotecaRepository.find({
      where: { estado: 'activo' },
      order: { nombre: 'ASC' },
    });
  }

  async search(termino: string) {
    return await this.discotecaRepository.find({
      where: [
        {
          nombre: ILike(`%${termino}%`),
          estado: Not('eliminado'),
        },
        {
          direccion: ILike(`%${termino}%`),
          estado: Not('eliminado'),
        },
      ],
      order: { nombre: 'ASC' },
    });
  }

  async update(id: number, updateDiscotecaDto: UpdateDiscotecaDto) {
    const discoteca = await this.discotecaRepository.findOne({
      where: { id },
    });

    if (!discoteca || discoteca.estado === 'eliminado') {
      throw new NotFoundException('Discoteca no encontrada o eliminada');
    }

    // Si se está actualizando el nombre, verificar que no exista otra discoteca con ese nombre
    if (
      updateDiscotecaDto.nombre &&
      updateDiscotecaDto.nombre.trim() !== discoteca.nombre
    ) {
      const existingDiscoteca = await this.discotecaRepository.findOne({
        where: {
          nombre: updateDiscotecaDto.nombre.trim(),
          id: Not(id),
          estado: Not('eliminado'),
        },
      });

      if (existingDiscoteca) {
        throw new ConflictException('Ya existe una discoteca con ese nombre');
      }
    }

    // Preparar datos para actualizar
    const updateData: any = {};

    if (updateDiscotecaDto.nombre) {
      updateData.nombre = updateDiscotecaDto.nombre.trim();
    }
    if (updateDiscotecaDto.correo_contacto) {
      updateData.correo_contacto =
        updateDiscotecaDto.correo_contacto.toLowerCase().trim();
    }
    if (updateDiscotecaDto.direccion !== undefined) {
      updateData.direccion = updateDiscotecaDto.direccion;
    }
    if (updateDiscotecaDto.telefono !== undefined) {
      updateData.telefono = updateDiscotecaDto.telefono;
    }
    if (updateDiscotecaDto.capacidad_total !== undefined) {
      updateData.capacidad_total = updateDiscotecaDto.capacidad_total;
    }
    if (updateDiscotecaDto.horario_apertura !== undefined) {
      updateData.horario_apertura = updateDiscotecaDto.horario_apertura;
    }
    if (updateDiscotecaDto.horario_cierre !== undefined) {
      updateData.horario_cierre = updateDiscotecaDto.horario_cierre;
    }
    if (updateDiscotecaDto.estado !== undefined) {
      updateData.estado = updateDiscotecaDto.estado;
    }

    await this.discotecaRepository.update(id, updateData);

    return await this.findOne(id);
  }

  async remove(id: number) {
    const discoteca = await this.discotecaRepository.findOne({
      where: { id },
    });

    if (!discoteca || discoteca.estado === 'eliminado') {
      throw new NotFoundException('Discoteca no encontrada o ya eliminada');
    }

    // Soft delete: cambiar estado a eliminado
    await this.discotecaRepository.update(id, { estado: 'eliminado' });

    return { mensaje: 'Discoteca eliminada correctamente' };
  }
}
