import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';

/*
Path parameters (a.k.a. route parameters)
  Part of the URL path itself
  Used to identify a specific resource
  eg. GET /users/123/orders/45
    123 is the userId, 45 is the orderId
  
  NestJS
  @Get('users/:userId/orders/:orderId')
  getOrder(@Param('userId') userId: string, @Param('orderId') orderId: string) {
    return { userId, orderId };
  }


Query parameters
  Appended to the URL after a ?
  Used for filtering, searching, sorting, pagination, etc
  eg. GET /products?category=books&sort=price&limit=10

  NestJS
  @Get('products')
    findProducts(@Query('category') category: string, @Query('sort') sort: string, , @Query('limit') limit: number) {
    return { category, sort, limit };
  }


  Header parameters
    Sent in the HTTP headers.
    Commonly used for authentication, content type, API keys, metadata.

    GET /profile
    Authorization: Bearer <token>
    Content-Type: application/json

    @Get('profile')
    getProfile(@Headers('authorization') authHeader: string) {
      return authHeader;
    }



  Body parameters
    Sent in the request body (not the URL)
    Used mainly in POST, PUT, PATCH requests when sending data

    POST /users
    Content-Type: application/json

    {
      "username": "alice",
      "email": "alice@example.com"
    }

    @Post('users')
    createUser(@Body() body: { username: string; email: string }) {
      return body;
    } 

  
  Cookie parameters
    Sent in the Cookie header.
    Often used for session IDs or authentication tokens

    GET /dashboard
    Cookie: sessionId=abcd1234; theme=dark

  @Get('dashboard')
  getDashboard(@Cookies('sessionId') sessionId: string) {
    return sessionId;
  }
*/


/*
Guards
  Authorisation - not Authentication
  Assume authentication has taken place
  executed 
    after middleware
    before interceptors
    before pipes


*/


@Controller('family')                                         // handles requests from localhost:3000/family
export class AppController {
  constructor(private readonly appService: AppService) {
    // declares a dependency on the AppService TOKEN.
    // nest sees AppService in constructor
    // finds its singleton instance and injects it
  }

  // family/mine
  @Get('mine')                                                // handles requests from localhost:3000/family/mine
  getFamily( @Req() request: Request,
             @Param() parameters: string[] ): string[] {              // injects the request object

    // do not need to access directly - some can be injected
    /*console.log(request.url);
    console.log(request.method);
    console.log(request.body);
    console.log(request.credentials);*/

    console.log(`params = ${parameters.toString}`);

    return this.appService.getFamily();
  }

  // family/mine/n
  // binding the pipe at the method parameter level. Note that class is passed. Framework handles instantiation. Can pass an in-place instance
  // can use custom pipes to validate body contents of a POST
  // can use global pipes: app.useGlobalPipes(new ValidationPipe())
  @Get('mine/:index')
  getMember( @Param('index', ParseIntPipe) index: number ) {
    console.log('get member by path');
    return this.appService.getMember(index);
  }


  // family/my?index=n
  @Get('my')
    getMemberbyQuery(@Query('index') index: number) {
    console.log('get member by query');
    return this.appService.getMember(index);
  }


  // family/mine - body - {"name": "newname"}
  @Post('mine')
  // @HttpCode(123) to change default satus code
  // @Header(...) to specify a custom header
  addMember(@Body() newMember: any) {
    console.log('creating new member');
    this.appService.addMember(newMember.name);
    return 'created new member';
  }


  @Delete('mine/:index')
  removeMember(@Param('index') index: number) {
    this.appService.removeMember(index);
  }
}

