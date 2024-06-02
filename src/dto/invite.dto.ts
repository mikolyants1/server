import { IsNotEmpty, IsString } from "class-validator";

export class InviteBodyDto {
    @IsString()
    @IsNotEmpty()
    recipient:string;
}
