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
const member_schema_1 = require("./schemas/member.schema");
const jwt_1 = require("@nestjs/jwt");
let DbService = class DbService {
    adminModel;
    memberModel;
    jwtService;
    constructor(adminModel, memberModel, jwtService) {
        this.adminModel = adminModel;
        this.memberModel = memberModel;
        this.jwtService = jwtService;
    }
    async findValidAdmin(username, pass) {
        const validAdmin = await this.adminModel.findOne({ "name": username, "password": pass });
        if (!validAdmin) {
            throw new common_1.ConflictException(`Admin with name ${username} and password ${pass} does not exist`);
        }
        return validAdmin;
    }
    async findAll() {
        return await this.adminModel.find().exec();
    }
    async create(createAdminDto) {
        const alreadyExists = await this.adminModel.findOne({ "name": createAdminDto.name });
        if (alreadyExists) {
            throw new common_1.ConflictException(`Admin with name ${createAdminDto.name} already exists`);
        }
        const createdAdmin = new this.adminModel(createAdminDto);
        return createdAdmin.save();
    }
    async update(updateAdminDto) {
        const filter = { name: updateAdminDto.name };
        const update = { password: updateAdminDto.password };
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
    async findAllMembers() {
        return this.memberModel.find().exec();
    }
    async createMember(createMemberDto) {
        const alreadyExists = await this.memberModel.findOne({ "name": createMemberDto.name });
        if (alreadyExists) {
            throw new common_1.ConflictException(`Member with name ${createMemberDto.name} already exists`);
        }
        const createdAdmin = new this.memberModel(createMemberDto);
        return createdAdmin.save();
    }
    async updateMember(updateMemberDto) {
        const filter = { name: updateMemberDto.name };
        const update = { age: updateMemberDto.age };
        const updated = await this.memberModel.findOneAndUpdate(filter, update);
        if (!updated) {
            throw new common_1.NotFoundException(`Member with name ${updateMemberDto.name} not found`);
        }
        return updated;
    }
    async deleteMember(deleteMemberDto) {
        const filter = { name: deleteMemberDto.name };
        const deleted = await this.memberModel.findOneAndDelete(filter);
        if (!deleted) {
            throw new common_1.NotFoundException(`Member with name ${deleteMemberDto.name} not found`);
        }
        return deleted;
    }
};
exports.DbService = DbService;
exports.DbService = DbService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.MyAdmin.name)),
    __param(1, (0, mongoose_1.InjectModel)(member_schema_1.MyMember.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], DbService);
//# sourceMappingURL=db.service.js.map