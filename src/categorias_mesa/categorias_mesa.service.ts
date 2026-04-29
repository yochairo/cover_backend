import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriasMesaDto } from './dto/create-categorias_mesa.dto';
import { UpdateCategoriasMesaDto } from './dto/update-categorias_mesa.dto';
import { CategoriaMesa } from '../entities/categoria-mesa.entity';

@Injectable()
export class CategoriasMesaService {
  constructor(
    @InjectRepository(CategoriaMesa)
    private categoriaMesaRepository: Repository<CategoriaMesa>,
  ) {}

  async create(createCategoriasMesaDto: CreateCategoriasMesaDto) {
    const nuevaCategoria = this.categoriaMesaRepository.create({
      nombre: createCategoriasMesaDto.nombre,
      descripcion: createCategoriasMesaDto.descripcion,
      precio_base: createCategoriasMesaDto.precio_base,
      creado_en: new Date(),
    });

    return await this.categoriaMesaRepository.save(nuevaCategoria);
  }

  async findAll() {
    return await this.categoriaMesaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaMesaRepository.findOne({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría de mesa no encontrada');
    }

    return categoria;
  }

  async update(id: number, updateCategoriasMesaDto: UpdateCategoriasMesaDto) {
    const categoria = await this.findOne(id);

    Object.assign(categoria, updateCategoriasMesaDto);

    return await this.categoriaMesaRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);

    await this.categoriaMesaRepository.remove(categoria);

    return { mensaje: 'Categoría de mesa eliminada exitosamente' };
  }
}
