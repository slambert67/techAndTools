import { HydratedDocument } from 'mongoose';
export type MyMemberDocument = HydratedDocument<MyMember>;
export declare class MyMember {
    name: string;
    age: number;
    relationship: string;
}
export declare const MyMemberSchema: import("mongoose").Schema<MyMember, import("mongoose").Model<MyMember, any, any, any, import("mongoose").Document<unknown, any, MyMember, any, {}> & MyMember & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MyMember, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<MyMember>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<MyMember> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
