import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from '../entities/reserva.entity';
import { Mesa } from '../entities/mesa.entity';
import { Cliente } from '../entities/cliente.entity';
import { ReservaCliente } from '../entities/reserva-cliente.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Mesa)
    private mesaRepository: Repository<Mesa>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(ReservaCliente)
    private reservaClienteRepository: Repository<ReservaCliente>,
  ) {}

  async create(createReservaDto: CreateReservaDto, clienteId: number) {
    // Verificar que la mesa existe y está disponible
    const mesa = await this.mesaRepository.findOne({
      where: { id: createReservaDto.mesa_id },
      relations: ['discoteca'],
    });

    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada');
    }

    if (!mesa.activa) {
      throw new BadRequestException('La mesa no está disponible para reservas');
    }

    // Verificar que el cliente existe
    const cliente = await this.clienteRepository.findOne({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar disponibilidad de la mesa en la fecha/hora solicitada
    const fechaReserva = new Date(createReservaDto.fecha_reserva);
    const reservasExistentes = await this.reservaRepository.find({
      where: {
        mesa_id: createReservaDto.mesa_id,
      },
    });

    // Validar que no haya conflicto de horarios
    const hayConflicto = reservasExistentes.some((reserva) => {
      if (reserva.estado === 'cancelada' || !reserva.fecha_reserva) {
        return false;
      }

      const fechaExistente = new Date(reserva.fecha_reserva);
      const mismoDia =
        fechaExistente.toDateString() === fechaReserva.toDateString();

      // Si es el mismo día, verificar hora
      if (mismoDia && createReservaDto.hora_reserva && reserva.hora_reserva) {
        return createReservaDto.hora_reserva === reserva.hora_reserva;
      }

      return mismoDia;
    });

    if (hayConflicto) {
      throw new ConflictException(
        'La mesa ya está reservada para esa fecha/hora',
      );
    }

    // Verificar capacidad
    if (createReservaDto.num_personas > mesa.capacidad) {
      throw new BadRequestException(
        `La mesa tiene capacidad para ${mesa.capacidad} personas, pero solicitaste ${createReservaDto.num_personas}`,
      );
    }

    // Calcular precio total (por ahora usamos el precio de la mesa)
    const precioTotal = mesa.precio_reserva || 0;

    // Crear la reserva
    const nuevaReserva = this.reservaRepository.create({
      cliente_organizador_id: clienteId,
      mesa_id: createReservaDto.mesa_id,
      promocion_id: createReservaDto.promocion_id,
      fecha_reserva: fechaReserva,
      hora_reserva: createReservaDto.hora_reserva,
      num_personas: createReservaDto.num_personas,
      notas: createReservaDto.notas,
      cupon_id: createReservaDto.cupon_id,
      estado: 'pendiente',
      precio_total: precioTotal,
      descuento_aplicado: 0,
      creado_en: new Date(),
      actualizado_en: new Date(),
    });

    const reservaGuardada = await this.reservaRepository.save(nuevaReserva);

    // Crear automáticamente el registro del organizador en reservas_clientes
    await this.reservaClienteRepository.save({
      reserva_id: reservaGuardada.id,
      cliente_id: clienteId,
      es_organizador: true,
      creado_en: new Date(),
    });

    return this.findOne(reservaGuardada.id);
  }

  async findAll(filtros?: { clienteId?: number; estado?: string }) {
    const where: any = {};

    if (filtros?.clienteId) {
      where.cliente_organizador_id = filtros.clienteId;
    }

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    return await this.reservaRepository.find({
      where,
      relations: ['mesa', 'mesa.discoteca', 'cliente_organizador'],
      order: { fecha_reserva: 'DESC' },
    });
  }

  async findOne(id: number) {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: [
        'mesa',
        'mesa.discoteca',
        'mesa.categoria',
        'cliente_organizador',
        'cliente_organizador.persona',
        'promocion',
        'pagos',
        'invitaciones',
      ],
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return reserva;
  }

  async findByMesa(mesaId: number) {
    return await this.reservaRepository.find({
      where: { mesa_id: mesaId },
      relations: ['cliente_organizador', 'cliente_organizador.persona'],
      order: { fecha_reserva: 'DESC' },
    });
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.findOne(id);

    // No permitir actualizar reservas canceladas o completadas
    if (reserva.estado === 'cancelada' || reserva.estado === 'completada') {
      throw new BadRequestException(
        `No se puede actualizar una reserva ${reserva.estado}`,
      );
    }

    // Actualizar campos
    Object.assign(reserva, updateReservaDto);
    reserva.actualizado_en = new Date();

    await this.reservaRepository.save(reserva);

    return this.findOne(id);
  }

  async cancelar(id: number, clienteId: number) {
    const reserva = await this.findOne(id);

    // Verificar que el cliente sea el organizador
    if (reserva.cliente_organizador_id !== clienteId) {
      throw new BadRequestException(
        'Solo el organizador puede cancelar la reserva',
      );
    }

    if (reserva.estado === 'cancelada') {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    if (reserva.estado === 'completada') {
      throw new BadRequestException(
        'No se puede cancelar una reserva completada',
      );
    }

    reserva.estado = 'cancelada';
    reserva.cancelada_en = new Date();
    reserva.actualizado_en = new Date();

    await this.reservaRepository.save(reserva);

    return this.findOne(id);
  }

  async confirmar(id: number) {
    const reserva = await this.findOne(id);

    if (reserva.estado !== 'pendiente') {
      throw new BadRequestException(
        'Solo se pueden confirmar reservas pendientes',
      );
    }

    reserva.estado = 'confirmada';
    reserva.confirmada_en = new Date();
    reserva.actualizado_en = new Date();

    await this.reservaRepository.save(reserva);

    return this.findOne(id);
  }

  async completar(id: number) {
    const reserva = await this.findOne(id);

    if (reserva.estado !== 'confirmada') {
      throw new BadRequestException(
        'Solo se pueden completar reservas confirmadas',
      );
    }

    reserva.estado = 'completada';
    reserva.completada_en = new Date();
    reserva.actualizado_en = new Date();

    await this.reservaRepository.save(reserva);

    return this.findOne(id);
  }

  async remove(id: number) {
    const reserva = await this.findOne(id);

    // Solo permitir eliminar reservas pendientes
    if (reserva.estado !== 'pendiente') {
      throw new BadRequestException(
        'Solo se pueden eliminar reservas pendientes. Para otras, usa la opción de cancelar.',
      );
    }

    await this.reservaRepository.remove(reserva);

    return { mensaje: 'Reserva eliminada exitosamente' };
  }
}
