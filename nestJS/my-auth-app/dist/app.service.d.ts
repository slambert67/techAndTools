import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AppService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signIn(username: string, pass: string): Promise<any>;
}
