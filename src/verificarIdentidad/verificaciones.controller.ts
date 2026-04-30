import { Controller, Post, Get, Body, Param, Put, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { VerificacionesService } from './verificaciones.service';

import { SolicitarVerificacionDto } from './dto/solicitar-verificacion.dto';
import { RevisarVerificacionDto } from './dto/revisar-verificacion.dto';
import { VerificacionIdentidad } from '../entities/verificacion-identidad.entity';



@Controller('verificaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerificacionesController {
  constructor(private readonly service: VerificacionesService) {}

  // El cliente sube su documentación
  @Post('solicitar')
  @Roles('cliente')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'foto_carnet_frontal', maxCount: 1 },
    { name: 'foto_carnet_reverso', maxCount: 1 },
    { name: 'foto_selfie', maxCount: 1 },
  ]))
  async solicitar(
    @Req() req: any, 
    @Body() data: SolicitarVerificacionDto,
    @UploadedFiles() files: {
      foto_carnet_frontal?: Express.Multer.File[],
      foto_carnet_reverso?: Express.Multer.File[],
      foto_selfie?: Express.Multer.File[],
    }
  ): Promise<VerificacionIdentidad> {
    console.log(req.user);
    console.log(data);
    console.log(files);
    return await this.service.create(req.user.userId, data, files);
  }

  // El cliente ve su propio estado
  @Get('mi-estado')
  @Roles('cliente')
  async getMiEstado(@Req() req: any): Promise<VerificacionIdentidad> {
    return await this.service.findOneByPersona(req.user.userId);
  }

/*
  // El personal ve todas las pendientes para revisar
  @Get('pendientes')
  @Roles('personal')
  async getPendientes() {
    return await this.service.findAllPendientes();
  }

  // El personal aprueba o rechaza
  @Put(':id/revisar')
  @Roles('personal')
  async revisar(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { estado: 'aprobado' | 'rechazado'; motivo?: string },
  ) {
    // Nota: Necesitarás obtener el personal_id del usuario logueado (que es personal)
    // Esto depende de cómo guardes la info en el JWT, aquí asumo que pasamos el ID del registro en 'personal'
    return await this.service.revisarVerificacion(+id, req.user.personalId, body.estado, body.motivo);
  }
*/
}
