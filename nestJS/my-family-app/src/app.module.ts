import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './modules/db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    // forRoot
    //      Used once, usually in your root AppModule
    //      It creates a single connection object that the whole app can share
    //      Connect to MongoDB at this URI

    /*
      Use forRoot() if you have a static URI (like mongodb://localhost:27017/mydb).
      Use forRootAsync() if your URI/config depends on async or dynamic values (like environment variables through ConfigService). 
    */
    
    DbModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: 'squoink',
      signOptions: { expiresIn: '300s' },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
