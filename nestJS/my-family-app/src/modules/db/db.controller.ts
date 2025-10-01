import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { DbService } from './db.service';
import { MyAdmin } from './schemas/admin.schema';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { DeleteAdminDto } from './dtos/delete-admin.dto';
import { MyMember } from './schemas/member.schema';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { CreateMemberDto } from './dtos/create-member.dto';
import { DeleteMemberDto } from './dtos/delete-member.dto';

@Controller('db')
export class DbController {
    constructor(private dbService: DbService) {
    }

    @Get('/admin')
    async findAll(): Promise<MyAdmin[]> {
        return this.dbService.findAll();
    }


    @Post('/admin')    
    async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<MyAdmin> {
        return this.dbService.create(createAdminDto);
    }


    @Put('/admin')
    async updateAdmin(@Body() updateAdminDto: UpdateAdminDto): Promise<MyAdmin> {
        return this.dbService.update(updateAdminDto);
    }

    @Delete('/admin')
    async deleteAdmin(@Body() deleteAdminDto: DeleteAdminDto): Promise<MyAdmin> {
        return this.dbService.delete(deleteAdminDto);
    }


    @Get('/members')
    async findAllMembers(): Promise<MyMember[]> {
        return this.dbService.findAllMembers();
    }


    @Post('/members')    
    async createMember(@Body() createMemberDto: CreateMemberDto): Promise<MyMember> {
        return this.dbService.createMember(createMemberDto);
    }


    @Put('/members')
    async updateMember(@Body() updateMemberDto: UpdateMemberDto): Promise<MyMember> {
        return this.dbService.updateMember(updateMemberDto);
    }

    @Delete('/members')
    async deleteMember(@Body() deleteMemberDto: DeleteMemberDto): Promise<MyMember> {
        return this.dbService.deleteMember(deleteMemberDto);
    }
}

