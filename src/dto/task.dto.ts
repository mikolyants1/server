import { IsNotEmpty, IsString } from "class-validator";

export class TaskBodyDto {
    @IsString()
    @IsNotEmpty()
    title:string;
}
