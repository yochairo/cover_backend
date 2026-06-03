import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
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
import { UserRole } from '../common/enums/roles.enum';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  // ==================== PÚBLICOS ====================

  @Get()
  async findAll() {
    return await this.eventosService.findAll();
  }

  @Get('proximos')
  async findProximos() {
    return await this.eventosService.findProximos();
  }

  @Get('local/:localId')
  async findByLocal(@Param('localId') localId: string) {
    return await this.eventosService.findByLocal(+localId);
  }

  @Get('colectivo/:colectivoId')
  async findByColectivo(@Param('colectivoId') colectivoId: string) {
    return await this.eventosService.findByColectivo(+colectivoId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventosService.findOne(+id);
  }

  // ==================== AUTENTICADOS ====================

  // Mis eventos (local o colectivo)
  @Get('mis-eventos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PERSONAL, UserRole.COLECTIVO)
  async findMisEventos(@Req() req: any) {
    return await this.eventosService.findMisEventos(req.user.userId, req.user.rol);
  }

  // Crear evento
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PERSONAL, UserRole.COLECTIVO)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEventoDto, @Req() req: any) {
    return await this.eventosService.create(dto, req.user.userId, req.user.rol);
  }

  // Editar evento
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PERSONAL, UserRole.COLECTIVO)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventoDto,
    @Req() req: any,
  ) {
    return await this.eventosService.update(+id, dto, req.user.userId, req.user.rol);
  }

  // Cancelar evento (soft delete)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PERSONAL, UserRole.COLECTIVO)
  @HttpCode(HttpStatus.OK)
  async cancelar(@Param('id') id: string, @Req() req: any) {
    return await this.eventosService.cancelar(+id, req.user.userId, req.user.rol);
  }

  // Subir imagen del evento
  @Post('upload-imagen')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PERSONAL, UserRole.COLECTIVO)
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
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadImagen(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    return { url: `http://localhost:3030/uploads/eventos/${file.filename}` };
  }
}
