import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relacionador } from '../entities/relacionador.entity';
import { Persona } from '../entities/persona.entity';
import { UpdateRelacionadorDto } from './dto/update-relacionador.dto';

@Injectable()
export class RelacionadoresService {
  constructor(
    @InjectRepository(Relacionador)
    private relacionadorRepository: Repository<Relacionador>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
  ) {}

  // Listar todos (admin)
  async findAll() {
    return await this.relacionadorRepository.find({
      where: { estado: 'activo' },
      relations: ['persona'],
      order: { fecha_registro: 'DESC' },
    });
  }

  // Ver uno por ID
  async findOne(id: number) {
    const relacionador = await this.relacionadorRepository.findOne({
      where: { id },
      relations: ['persona'],
    });

    if (!relacionador) {
      throw new NotFoundException('Relacionador no encontrado');
    }

    const { persona } = relacionador;
    const { contrasena_hash, ...personaSinPassword } = persona as any;

    return { ...relacionador, persona: personaSinPassword };
  }

  // Ver mi perfil (relacionador autenticado)
  async findMiPerfil(personaId: number) {
    const relacionador = await this.relacionadorRepository.findOne({
      where: { persona_id: personaId },
      relations: ['persona'],
    });

    if (!relacionador) {
      throw new NotFoundException('No se encontró perfil de relacionador');
    }

    const { persona } = relacionador;
    const { contrasena_hash, ...personaSinPassword } = persona as any;

    return { ...relacionador, persona: personaSinPassword };
  }

  // Ver mi código de referencia
  async findMiCodigo(personaId: number) {
    const relacionador = await this.relacionadorRepository.findOne({
      where: { persona_id: personaId },
    });

    if (!relacionador) {
      throw new NotFoundException('No se encontró perfil de relacionador');
    }

    return { codigo_referencia: relacionador.codigo_referencia };
  }

  // Ver eventos asignados al relacionador
  async findMisEventos(personaId: number) {
    const relacionador = await this.relacionadorRepository.findOne({
      where: { persona_id: personaId },
      relations: [
        'evento_relacionadores',
        'evento_relacionadores.evento',
      ],
    });

    if (!relacionador) {
      throw new NotFoundException('No se encontró perfil de relacionador');
    }

    return relacionador.evento_relacionadores;
  }

  // Editar perfil propio
  async update(id: number, dto: UpdateRelacionadorDto, personaId: number) {
    const relacionador = await this.relacionadorRepository.findOne({
      where: { id },
    });

    if (!relacionador) {
      throw new NotFoundException('Relacionador no encontrado');
    }

    // Solo puede editar su propio perfil
    if (relacionador.persona_id !== personaId) {
      throw new ForbiddenException('No puedes editar el perfil de otro relacionador');
    }

    await this.relacionadorRepository.update(id, { ...dto });

    return this.findOne(id);
  }
}
