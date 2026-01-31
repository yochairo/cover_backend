import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000', // React
      'http://localhost:5173', // Vite React
      'http://localhost:4200', // Angular
      'http://localhost:8100', // Ionic
      'capacitor://localhost', // Capacitor
      'http://localhost', // Flutter Web
    ];

    // Permitir requests sin origin (como Postman, mobile apps)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Platform',
    'X-App-Version',
  ],
};
