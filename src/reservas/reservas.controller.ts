import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('cliente')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    const clienteId = req.user.clienteId;
    const reserva = await this.reservasService.create(
      createReservaDto,
      clienteId,
    );
    return {
      success: true,
      message: 'Reserva creada exitosamente',
      data: reserva,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query('estado') estado?: string) {
    const filtros: any = {};

    // Si es cliente, solo ver sus propias reservas
    if (req.user.rol === 'cliente') {
      filtros.clienteId = req.user.clienteId;
    }

    if (estado) {
      filtros.estado = estado;
    }

    const reservas = await this.reservasService.findAll(filtros);

    return {
      success: true,
      data: reservas,
    };
  }

  @Get('mesa/:mesaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async findByMesa(@Param('mesaId') mesaId: string) {
    const reservas = await this.reservasService.findByMesa(+mesaId);
    return {
      success: true,
      data: reservas,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const reserva = await this.reservasService.findOne(+id);
    return {
      success: true,
      data: reserva,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async update(
    @Param('id') id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    const reserva = await this.reservasService.update(+id, updateReservaDto);
    return {
      success: true,
      message: 'Reserva actualizada exitosamente',
      data: reserva,
    };
  }

  @Put(':id/cancelar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('cliente')
  async cancelar(@Param('id') id: string, @Request() req) {
    const clienteId = req.user.clienteId;
    const reserva = await this.reservasService.cancelar(+id, clienteId);
    return {
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: reserva,
    };
  }

  @Put(':id/confirmar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async confirmar(@Param('id') id: string) {
    const reserva = await this.reservasService.confirmar(+id);
    return {
      success: true,
      message: 'Reserva confirmada exitosamente',
      data: reserva,
    };
  }

  @Put(':id/completar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async completar(@Param('id') id: string) {
    const reserva = await this.reservasService.completar(+id);
    return {
      success: true,
      message: 'Reserva completada exitosamente',
      data: reserva,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const resultado = await this.reservasService.remove(+id);
    return {
      success: true,
      message: resultado.mensaje,
    };
  }
}
