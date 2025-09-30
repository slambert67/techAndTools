import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getFamily(request: Request, parameters: string[]): string[];
    getMember(index: number): string;
    getMemberbyQuery(index: number): string;
    addMember(newMember: any): string;
    removeMember(index: number): void;
}
