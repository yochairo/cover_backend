import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { join, normalize, resolve } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Sirve los archivos subidos a /uploads únicamente a usuarios autenticados.
 *
 * - Reemplaza el `useStaticAssets` previo, que dejaba toda la carpeta pública.
 * - Bloquea path traversal normalizando y verificando que el resultado siga
 *   contenido dentro del directorio raíz de uploads.
 * - Limita los subdirectorios accesibles vía allowlist.
 */
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  private readonly root = resolve(process.cwd(), 'uploads');
  private readonly allowedFolders = new Set(['eventos']);

  @Get(':folder/:filename')
  @Roles('cliente', 'personal', 'admin')
  serve(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!this.allowedFolders.has(folder)) {
      throw new NotFoundException('Recurso no encontrado');
    }

    // Normalizamos y resolvemos. Si el path final escapa de `this.root`,
    // es un intento de traversal — rechazar.
    const requested = resolve(this.root, folder, normalize(filename));
    if (!requested.startsWith(this.root + require('path').sep)) {
      throw new BadRequestException('Ruta inválida');
    }

    if (!existsSync(requested)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return res.sendFile(requested);
  }
}
