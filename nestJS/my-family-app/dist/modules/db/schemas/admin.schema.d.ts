import { HydratedDocument } from 'mongoose';
export type MyAdminDocument = HydratedDocument<MyAdmin>;
export declare class MyAdmin {
    name: string;
    password: string;
}
export declare const MyAdminSchema: import("mongoose").Schema<MyAdmin, import("mongoose").Model<MyAdmin, any, any, any, import("mongoose").Document<unknown, any, MyAdmin, any, {}> & MyAdmin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MyAdmin, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<MyAdmin>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MyAdmin> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
