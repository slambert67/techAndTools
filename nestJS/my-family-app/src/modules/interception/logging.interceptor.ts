import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    intercept( context: ExecutionContext, next: CallHandler): Observable<any> {
        
        // Anything you put before calling next.handle() executes before the controller method:

        // CallHandler used to invoke route handler at some point in the interceptor

        console.log('Intercepting before route handler');

        const now = Date.now();

        /*
        At this point:
        The request hasn’t reached the controller yet.
        You can log, validate, modify the request, etc.
        */


        /*
            This triggers the controller method.
            Any logic after this point needs to handle the observable stream.
        */

        return next
            .handle()  // returns an observable based on response
            .pipe(
                tap( (x) => { console.log(`Intercepting after route handler ... ${Date.now() - now}`);
                             console.log(x);
            } )
            );
    }
}