import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule.register({ headers: { 'Content-Type': 'application/json',
                                                    'Authorization': 'Basic ' + Buffer.from('REST_RESOURCES_GATES:$W5ztv=xDxv@gu6@','utf-8').toString('base64'),
/*                                                    'Authorization': 'Basic ' + btoa('REST_RESOURCES_GATES:$W5ztv=xDxv@gu6@'),*/
                                                    'Access-Control-Allow-Origin':'*',
                                                    'Access-Control-Allow-Methods': "GET, PUT, PATCH, POST, DELETE",
                                                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'}})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
