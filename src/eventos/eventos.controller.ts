import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventoDto: CreateEventoDto) {
    const evento = await this.eventosService.create(createEventoDto);
    return {
      success: true,
      message: 'Evento creado exitosamente',
      data: evento,
    };
  }

  @Get()
  async findAll(@Query('discotecaId') discotecaId?: string) {
    let eventos;
    
    if (discotecaId) {
      eventos = await this.eventosService.findByDiscoteca(+discotecaId);
    } else {
      eventos = await this.eventosService.findAll();
    }
    
    return {
      success: true,
      data: eventos,
    };
  }

  @Get('proximos')
  async findProximos() {
    const eventos = await this.eventosService.findProximosEventos();
    return {
      success: true,
      data: eventos,
    };
  }

  @Get('activos')
  async findActivos(@Query('discotecaId') discotecaId?: string) {
    let eventos;
    
    if (discotecaId) {
      eventos = await this.eventosService.findActivosByDiscoteca(+discotecaId);
    } else {
      eventos = await this.eventosService.findActivos();
    }
    
    return {
      success: true,
      data: eventos,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const evento = await this.eventosService.findOne(+id);
    return {
      success: true,
      data: evento,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
  ) {
    const evento = await this.eventosService.update(+id, updateEventoDto);
    return {
      success: true,
      message: 'Evento actualizado exitosamente',
      data: evento,
    };
  }

  @Put(':id/estado')
  @UseGuards(JwtAuthGuard)
  async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
  ) {
    const evento = await this.eventosService.cambiarEstado(+id, estado);
    return {
      success: true,
      message: 'Estado del evento actualizado exitosamente',
      data: evento,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.eventosService.remove(+id);
    return {
      success: true,
      message: 'Evento eliminado exitosamente',
    };
  }
}