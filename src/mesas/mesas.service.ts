import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Mesa } from '../entities/mesa.entity';
import { Discoteca } from '../entities/discoteca.entity';
import { CategoriaMesa } from '../entities/categoria-mesa.entity';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private mesaRepository: Repository<Mesa>,
    @InjectRepository(Discoteca)
    private discotecaRepository: Repository<Discoteca>,
    @InjectRepository(CategoriaMesa)
    private categoriaMesaRepository: Repository<CategoriaMesa>,
  ) {}

  async create(createMesaDto: CreateMesaDto) {
    // Verificar que la discoteca existe
    const discoteca = await this.discotecaRepository.findOne({
      where: { id: createMesaDto.discoteca_id },
    });

    if (!discoteca) {
      throw new NotFoundException('Discoteca no encontrada');
    }

    // Verificar que la categoría existe
    const categoria = await this.categoriaMesaRepository.findOne({
      where: { id: createMesaDto.categoria_id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría de mesa no encontrada');
    }

    // Verificar que el número de mesa no esté duplicado en la misma discoteca
    const mesaExistente = await this.mesaRepository.findOne({
      where: {
        discoteca_id: createMesaDto.discoteca_id,
        numero_mesa: createMesaDto.numero_mesa,
        activa: true,
      },
    });

    if (mesaExistente) {
      throw new BadRequestException(
        `Ya existe una mesa con el número ${createMesaDto.numero_mesa} en esta discoteca`,
      );
    }

    // Crear la mesa
    const nuevaMesa = this.mesaRepository.create({
      discoteca_id: createMesaDto.discoteca_id,
      categoria_id: createMesaDto.categoria_id,
      numero_mesa: createMesaDto.numero_mesa,
      capacidad: createMesaDto.capacidad,
      ubicacion: createMesaDto.ubicacion,
      estado: createMesaDto.estado || 'libre',
      zona_id: createMesaDto.zona_id,
      pos_x: createMesaDto.pos_x,
      pos_y: createMesaDto.pos_y,
      forma: createMesaDto.forma || 'circular',
      ancho: createMesaDto.ancho,
      alto: createMesaDto.alto,
      precio_reserva: createMesaDto.precio_reserva,
      activa: true,
      creado_en: new Date(),
    });

    const mesaGuardada = await this.mesaRepository.save(nuevaMesa);

    return this.findOne(mesaGuardada.id);
  }

  async findAll(filtros?: { discotecaId?: number; activa?: boolean }) {
    const where: any = {};

    if (filtros?.discotecaId) {
      where.discoteca_id = filtros.discotecaId;
    }

    if (filtros?.activa !== undefined) {
      where.activa = filtros.activa;
    } else {
      // Por defecto, solo mostrar mesas activas
      where.activa = true;
    }

    return await this.mesaRepository.find({
      where,
      relations: ['discoteca', 'categoria', 'zona'],
      order: { numero_mesa: 'ASC' },
    });
  }

  async findOne(id: number) {
    const mesa = await this.mesaRepository.findOne({
      where: { id },
      relations: ['discoteca', 'categoria', 'zona', 'reservas'],
    });

    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada');
    }

    return mesa;
  }

  async findByDiscoteca(discotecaId: number) {
    return await this.mesaRepository.find({
      where: { discoteca_id: discotecaId, activa: true },
      relations: ['categoria', 'zona'],
      order: { numero_mesa: 'ASC' },
    });
  }

  async findDisponibles(discotecaId: number) {
    return await this.mesaRepository.find({
      where: {
        discoteca_id: discotecaId,
        estado: 'libre',
        activa: true,
      },
      relations: ['categoria', 'zona'],
      order: { numero_mesa: 'ASC' },
    });
  }

  async update(id: number, updateMesaDto: UpdateMesaDto) {
    const mesa = await this.findOne(id);

    // Si se está actualizando el número de mesa, verificar que no esté duplicado
    if (updateMesaDto.numero_mesa && updateMesaDto.numero_mesa !== mesa.numero_mesa) {
      const mesaExistente = await this.mesaRepository.findOne({
        where: {
          discoteca_id: mesa.discoteca_id,
          numero_mesa: updateMesaDto.numero_mesa,
          activa: true,
        },
      });

      if (mesaExistente) {
        throw new BadRequestException(
          `Ya existe una mesa con el número ${updateMesaDto.numero_mesa} en esta discoteca`,
        );
      }
    }

    // Actualizar campos
    Object.assign(mesa, updateMesaDto);

    await this.mesaRepository.save(mesa);

    return this.findOne(id);
  }

  async cambiarEstado(id: number, nuevoEstado: string) {
    const estadosPermitidos = ['libre', 'reservada', 'ocupada', 'mantenimiento'];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `Estado inválido. Estados permitidos: ${estadosPermitidos.join(', ')}`,
      );
    }

    const mesa = await this.findOne(id);

    mesa.estado = nuevoEstado;

    await this.mesaRepository.save(mesa);

    return this.findOne(id);
  }

  async remove(id: number) {
    const mesa = await this.findOne(id);

    // Soft delete: marcar como inactiva
    mesa.activa = false;

    await this.mesaRepository.save(mesa);

    return { mensaje: 'Mesa desactivada exitosamente' };
  }
}
