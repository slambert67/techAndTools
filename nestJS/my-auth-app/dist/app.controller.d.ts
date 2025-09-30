import { AppService } from './app.service';
export declare class AppController {
    private appService;
    constructor(appService: AppService);
    signIn(signInDto: Record<string, any>): Promise<any>;
    getProfile(req: any): any;
}
