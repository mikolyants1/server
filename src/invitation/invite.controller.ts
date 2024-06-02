import { Body, Controller, Delete, Get, Headers, Param, Post } from "@nestjs/common";
import { InviteService } from "./invite.service";
import { Invitation } from "../entity/invite.entity";
import { InviteBodyDto } from "../dto/invite.dto";
import { Auth } from "../guards/apply.guard";

@Controller("invitation")
export class InviteController {
  constructor(private readonly service:InviteService){}

  @Get("recipient/:id")
  async getRecipient(@Param("id") id:string):Promise<Invitation[]>{
    return this.service.getInviteRecipient(id);
  }

  @Get("adresser/:id")
  async getAdresser(@Param("id") id:string):Promise<Invitation[]>{
    return this.service.getInviteAdresser(id);
  }

  @Auth()
  @Delete(":id")
  async deleteInvitation(@Param("id") id:string):Promise<number>{
    return this.service.deleteInvite(id);
  }

  @Auth()
  @Post()
  async createInvitation(
    @Headers("x-user") userId:string,
    @Body() body:InviteBodyDto
  ):Promise<Invitation>{
    return this.service.createInvite(userId,body);
  }
}