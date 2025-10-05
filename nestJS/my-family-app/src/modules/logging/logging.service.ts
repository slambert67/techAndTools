import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable( {scope: Scope.TRANSIENT} )     // ensures 1 instance per module
export class LoggingService extends ConsoleLogger{

    customLog() {
        this.log('squoink log');
    }

    customLog2( msg: string ) {
        this.log(msg);
    }
}
