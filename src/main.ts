import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { corsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors(corsConfig);

  // Seguridad con Helmet
  app.use(helmet());

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const PORT = parseInt(process.env.PORT || '3030', 10);

  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`✅ Conectado a la base de datos`);
}
bootstrap();
