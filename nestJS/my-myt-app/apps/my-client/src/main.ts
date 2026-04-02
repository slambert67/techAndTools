import { NestFactory } from '@nestjs/core';
import { MyClientModule } from './my-client.module';

async function bootstrap() {
  const app = await NestFactory.create(MyClientModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
