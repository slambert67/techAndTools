import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MyAdmin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { DeleteAdminDto } from './dtos/delete-admin.dto';

@Injectable()
export class DbService {

    constructor(@InjectModel(MyAdmin.name) private adminModel: Model<MyAdmin>) {
        console.log('dbservice constructor')
    }

    async findAll(): Promise<MyAdmin[]> {
        return this.adminModel.find().exec();
    }


    async create(createAdminDto: CreateAdminDto): Promise<MyAdmin> {

        const alreadyExists = await this.findAll();
        console.log('already exists');
        console.log(alreadyExists);
        if (alreadyExists.length > 0) {
            throw new ConflictException(`Admin with name ${createAdminDto.name} already exists`);
        }
        const createdAdmin = new this.adminModel(createAdminDto);
        return createdAdmin.save();
    }


    async update(updateAdminDto: UpdateAdminDto): Promise<MyAdmin> {
        const filter = { name: updateAdminDto.name };
        const update = { password: updateAdminDto.password };
        console.log(`filter = ${filter}`);
        console.log(`update = ${update}`);

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

}
