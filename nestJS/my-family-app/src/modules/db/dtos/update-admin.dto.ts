import { IsString } from "class-validator";

export class UpdateAdminDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}