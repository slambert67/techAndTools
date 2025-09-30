import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {

  private familyMembers: string[] = ['Steve', 'Julie', 'Andy'];
  

  getFamily(): string[] {
    return this.familyMembers;
  }

  getMember(index: number): string {
    return this.familyMembers[index];
  }

  addMember(member:any) {
    this.familyMembers.push(member);
  }


  removeMember(index: number) {
    this.familyMembers.splice(index,1);
  }


  onModuleInit() {
    console.log('AppService onModuleInit executed');
  }
}
