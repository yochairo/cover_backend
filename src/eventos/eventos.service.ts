import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from '../entities/evento.entity';
import { Discoteca } from '../entities/discoteca.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Discoteca)
    private discotecaRepository: Repository<Discoteca>,
  ) {}

  async create(createEventoDto: CreateEventoDto): Promise<Evento> {
    const discoteca = await this.discotecaRepository.findOne({
      where: { id: createEventoDto.discoteca_id }
    });

    if (!discoteca) {
      throw new NotFoundException(`Discoteca con ID ${createEventoDto.discoteca_id} no encontrada`);
    }

    const evento = this.eventoRepository.create({
      ...createEventoDto,
      discoteca,
    });

    return await this.eventoRepository.save(evento);
  }

  async findAll(): Promise<Evento[]> {
    return await this.eventoRepository.find({
      relations: ['discoteca'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: ['discoteca'],
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return evento;
  }

  async findByDiscoteca(discotecaId: number): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: { discoteca: { id: discotecaId } },
      relations: ['discoteca'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findActivos(): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: { estado: 'activo' },
      relations: ['discoteca'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findActivosByDiscoteca(discotecaId: number): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: { 
        discoteca: { id: discotecaId },
        estado: 'activo'
      },
      relations: ['discoteca'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findProximosEventos(): Promise<Evento[]> {
    const ahora = new Date();
    const mañana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
    
    return await this.eventoRepository.find({
      where: {
        fecha_inicio: new Date(ahora.getTime() + 24 * 60 * 60 * 1000),
        estado: 'activo',
      },
      relations: ['discoteca'],
      order: { fecha_inicio: 'ASC' },
      take: 10,
    });
  }

  async update(id: number, updateEventoDto: UpdateEventoDto): Promise<Evento> {
    const evento = await this.findOne(id);

    if (updateEventoDto.discoteca_id && updateEventoDto.discoteca_id !== evento.discoteca_id) {
      const discoteca = await this.discotecaRepository.findOne({
        where: { id: updateEventoDto.discoteca_id }
      });

      if (!discoteca) {
        throw new NotFoundException(`Discoteca con ID ${updateEventoDto.discoteca_id} no encontrada`);
      }

      evento.discoteca = discoteca;
    }

    Object.assign(evento, updateEventoDto);
    return await this.eventoRepository.save(evento);
  }

  async cambiarEstado(id: number, estado: string): Promise<Evento> {
    const evento = await this.findOne(id);
    evento.estado = estado;
    evento.actualizado_en = new Date();
    return await this.eventoRepository.save(evento);
  }

  async remove(id: number): Promise<void> {
    const evento = await this.findOne(id);
    await this.eventoRepository.remove(evento);
  }
}