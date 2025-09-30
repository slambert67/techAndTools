import { DbService } from './db.service';
import { MyAdmin } from './schemas/admin.schema';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { DeleteAdminDto } from './dtos/delete-admin.dto';
export declare class DbController {
    private dbService;
    constructor(dbService: DbService);
    findAll(): Promise<MyAdmin[]>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<MyAdmin>;
    updateAdmin(updateAdminDto: UpdateAdminDto): Promise<MyAdmin>;
    deleteAdmin(deleteAdminDto: DeleteAdminDto): Promise<MyAdmin>;
}
