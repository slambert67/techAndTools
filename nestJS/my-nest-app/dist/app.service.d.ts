import { OnModuleInit } from '@nestjs/common';
export declare class AppService implements OnModuleInit {
    private familyMembers;
    getFamily(): string[];
    getMember(index: number): string;
    addMember(member: any): void;
    removeMember(index: number): void;
    onModuleInit(): void;
}
