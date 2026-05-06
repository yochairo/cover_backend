import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { corsConfig } from './config/cors.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Estamos detrás de proxies en cadena: Pangolin (LAN) → Traefik (docker net) → backend.
  // 'uniquelocal' cubre RFC1918 (10/8, 172.16/12, 192.168/16) y el bridge de Docker,
  // así que `req.ip` y `req.ips` reflejan la IP del cliente real desde X-Forwarded-For
  // — clave para que el Throttler y los logs no traten a todo el mundo como una sola IP.
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

  app.enableCors(corsConfig);

  // Helmet con CSP relajada solo donde Swagger UI lo necesita.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [`'self'`, `'unsafe-inline'`],
          styleSrc: [`'self'`, `'unsafe-inline'`, `https:`],
          imgSrc: [`'self'`, `data:`, `https:`],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Serialización: respeta @Exclude() y @Expose() de class-transformer
  // — clave para que `contrasena_hash` nunca salga en respuestas JSON.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Cover Backend API')
    .setDescription('Documentación de endpoints')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = parseInt(process.env.PORT || '3030', 10);
  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📄 Swagger en http://localhost:${PORT}/api/docs`);
}
bootstrap();
