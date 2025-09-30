import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './modules/db/db.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    // forRoot
    //      Used once, usually in your root AppModule
    //      It creates a single connection object that the whole app can share
    //      Connect to MongoDB at this URI
    
    DbModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
