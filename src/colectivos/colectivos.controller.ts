import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
} from '@nestjs/common';
import { ColectivosService } from './colectivos.service';
import { UpdateColectivoDto } from './dto/update-colectivo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/roles.enum';

@Controller('colectivos')
export class ColectivosController {
  constructor(private readonly colectivosService: ColectivosService) {}

  // Listar todos (público)
  @Get()
  async findAll() {
    return await this.colectivosService.findActivos();
  }

  // Buscar por nombre o descripción (público)
  @Get('buscar')
  async search(@Query('q') termino: string) {
    return await this.colectivosService.search(termino);
  }

  // Listar pendientes de verificación (temporal: público para pruebas)
  @Get('pendientes')
  async findPendientes() {
    return await this.colectivosService.findPendientes();
  }

  // Verificar o rechazar un colectivo (temporal: público para pruebas)
  @Put(':id/verificar')
  async verificar(
    @Param('id') id: string,
    @Query('aprobar', ParseBoolPipe) aprobar: boolean,
  ) {
    return await this.colectivosService.verificar(+id, aprobar);
  }

  // Ver mi colectivo (solo colectivo autenticado)
  @Get('mi-colectivo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLECTIVO)
  async findMiColectivo(@Req() req: any) {
    return await this.colectivosService.findMiColectivo(req.user.userId);
  }

  // Ver uno por ID (público)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.colectivosService.findOne(+id);
  }

  // Editar colectivo (solo su admin)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLECTIVO)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateColectivoDto,
    @Req() req: any,
  ) {
    return await this.colectivosService.update(+id, dto, req.user.userId);
  }

  // Eliminar colectivo (solo su admin)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COLECTIVO)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req: any) {
    return await this.colectivosService.remove(+id, req.user.userId);
  }
}
