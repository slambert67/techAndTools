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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    dbService;
    jwtService;
    constructor(dbService, jwtService) {
        this.dbService = dbService;
        this.jwtService = jwtService;
    }
    async signIn(username, pass) {
        const user = await this.dbService.findValidAdmin(username, pass);
        if (user?.password !== pass) {
            throw new common_1.UnauthorizedException();
        }
        const payload = { sub: user.name, password: user.password };
        console.log('signing in');
        console.log(payload);
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map