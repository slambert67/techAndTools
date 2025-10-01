import { IsString } from "class-validator";

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}