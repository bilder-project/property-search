import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Retrieve the FRONTEND_URL from the environment or use a default value
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

  // Enable CORS with the specified origin
  app.enableCors({
    origin: [frontendUrl, backendUrl, 'http://localhost:3000'], // Allow FRONTEND_URL and localhost:3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Property Search API')
    .setDescription('The main API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/property-search/docs', app, document);

  await app.listen(8080);
}
bootstrap();