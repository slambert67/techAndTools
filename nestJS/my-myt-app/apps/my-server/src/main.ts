import { NestFactory } from '@nestjs/core';
import { MyServerModule } from './my-server.module';

async function bootstrap() {
  const app = await NestFactory.create(MyServerModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
