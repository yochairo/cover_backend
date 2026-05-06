import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
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
import { UploadsModule } from './uploads/uploads.module';
import { validateEnv } from './config/env.validation';

// Importar entidades
import * as entities from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    // Rate limiting global: 100 req/min/IP por defecto.
    // - Si REDIS_URL está definida, el storage compartido vive en Redis (apto para
    //   múltiples instancias del backend tras un load balancer).
    // - Si no, cae a in-memory (single-node only).
    ThrottlerModule.forRootAsync({
      useFactory: (cfg: ConfigService) => {
        const redisUrl = cfg.get<string>('REDIS_URL');
        const opts: any = {
          throttlers: [{ name: 'default', ttl: 60_000, limit: 100 }],
          // Identifica a cada cliente por su IP real (X-Forwarded-For),
          // resuelta por Express gracias a `trust proxy` en main.ts.
          // Sin esto, todo el tráfico que pasa por Pangolin contaría
          // como una sola IP y los buckets serían inutilizables.
          getTracker: (req: any) =>
            (Array.isArray(req?.ips) && req.ips[0]) || req?.ip || 'unknown',
        };
        if (redisUrl) {
          opts.storage = new ThrottlerStorageRedisService(new Redis(redisUrl));
        }
        return opts;
      },
      inject: [ConfigService],
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
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
