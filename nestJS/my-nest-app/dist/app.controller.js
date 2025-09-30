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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getFamily(request, parameters) {
        console.log(`params = ${parameters.toString}`);
        return this.appService.getFamily();
    }
    getMember(index) {
        console.log('get member by path');
        return this.appService.getMember(index);
    }
    getMemberbyQuery(index) {
        console.log('get member by query');
        return this.appService.getMember(index);
    }
    addMember(newMember) {
        console.log('creating new member');
        this.appService.addMember(newMember.name);
        return 'created new member';
    }
    removeMember(index) {
        this.appService.removeMember(index);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Array]),
    __metadata("design:returntype", Array)
], AppController.prototype, "getFamily", null);
__decorate([
    (0, common_1.Get)('mine/:index'),
    __param(0, (0, common_1.Param)('index', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMember", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Query)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMemberbyQuery", null);
__decorate([
    (0, common_1.Post)('mine'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)('mine/:index'),
    __param(0, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "removeMember", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('family'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map