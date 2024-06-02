import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { Friend } from "../entity/friend.entity";
import { FriendBodyDto } from "../dto/friend.dto";
import { EFriendAction } from "../enums/friend.enum";
import { Auth } from "../guards/apply.guard";

@Controller("friend")
export class FriendController {
    constructor(private readonly service:FriendService){}

    @Get(":id")
    async getUserfriends(@Param("id") id:string):Promise<Friend[]>{
      return this.service.getUserFriends(id);
    }

    @Auth()
    @Post()
    async actionWithFriend(
      @Headers("x-user") userId:string,
      @Body() {action,friendId}:FriendBodyDto
    ):Promise<Friend[]|number>{
      if (action == EFriendAction.ADD){
        return this.service.addFriend(userId,friendId);
      }
      return this.service.delFriend(userId,friendId);
    }
}