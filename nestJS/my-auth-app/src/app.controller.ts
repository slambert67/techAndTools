
import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGuard } from './app.guard';

@Controller('auth')
export class AppController {
  constructor(private appService: AppService) {}


  /*
  body =
  {"username": "john", "password": "changeme"}
  */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.appService.signIn(signInDto.username, signInDto.password);
  }

  // returns an access token
  /*
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiam9obiIsImlhdCI6MTc1ODg5MzI2MywiZXhwIjoxNzU4ODkzMzIzfQ.nxJb0pnvZw7XQBFroNC0uVJAXxFq7qoHwEWWKaDoOVs"
  }
  */

  @UseGuards(AppGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
