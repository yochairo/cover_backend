import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const schema = configService.get<string>('DB_SCHEMA', 'public');

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    schema, // resuelve nombres NO calificados de las entities

    // Asegura que el search_path de la sesión también incluya el schema:
    // los triggers y funciones de Postgres (p.ej. auditar_reservas) hacen
    // referencias sin prefijo y dependen de search_path para encontrar las
    // tablas. Sin esto fallan con "relation X does not exist".
    extra: {
      options: `-c search_path=${schema},public`,
    },

    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // En producción SIEMPRE false
    logging: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : 'all',
    ssl: {
      rejectUnauthorized: false, // Necesario para Supabase
    },
  };
};
