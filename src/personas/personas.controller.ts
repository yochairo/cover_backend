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
import { PersonasService } from './personas.service';
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { RegisterPersonalDto } from './dto/register-personal.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('persona')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Post('registerCliente')
  @HttpCode(HttpStatus.CREATED)
  async registerCliente(@Body() dto: RegisterClienteDto) {
    return await this.personasService.registerCliente(dto);
  }

  @Post('loginCliente')
  @HttpCode(HttpStatus.OK)
  async loginCliente(@Body() dto: LoginDto) {
    return await this.personasService.loginCliente(dto);
  }

  @Post('registerPersonal')
  @HttpCode(HttpStatus.CREATED)
  async registerPersonal(@Body() dto: RegisterPersonalDto) {
    return await this.personasService.registerPersonal(dto);
  }

  @Post('loginPersonal')
  @HttpCode(HttpStatus.OK)
  async loginPersonal(@Body() dto: LoginDto) {
    return await this.personasService.loginPersonal(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.personasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.personasService.findOne(+id);
  }
}
