import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { corsConfig } from './config/cors.config';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 👈 agregar

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.enableCors(corsConfig);

  // ⚠️ Helmet DESPUÉS de Swagger para que no bloquee la UI
  // Configurar Swagger 👇
  const config = new DocumentBuilder()
    .setTitle('Cover Backend API')
    .setDescription('Documentación de endpoints')
    .setVersion('0.0.1')
    .addBearerAuth() // para los endpoints con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // 👆 hasta aquí

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          scriptSrc: [`'self'`, `'unsafe-inline'`],
          styleSrc: [`'self'`, `'unsafe-inline'`, `https:`],
          imgSrc: [`'self'`, `data:`, `https:`, `http:`],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

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
  console.log(`📄 Swagger en http://localhost:${PORT}/api/docs`); // 👈 agregar
  console.log(`✅ Conectado a la base de datos`);
}
bootstrap();
