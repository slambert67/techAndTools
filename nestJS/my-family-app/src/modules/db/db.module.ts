import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyAdmin, MyAdminSchema } from './schemas/admin.schema';
import { DbController } from './db.controller';
import { DbService } from './db.service';
import { MyMember, MyMemberSchema } from './schemas/member.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
    imports: [
        MongooseModule.forFeature([ {name: MyAdmin.name, schema: MyAdminSchema}, 
                                    {name: MyMember.name, schema: MyMemberSchema}
        ]),  
        // forFeature
        //      Used in feature modules (e.g., CatsModule, UsersModule).
        //      It registers specific models (collections) with NestJS DI (Dependency Injection).
        //
        // name can be any string. But Admin.name === class name i.e. Admin. 
        // It tells NestJS under what name to register the Mongoose model.
        // Later, when you inject it with @InjectModel(), you must use the same name
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '300s' },
        }),
    ],
    controllers: [DbController],
    providers: [DbService],
    exports: [DbService]
})
export class DbModule {}
