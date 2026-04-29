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
} from '@nestjs/common';
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMesaDto: CreateMesaDto) {
    const mesa = await this.mesasService.create(createMesaDto);
    return {
      success: true,
      message: 'Mesa creada exitosamente',
      data: mesa,
    };
  }

  @Get()
  async findAll(@Query('discotecaId') discotecaId?: string) {
    const filtros: any = {};

    if (discotecaId) {
      filtros.discotecaId = +discotecaId;
    }

    const mesas = await this.mesasService.findAll(filtros);

    return {
      success: true,
      data: mesas,
    };
  }

  @Get('discoteca/:discotecaId')
  async findByDiscoteca(@Param('discotecaId') discotecaId: string) {
    const mesas = await this.mesasService.findByDiscoteca(+discotecaId);
    return {
      success: true,
      data: mesas,
    };
  }

  @Get('discoteca/:discotecaId/disponibles')
  async findDisponibles(@Param('discotecaId') discotecaId: string) {
    const mesas = await this.mesasService.findDisponibles(+discotecaId);
    return {
      success: true,
      data: mesas,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mesa = await this.mesasService.findOne(+id);
    return {
      success: true,
      data: mesa,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
    const mesa = await this.mesasService.update(+id, updateMesaDto);
    return {
      success: true,
      message: 'Mesa actualizada exitosamente',
      data: mesa,
    };
  }

  @Put(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
  ) {
    const mesa = await this.mesasService.cambiarEstado(+id, estado);
    return {
      success: true,
      message: 'Estado de la mesa actualizado exitosamente',
      data: mesa,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const resultado = await this.mesasService.remove(+id);
    return {
      success: true,
      message: resultado.mensaje,
    };
  }
}
