import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoriasMesaService } from './categorias_mesa.service';
import { CreateCategoriasMesaDto } from './dto/create-categorias_mesa.dto';
import { UpdateCategoriasMesaDto } from './dto/update-categorias_mesa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('categorias-mesa')
export class CategoriasMesaController {
  constructor(
    private readonly categoriasMesaService: CategoriasMesaService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoriasMesaDto: CreateCategoriasMesaDto) {
    const categoria = await this.categoriasMesaService.create(
      createCategoriasMesaDto,
    );
    return {
      success: true,
      message: 'Categoría de mesa creada exitosamente',
      data: categoria,
    };
  }

  @Get()
  async findAll() {
    const categorias = await this.categoriasMesaService.findAll();
    return {
      success: true,
      data: categorias,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categoria = await this.categoriasMesaService.findOne(+id);
    return {
      success: true,
      data: categoria,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async update(
    @Param('id') id: string,
    @Body() updateCategoriasMesaDto: UpdateCategoriasMesaDto,
  ) {
    const categoria = await this.categoriasMesaService.update(
      +id,
      updateCategoriasMesaDto,
    );
    return {
      success: true,
      message: 'Categoría de mesa actualizada exitosamente',
      data: categoria,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const resultado = await this.categoriasMesaService.remove(+id);
    return {
      success: true,
      message: resultado.mensaje,
    };
  }
}
