import { MyAdmin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { DeleteAdminDto } from './dtos/delete-admin.dto';
export declare class DbService {
    private adminModel;
    constructor(adminModel: Model<MyAdmin>);
    findAll(): Promise<MyAdmin[]>;
    create(createAdminDto: CreateAdminDto): Promise<MyAdmin>;
    update(updateAdminDto: UpdateAdminDto): Promise<MyAdmin>;
    delete(deleteAdminDto: DeleteAdminDto): Promise<MyAdmin>;
}
