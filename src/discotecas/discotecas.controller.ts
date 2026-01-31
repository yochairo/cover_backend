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
import { DiscotecasService } from './discotecas.service';
import { CreateDiscotecaDto } from './dto/create-discoteca.dto';
import { UpdateDiscotecaDto } from './dto/update-discoteca.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('discotecas')
export class DiscotecasController {
  constructor(private readonly discotecasService: DiscotecasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDiscotecaDto: CreateDiscotecaDto) {
    const discoteca = await this.discotecasService.create(createDiscotecaDto);
    return {
      success: true,
      message: 'Discoteca creada exitosamente',
      data: discoteca,
    };
  }

  @Get()
  async findAll() {
    const discotecas = await this.discotecasService.findAll();
    return { discotecas };
  }

  @Get('activas')
  async findActivas() {
    const discotecas = await this.discotecasService.findActivas();
    return {
      success: true,
      data: discotecas,
    };
  }

  @Get('search')
  async search(@Query('q') q: string) {
    if (!q) {
      return {
        success: false,
        message: 'Parámetro de búsqueda requerido',
      };
    }

    const discotecas = await this.discotecasService.search(q);
    return {
      success: true,
      data: discotecas,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const discoteca = await this.discotecasService.findOne(+id);
    return {
      success: true,
      data: discoteca,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDiscotecaDto: UpdateDiscotecaDto,
  ) {
    const discoteca = await this.discotecasService.update(
      +id,
      updateDiscotecaDto,
    );
    return {
      success: true,
      message: 'Discoteca actualizada exitosamente',
      data: discoteca,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    const resultado = await this.discotecasService.remove(+id);
    return {
      success: true,
      message: resultado.mensaje,
    };
  }
}
