import { Module } from '@nestjs/common';
import { CategoriasMesaService } from './categorias_mesa.service';
import { CategoriasMesaController } from './categorias_mesa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaMesa } from '../entities/categoria-mesa.entity';

@Module({
  imports:[    
    TypeOrmModule.forFeature([CategoriaMesa]),
  ],
  controllers: [CategoriasMesaController],
  providers: [CategoriasMesaService],
  exports:[CategoriasMesaService]
})
export class CategoriasMesaModule {}
