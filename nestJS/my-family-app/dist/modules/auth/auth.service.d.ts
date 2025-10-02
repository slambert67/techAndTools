import { DbService } from '../db/db.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private dbService;
    private jwtService;
    constructor(dbService: DbService, jwtService: JwtService);
    signIn(username: string, pass: string): Promise<any>;
}
