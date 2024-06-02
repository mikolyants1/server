import { OmitType } from "@nestjs/mapped-types";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CommBodyDto {
    @IsNotEmpty()
    @IsString()
    text:string;

    @IsNotEmpty()
    @IsString()
    author:string;
}

export class UpdateCommDto extends OmitType(CommBodyDto,["author"]) {
   @IsBoolean()
   was_update?:boolean;
}