"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_schema_1 = require("./schemas/admin.schema");
const db_controller_1 = require("./db.controller");
const db_service_1 = require("./db.service");
const member_schema_1 = require("./schemas/member.schema");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./constants");
let DbModule = class DbModule {
};
exports.DbModule = DbModule;
exports.DbModule = DbModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: admin_schema_1.MyAdmin.name, schema: admin_schema_1.MyAdminSchema },
                { name: member_schema_1.MyMember.name, schema: member_schema_1.MyMemberSchema }
            ]),
            jwt_1.JwtModule.register({
                global: true,
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '300s' },
            }),
        ],
        controllers: [db_controller_1.DbController],
        providers: [db_service_1.DbService],
        exports: [db_service_1.DbService]
    })
], DbModule);
//# sourceMappingURL=db.module.js.map