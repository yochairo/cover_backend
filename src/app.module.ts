import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { PersonasModule } from './personas/personas.module';
import { DiscotecasModule } from './discotecas/discotecas.module';
import { EventosModule } from './eventos/eventos.module';
import { ReservasModule } from './reservas/reservas.module';
import { MesasModule } from './mesas/mesas.module';
import { CategoriasMesaModule } from './categorias_mesa/categorias_mesa.module';

// Importar entidades
import * as entities from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(Object.values(entities)),
    AuthModule,
    PersonasModule,
    DiscotecasModule,
    EventosModule,
    ReservasModule,
    MesasModule,
    CategoriasMesaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
