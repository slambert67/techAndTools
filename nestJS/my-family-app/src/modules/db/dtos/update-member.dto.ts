import { IsNumber, IsString } from "class-validator";

export class UpdateMemberDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsString()
  relationship: string;
}