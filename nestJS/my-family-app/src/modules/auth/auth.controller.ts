import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dtos/SignIn.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }
    
    @Post('/login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);

        /*
        successfully returning:
        {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGV2ZSIsInBhc3N3b3JkIjoic3F1b2luayIsImlhdCI6MTc1OTQxMDg3MywiZXhwIjoxNzU5NDExMTczfQ.Hr_SSD-rnLN8I8MmzDWvxirTX9Fkq81Dd9ehji_1oUE"
}
        */
    }
    
}
