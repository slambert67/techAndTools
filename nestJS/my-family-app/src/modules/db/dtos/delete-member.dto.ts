import { IsString } from "class-validator";

export class DeleteMemberDto {
  @IsString()
  name: string;
}