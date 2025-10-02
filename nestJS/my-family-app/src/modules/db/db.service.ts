import { Body, ConflictException, Injectable, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MyAdmin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { DeleteAdminDto } from './dtos/delete-admin.dto';
import { MyMember } from './schemas/member.schema';
import { CreateMemberDto } from './dtos/create-member.dto';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { DeleteMemberDto } from './dtos/delete-member.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DbService {

    constructor(    @InjectModel(MyAdmin.name) private adminModel: Model<MyAdmin>,
                    @InjectModel(MyMember.name) private memberModel: Model<MyMember>,
                    private jwtService: JwtService) {
    }



    async findValidAdmin(username: string, pass: string): Promise<MyAdmin | null> {
        const validAdmin = await this.adminModel.findOne( {"name": username, "password": pass} );
        if (!validAdmin) {
            throw new ConflictException(`Admin with name ${username} and password ${pass} does not exist`);
        }
        return validAdmin;
    }

    
    async findAll(): Promise<MyAdmin[]> {
        return await this.adminModel.find().exec();
    }


    async create(createAdminDto: CreateAdminDto): Promise<MyAdmin> {
        const alreadyExists = await this.adminModel.findOne( {"name": createAdminDto.name} );

        if (alreadyExists) {
            throw new ConflictException(`Admin with name ${createAdminDto.name} already exists`);
        }

        const createdAdmin = new this.adminModel(createAdminDto);
        return createdAdmin.save();
    }


    async update(updateAdminDto: UpdateAdminDto): Promise<MyAdmin> {
        const filter = { name: updateAdminDto.name };
        const update = { password: updateAdminDto.password };
        const updated = await this.adminModel.findOneAndUpdate(filter, update);

        if (!updated) {
            throw new NotFoundException(`Admin with name ${updateAdminDto.name} not found`);
        }

        return updated;

    }


    async delete(deleteAdminDto: DeleteAdminDto): Promise<MyAdmin> {
        const filter = { name: deleteAdminDto.name };
        const deleted = await this.adminModel.findOneAndDelete(filter);

        if (!deleted) {
            throw new NotFoundException(`Admin with name ${deleteAdminDto.name} not found`);
        }

        return deleted;

    }


    async findAllMembers(): Promise<MyMember[]> {
        return this.memberModel.find().exec();
    }


    async createMember(createMemberDto: CreateMemberDto): Promise<MyMember> {
        const alreadyExists = await this.memberModel.findOne( {"name": createMemberDto.name} );

        if (alreadyExists) {
            throw new ConflictException(`Member with name ${createMemberDto.name} already exists`);
        }

        const createdAdmin = new this.memberModel(createMemberDto);
        return createdAdmin.save();
    }


    async updateMember(updateMemberDto: UpdateMemberDto): Promise<MyMember> {
        const filter = { name: updateMemberDto.name };
        const update = { age: updateMemberDto.age };
        const updated = await this.memberModel.findOneAndUpdate(filter, update);

        if (!updated) {
            throw new NotFoundException(`Member with name ${updateMemberDto.name} not found`);
        }

        return updated;

    }


    async deleteMember(deleteMemberDto: DeleteMemberDto): Promise<MyMember> {
        const filter = { name: deleteMemberDto.name };
        const deleted = await this.memberModel.findOneAndDelete(filter);

        if (!deleted) {
            throw new NotFoundException(`Member with name ${deleteMemberDto.name} not found`);
        }

        return deleted;

    }
}
