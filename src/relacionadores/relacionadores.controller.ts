import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RelacionadoresService } from './relacionadores.service';
import { UpdateRelacionadorDto } from './dto/update-relacionador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/roles.enum';

@Controller('relacionadores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RelacionadoresController {
  constructor(private readonly relacionadoresService: RelacionadoresService) {}

  // Listar todos (solo admin)
  @Get()
  async findAll() {
    return await this.relacionadoresService.findAll();
  }

  // Ver mi perfil completo
  @Get('mi-perfil')
  @Roles(UserRole.RELACIONADOR)
  async findMiPerfil(@Req() req: any) {
    return await this.relacionadoresService.findMiPerfil(req.user.userId);
  }

  // Ver mi código de referencia
  @Get('mi-codigo')
  @Roles(UserRole.RELACIONADOR)
  async findMiCodigo(@Req() req: any) {
    return await this.relacionadoresService.findMiCodigo(req.user.userId);
  }

  // Ver mis eventos asignados
  @Get('mis-eventos')
  @Roles(UserRole.RELACIONADOR)
  async findMisEventos(@Req() req: any) {
    return await this.relacionadoresService.findMisEventos(req.user.userId);
  }

  // Ver uno por ID (admin o el propio relacionador)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RELACIONADOR)
  async findOne(@Param('id') id: string) {
    return await this.relacionadoresService.findOne(+id);
  }

  // Editar perfil propio
  @Put(':id')
  @Roles(UserRole.RELACIONADOR)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRelacionadorDto,
    @Req() req: any,
  ) {
    return await this.relacionadoresService.update(+id, dto, req.user.userId);
  }
}
