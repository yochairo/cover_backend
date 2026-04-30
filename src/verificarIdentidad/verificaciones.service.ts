import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { VerificacionIdentidad } from '../entities/verificacion-identidad.entity';
import { Persona } from '../entities/persona.entity';
import { Personal } from '../entities/personal.entity';
import { SolicitarVerificacionDto } from './dto/solicitar-verificacion.dto';

export interface VerificationFiles {
  foto_carnet_frontal?: Express.Multer.File[];
  foto_carnet_reverso?: Express.Multer.File[];
  foto_selfie?: Express.Multer.File[];
}

@Injectable()
export class VerificacionesService {
  constructor(
    @InjectRepository(VerificacionIdentidad)
    private verificacionRepository: Repository<VerificacionIdentidad>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
  ) {}

  async create(personaId: number, data: SolicitarVerificacionDto, files: VerificationFiles): Promise<VerificacionIdentidad> {
    const existe = await this.verificacionRepository.findOne({ where: { persona_id: personaId } });
    if (existe) {
      throw new ConflictException('Ya existe una solicitud de verificación para esta persona');
    }

    // Calcular la edad basada en la fecha de nacimiento proporcionada
    const fechaNacimiento = new Date(data.fecha_nacimiento_carnet);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();

    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    const esMayorDeEdad = edad >= 18;

    const nuevaVerificacion = this.verificacionRepository.create({
      numero_carnet: data.numero_carnet,
      fecha_nacimiento_carnet: fechaNacimiento,
      persona_id: personaId,
      estado: esMayorDeEdad ? 'pendiente' : 'rechazado',
      motivo_rechazo: esMayorDeEdad ? '' : 'Es menor de edad',
      foto_carnet_frontal_url: files.foto_carnet_frontal?.[0]?.originalname || '',
      foto_carnet_reverso_url: files.foto_carnet_reverso?.[0]?.originalname || '',
      foto_selfie_url: files.foto_selfie?.[0]?.originalname || '',
      es_mayor_de_edad: esMayorDeEdad,
    });

    return await this.verificacionRepository.save(nuevaVerificacion);
  }

  async findOneByPersona(personaId: number): Promise<VerificacionIdentidad> {
    const verificacion = await this.verificacionRepository.findOne({
      where: { persona_id: personaId },
      relations: ['verificador', 'verificador.persona'],
    });
    if (!verificacion) {
      throw new NotFoundException('No se encontró verificación para esta persona');
    }
    return verificacion;
  }

  async findAllPendientes(): Promise<VerificacionIdentidad[]> {
    return await this.verificacionRepository.find({
      where: { estado: 'pendiente' },
      relations: ['persona'],
    });
  }

  async revisarVerificacion(id: number, verificadorId: number, estado: 'aprobado' | 'rechazado', motivo?: string): Promise<VerificacionIdentidad> {
    const verificacion = await this.verificacionRepository.findOne({ where: { id } });
    if (!verificacion) throw new NotFoundException('Solicitud no encontrada');

    const personal = await this.personalRepository.findOne({ where: { id: verificadorId } });
    if (!personal) throw new NotFoundException('Verificador no válido');

    verificacion.estado = estado;
    verificacion.verificado_por = verificadorId;
    verificacion.verificado_en = new Date();
    verificacion.actualizado_en = new Date();
    
    if (estado === 'rechazado') {
      verificacion.motivo_rechazo = motivo || '';
    } else {
      verificacion.motivo_rechazo = '';
      // Si se aprueba, podríamos actualizar el estado en la entidad Persona si fuera necesario
      await this.personaRepository.update(verificacion.persona_id, { estado: 'verificado' });
    }

    return await this.verificacionRepository.save(verificacion);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.verificacionRepository.delete(id);
  }
}
