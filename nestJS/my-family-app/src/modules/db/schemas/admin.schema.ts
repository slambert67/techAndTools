import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose'; // A HydratedDocument is a Mongoose document that has both your schema’s typed fields and all the Mongoose document methods attached. It’s the standard return type when you query without .lean().

export type MyAdminDocument = HydratedDocument<MyAdmin>;

@Schema()
export class MyAdmin {
    @Prop()
    name: string;

    @Prop()
    password: string;
}

export const MyAdminSchema = SchemaFactory.createForClass(MyAdmin);