import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { OmitType } from '@nestjs/mapped-types';

export class UserBodyDto {
    @IsString()
    @IsNotEmpty()
    username:string;
  
    @IsString()
    @IsNotEmpty()
    password:string;

    @IsBoolean()
    @IsNotEmpty()
    isLogin:boolean;
  }
  
  export class UserCreateDto extends OmitType(UserBodyDto,["isLogin"]){
    @IsString()
    @IsNotEmpty()
    tag:string;
  }

  export class UserResDto {
    @IsString()
    @IsNotEmpty()
    id:string;
  
    @IsString()
    @IsNotEmpty()
    token:string;

    @IsBoolean()
    @IsNotEmpty()
    success:boolean;

    @IsString()
    @IsNotEmpty()
    tag:string;

    @IsString()
    @IsNotEmpty()
    message:string;
  }

  export class UpdateAccessDto {
    @IsString()
    @IsNotEmpty()
    check_pass:string;

    @IsString()
    @IsNotEmpty()
    check_name:string;

  }