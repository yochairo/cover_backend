// src/config/cors.config.ts
export const corsOptions = {
  origin: function (origin: any, callback: any) {
    const allowedOrigins = [
      'http://localhost:3000',  // React
      'http://localhost:5173',  // Vite React
      'http://localhost:4200',  // Angular (si usan)
      'http://localhost:8100',  // Ionic
      'capacitor://localhost',  // Capacitor
      'http://localhost',       // Flutter Web
      // Agregar dominios de producción aquí
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Platform', 'X-App-Version']
};