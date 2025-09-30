import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { DbService } from './db.service';
import { MyAdmin } from './schemas/admin.schema';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { DeleteAdminDto } from './dtos/delete-admin.dto';

@Controller('db')
export class DbController {
    constructor(private dbService: DbService) {
        console.log('dbcontroller constructor');
    }

    @Get()
    async findAll(): Promise<MyAdmin[]> {
        return this.dbService.findAll();
    }


    @Post()    
    async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<MyAdmin> {
        console.log('In post controller');
        //const adminDto = {"name": "Steve", "password": "squoink"};
        return this.dbService.create(createAdminDto);
    }


    @Put()
    async updateAdmin(@Body() updateAdminDto: UpdateAdminDto): Promise<MyAdmin> {
        console.log('in put controller');
        return this.dbService.update(updateAdminDto);
    }

    @Delete()
    async deleteAdmin(@Body() deleteAdminDto: DeleteAdminDto): Promise<MyAdmin> {
        console.log('in put controller');
        return this.dbService.delete(deleteAdminDto);
    }

    /*
      async update(id: string, item: Item): Promise<Item> {
    return this.itemModel.findByIdAndUpdate(id, item, { new: true }).exec();
    */
}

