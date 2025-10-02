import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// @ApiProperty is from @nestjs/swagger. Show in schemas section of the swagger
// @IsString is from class-validator

export class SignInDto {
    @ApiProperty({ description: 'The username of the admin' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'The password of the admin' })
    @IsString()
    password: string;

}