import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crea una reserva atómicamente:
   *  1. Toma lock pesimista sobre la fila de la mesa (serializa solicitudes
   *     concurrentes para esa mesa).
   *  2. Verifica conflictos con SQL — no en memoria — filtrando reservas no
   *     canceladas en la misma fecha/hora.
   *  3. Inserta la reserva y el `ReservaCliente` del organizador en la misma
   *     transacción: si el segundo insert falla, la reserva se revierte.
   *
   * NOTA: para fortalecerlo aún más se recomienda añadir en BD un índice
   * único parcial: `UNIQUE (mesa_id, fecha_reserva, hora_reserva) WHERE estado <> 'cancelada'`
   * (o un EXCLUDE constraint con tstzrange si las reservas pasan a tener rango).
   */
  async create(createReservaDto: CreateReservaDto, clienteId: number) {
    if (!clienteId) {
      throw new BadRequestException(
        'No se pudo identificar al cliente autenticado',
      );
    }

    const fechaReserva = new Date(createReservaDto.fecha_reserva);

    const reservaId = await this.dataSource.transaction(async (manager) => {
      // 1) Lock pesimista de la mesa para serializar solicitudes simultáneas.
      const mesa = await manager.findOne(Mesa, {
        where: { id: createReservaDto.mesa_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!mesa) {
        throw new NotFoundException('Mesa no encontrada');
      }
      if (!mesa.activa) {
        throw new BadRequestException(
          'La mesa no está disponible para reservas',
        );
      }
      if (createReservaDto.num_personas > mesa.capacidad) {
        throw new BadRequestException(
          `La mesa tiene capacidad para ${mesa.capacidad} personas, pero solicitaste ${createReservaDto.num_personas}`,
        );
      }

      // 2) Verificar cliente.
      const cliente = await manager.findOne(Cliente, {
        where: { id: clienteId },
      });
      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }

      // 3) Detectar colisión en SQL (estado != cancelada, mismo día, misma hora si aplica).
      const qb = manager
        .createQueryBuilder(Reserva, 'r')
        .where('r.mesa_id = :mesaId', { mesaId: createReservaDto.mesa_id })
        .andWhere(`r.estado IS NULL OR r.estado <> 'cancelada'`)
        .andWhere('DATE(r.fecha_reserva) = DATE(:fecha)', { fecha: fechaReserva });

      if (createReservaDto.hora_reserva) {
        qb.andWhere('r.hora_reserva = :hora', {
          hora: createReservaDto.hora_reserva,
        });
      }

      const conflict = await qb.getOne();
      if (conflict) {
        throw new ConflictException(
          'La mesa ya está reservada para esa fecha/hora',
        );
      }

      // 4) Crear reserva y reserva_cliente del organizador.
      const precioTotal = mesa.precio_reserva || 0;

      const nuevaReserva = manager.create(Reserva, {
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
      const saved = await manager.save(Reserva, nuevaReserva);

      await manager.save(ReservaCliente, {
        reserva_id: saved.id,
        cliente_id: clienteId,
        es_organizador: true,
        creado_en: new Date(),
      });

      return saved.id;
    });

    return this.findOne(reservaId);
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

    if (reserva.estado === 'cancelada' || reserva.estado === 'completada') {
      throw new BadRequestException(
        `No se puede actualizar una reserva ${reserva.estado}`,
      );
    }

    // El DTO ya solo expone campos seguros — `estado`, `precio_total`,
    // `cliente_organizador_id` no son mutables por aquí.
    Object.assign(reserva, updateReservaDto);
    if (updateReservaDto.fecha_reserva) {
      reserva.fecha_reserva = new Date(updateReservaDto.fecha_reserva);
    }
    reserva.actualizado_en = new Date();

    await this.reservaRepository.save(reserva);

    return this.findOne(id);
  }

  async cancelar(id: number, clienteId: number) {
    const reserva = await this.findOne(id);

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

    if (reserva.estado !== 'pendiente') {
      throw new BadRequestException(
        'Solo se pueden eliminar reservas pendientes. Para otras, usa la opción de cancelar.',
      );
    }

    await this.reservaRepository.remove(reserva);

    return { mensaje: 'Reserva eliminada exitosamente' };
  }
}
