import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  schema: configService.get('DB_SCHEMA', 'public'), // Esquema configurable
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // En producción SIEMPRE false
  logging: true, // Activado para debug
  ssl: {
    rejectUnauthorized: false, // Necesario para Supabase
  },
});
