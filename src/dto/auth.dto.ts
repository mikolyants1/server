import { IsNotEmpty, IsString } from 'class-validator';

export class AuthUserDto {
    @IsString()
    @IsNotEmpty()
    id:string;

    @IsString()
    @IsNotEmpty()
    username:string;
}
