import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID} from 'class-validator';

enum Status {
    CREATED = 'CREATED',
    SETTLED = 'SETTLED',
    FAILED = 'FAILED'
}


export class CreateTransactionDto {
    @IsUUID()
    @IsNotEmpty()
    accountId: string;

    @IsOptional()
    @IsString()
    description?: string;
}
