import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PersonasService } from './personas.service';
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { RegisterPersonalDto } from './dto/register-personal.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('persona')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Post('registerCliente')
  @HttpCode(HttpStatus.CREATED)
  // Endpoint público pero con throttle agresivo: evita abuso de creación masiva de cuentas.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async registerCliente(@Body() dto: RegisterClienteDto) {
    return await this.personasService.registerCliente(dto);
  }

  @Post('loginCliente')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async loginCliente(@Body() dto: LoginDto) {
    return await this.personasService.loginCliente(dto);
  }

  /**
   * Solo un admin autenticado puede dar de alta personal.
   * El primer admin debe sembrarse en BD vía migración/seed manual.
   */
  @Post('registerPersonal')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async registerPersonal(@Body() dto: RegisterPersonalDto) {
    return await this.personasService.registerPersonal(dto);
  }

  @Post('loginPersonal')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async loginPersonal(@Body() dto: LoginDto) {
    return await this.personasService.loginPersonal(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'personal')
  async findAll() {
    return await this.personasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.personasService.findOne(+id);
  }
}
