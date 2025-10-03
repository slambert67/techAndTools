import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch(HttpException)
export class MyHttpExceptionFilter implements ExceptionFilter {
   
    catch(exception: HttpException, host: ArgumentsHost) {

        // exception parameter is the exception object currently being processed
        // ArgumentsHost
        //      Powerful utility object
        //      See Execution Context
        //      Here we use it to get a reference to the Request and Response objects
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        console.log('caught my user defined exception');
        
        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url
            });

    }
}