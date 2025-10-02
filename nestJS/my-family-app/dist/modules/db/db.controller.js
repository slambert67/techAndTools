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
exports.DbController = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("./db.service");
const create_admin_dto_1 = require("./dtos/create-admin.dto");
const update_admin_dto_1 = require("./dtos/update-admin.dto");
const delete_admin_dto_1 = require("./dtos/delete-admin.dto");
const update_member_dto_1 = require("./dtos/update-member.dto");
const create_member_dto_1 = require("./dtos/create-member.dto");
const delete_member_dto_1 = require("./dtos/delete-member.dto");
const db_guard_1 = require("./db.guard");
const swagger_1 = require("@nestjs/swagger");
let DbController = class DbController {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async findAll() {
        return this.dbService.findAll();
    }
    async createAdmin(createAdminDto) {
        return this.dbService.create(createAdminDto);
    }
    async updateAdmin(updateAdminDto) {
        return this.dbService.update(updateAdminDto);
    }
    async deleteAdmin(deleteAdminDto) {
        return this.dbService.delete(deleteAdminDto);
    }
    async findAllMembers() {
        return this.dbService.findAllMembers();
    }
    async createMember(createMemberDto) {
        return this.dbService.createMember(createMemberDto);
    }
    async updateMember(updateMemberDto) {
        return this.dbService.updateMember(updateMemberDto);
    }
    async deleteMember(deleteMemberDto) {
        return this.dbService.deleteMember(deleteMemberDto);
    }
};
exports.DbController = DbController;
__decorate([
    (0, common_1.Get)('/admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DbController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('/admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Put)('/admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_admin_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Delete)('/admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_admin_dto_1.DeleteAdminDto]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "deleteAdmin", null);
__decorate([
    (0, common_1.UseGuards)(db_guard_1.DbGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)('/members'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DbController.prototype, "findAllMembers", null);
__decorate([
    (0, common_1.UseGuards)(db_guard_1.DbGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)('/members'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_member_dto_1.CreateMemberDto]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "createMember", null);
__decorate([
    (0, common_1.Put)('/members'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_member_dto_1.UpdateMemberDto]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)('/members'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_member_dto_1.DeleteMemberDto]),
    __metadata("design:returntype", Promise)
], DbController.prototype, "deleteMember", null);
exports.DbController = DbController = __decorate([
    (0, common_1.Controller)('db'),
    __metadata("design:paramtypes", [db_service_1.DbService])
], DbController);
//# sourceMappingURL=db.controller.js.map