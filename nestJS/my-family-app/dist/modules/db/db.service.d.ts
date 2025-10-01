import { MyAdmin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { DeleteAdminDto } from './dtos/delete-admin.dto';
import { MyMember } from './schemas/member.schema';
import { CreateMemberDto } from './dtos/create-member.dto';
import { UpdateMemberDto } from './dtos/update-member.dto';
import { DeleteMemberDto } from './dtos/delete-member.dto';
export declare class DbService {
    private adminModel;
    private memberModel;
    constructor(adminModel: Model<MyAdmin>, memberModel: Model<MyMember>);
    findAll(): Promise<MyAdmin[]>;
    create(createAdminDto: CreateAdminDto): Promise<MyAdmin>;
    update(updateAdminDto: UpdateAdminDto): Promise<MyAdmin>;
    delete(deleteAdminDto: DeleteAdminDto): Promise<MyAdmin>;
    findAllMembers(): Promise<MyMember[]>;
    createMember(createMemberDto: CreateMemberDto): Promise<MyMember>;
    updateMember(updateMemberDto: UpdateMemberDto): Promise<MyMember>;
    deleteMember(deleteMemberDto: DeleteMemberDto): Promise<MyMember>;
}
