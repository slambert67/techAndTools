import { Controller, Get, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { MyHttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('exceptions')
export class ExceptionsController {

    constructor() {}

    @Get('/ex1')
    @UseFilters( new MyHttpExceptionFilter() )
    async ex1(): Promise<any> {
        console.log('exceptions endpoint reached - raising a new exception');
        
        throw new HttpException('squoink', HttpStatus.EXPECTATION_FAILED);
    }
}
