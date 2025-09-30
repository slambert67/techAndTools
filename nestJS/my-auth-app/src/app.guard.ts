
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { UsersService } from './users/users.service';

// guards can be controller-scoped, method-scoped, or global-scoped

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private jwtService: JwtService, private usersService: UsersService ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Guarding');

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    console.log(`token = ${token}`);

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      console.log('PAYLOAD');
      console.log(payload);
      request['user'] = this.usersService.findAll();
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
