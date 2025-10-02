import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor( private dbService: DbService,
                 private jwtService: JwtService
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.dbService.findValidAdmin(username, pass);
        
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.name, password: user.password };
        console.log('signing in');
        console.log(payload);
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}
