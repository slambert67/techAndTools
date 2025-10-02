import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AppController } from './app.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})
export class AppModule {}
