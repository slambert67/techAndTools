"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_schema_1 = require("./schemas/admin.schema");
const mongoose_2 = require("mongoose");
let DbService = class DbService {
    adminModel;
    constructor(adminModel) {
        this.adminModel = adminModel;
        console.log('dbservice constructor');
    }
    async findAll() {
        return this.adminModel.find().exec();
    }
    async create(createAdminDto) {
        const createdAdmin = new this.adminModel(createAdminDto);
        return createdAdmin.save();
    }
    async update(updateAdminDto) {
        const filter = { name: updateAdminDto.name };
        const update = { password: updateAdminDto.password };
        console.log(`filter = ${filter}`);
        console.log(`update = ${update}`);
        const updated = await this.adminModel.findOneAndUpdate(filter, update);
        if (!updated) {
            throw new common_1.NotFoundException(`Admin with name ${updateAdminDto.name} not found`);
        }
        return updated;
    }
    async delete(deleteAdminDto) {
        const filter = { name: deleteAdminDto.name };
        const deleted = await this.adminModel.findOneAndDelete(filter);
        if (!deleted) {
            throw new common_1.NotFoundException(`Admin with name ${deleteAdminDto.name} not found`);
        }
        return deleted;
    }
};
exports.DbService = DbService;
exports.DbService = DbService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.MyAdmin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DbService);
//# sourceMappingURL=db.service.js.map