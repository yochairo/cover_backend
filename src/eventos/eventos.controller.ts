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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
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

  @Post('upload-imagen')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/eventos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `evento-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WebP'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async uploadImagen(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    return {
      success: true,
      url: `${process.env.BASE_URL || 'http://localhost:3030'}/uploads/eventos/${file.filename}`,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('personal')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.eventosService.remove(+id);
    return {
      success: true,
      message: 'Evento eliminado exitosamente',
    };
  }
}