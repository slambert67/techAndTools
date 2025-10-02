import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strip unknown fields
      //forbidNonWhitelisted: true,   // throw if unknown fields are present
      transform: true,              // auto-transform to DTO instances
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Admin example')
    .setDescription('The Admin API description')
    .setVersion('1.0')
    .addTag('admin')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // <-- name to reference later
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
