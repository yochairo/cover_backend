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
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DiscotecasService } from './discotecas.service';
import { CreateDiscotecaDto } from './dto/create-discoteca.dto';
import { UpdateDiscotecaDto } from './dto/update-discoteca.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('discotecas')
export class DiscotecasController {
  constructor(private readonly discotecasService: DiscotecasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDiscotecaDto: CreateDiscotecaDto, @Request() req) {
    const discoteca = await this.discotecasService.create(createDiscotecaDto, req.user?.userId);
    return {
      success: true,
      message: 'Discoteca creada exitosamente',
      data: discoteca,
    };
  }

  @Get('mi-discoteca')
  @UseGuards(JwtAuthGuard)
  async getMiDiscoteca(@Request() req) {
    const discoteca = await this.discotecasService.findMiDiscoteca(req.user.userId);
    return {
      success: true,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
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

  @Post('upload-logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/discotecas',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `discoteca-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WebP'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    return {
      success: true,
      url: `${process.env.BASE_URL || 'http://localhost:3030'}/uploads/discotecas/${file.filename}`,
    };
  }

  @Post(':id/setup-mesas')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async setupMesas(
    @Param('id') id: string,
    @Body() body: { mesas_redondas?: number; mesas_rectangulares?: number; mesas_vip?: number },
  ) {
    const mesas = await this.discotecasService.setupMesas(+id, body);
    return {
      success: true,
      message: `${mesas.length} mesas creadas exitosamente`,
      data: mesas,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  async remove(@Param('id') id: string) {
    const resultado = await this.discotecasService.remove(+id);
    return {
      success: true,
      message: resultado.mensaje,
    };
  }
}
