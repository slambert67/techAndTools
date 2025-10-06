import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    intercept( context: ExecutionContext, next: CallHandler): Observable<any> {
        
        // CallHandler used to invoke route handler at some point in the interceptor

        console.log('Intercepting before route handler');

        const now = Date.now();

        return next
            .handle()  // returns an observable based on response
            .pipe(
                tap( (x) => { console.log(`Intercepting after route handler ... ${Date.now() - now}`);
                             console.log(x);
            } )
            );
    }
}