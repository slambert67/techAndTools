import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose'; // A HydratedDocument is a Mongoose document that has both your schema’s typed fields and all the Mongoose document methods attached. It’s the standard return type when you query without .lean().

export type MyMemberDocument = HydratedDocument<MyMember>;

@Schema()
export class MyMember {
    @Prop()
    name: string;

    @Prop()
    age: number;

    @Prop()
    relationship: string;
}

export const MyMemberSchema = SchemaFactory.createForClass(MyMember);