import { IsNotEmpty, IsString } from "class-validator";
import { EFriendAction } from "../enums/friend.enum";

export class FriendBodyDto {
   @IsString()
   @IsNotEmpty()
   friendId:string;

   @IsString()
   @IsNotEmpty()
   action:EFriendAction;
}