import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
      region: this.configService.get('MINIO_REGION', 'us-east-1'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'cover-app');
  }

  async onModuleInit() {
    this.logger.log(`Intentando conectar a MinIO en ${this.configService.get('MINIO_ENDPOINT')}...`);
    const endpoint = this.configService.get('MINIO_ENDPOINT');
    const accessKey = this.configService.get('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get('MINIO_SECRET_KEY');

    this.logger.log(`Intentando conectar a MinIO en ${endpoint}...`);
    this.logger.debug(`Access Key: ${accessKey ? accessKey.substring(0, 3) + '***' : 'NO DEFINIDA'}`);
    this.logger.debug(`Secret Key: ${secretKey ? '***' + secretKey.substring(secretKey.length - 3) : 'NO DEFINIDA'}`);
    
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket "${this.bucketName}" creado exitosamente.`);
      } else {
        this.logger.log(`Conexión exitosa. El bucket "${this.bucketName}" ya existe.`);
      }
    } catch (error) {
      this.logger.error(`Error de conexión a MinIO: ${error.message}`);
      if (error.message.includes('CERT')) {
        this.logger.warn('Dato: Si el certificado no es válido, revisa que NODE_TLS_REJECT_UNAUTHORIZED=0 esté en tu .env');
      }
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general') {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    return {
      url: await this.getFileUrl(fileName),
      path: fileName
    };
  }

  async getFileUrl(fileName: string) {
    // Genera una URL firmada válida por 24 horas
    return await this.minioClient.presignedGetObject(
      this.bucketName,
      fileName,
      24 * 60 * 60
    );
  }
}