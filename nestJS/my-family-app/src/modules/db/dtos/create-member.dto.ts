import { IsNumber, IsString } from "class-validator";

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  relationship: string;
}