import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "../entity/user.entity";
import { UpdateAccessDto,UserBodyDto, UserCreateDto, UserResDto } from "../dto/user.dto";
import { HidePassInterceptor } from "../interceptors/users.interceptor";
import { Auth } from "../guards/apply.guard";

@Controller("user")
export class UserController {
  constructor(private readonly service:UserService){}

  @Get()
  @UseInterceptors(HidePassInterceptor)
  async getUsers():Promise<User[]>{
    return this.service.getUsers();
  }

  @Get(":id")
  @UseInterceptors(HidePassInterceptor)
  async getUser(@Param("id") id:string):Promise<User|string[]>{
    return this.service.getUser(id);
  }

  @Post()
  @UseInterceptors(HidePassInterceptor)
  async createUser(@Body() body:UserCreateDto):Promise<User>{
    return this.service.createUser(body);
  }

  @Post("check")
  async checkUser(@Body() body:UserBodyDto):Promise<UserResDto>{
    return this.service.checkUser(body);
  }

  @Auth()
  @Delete(":id")
  async deleteUser(@Param("id") id:string):Promise<number>{
    return this.service.deleteUser(id);
  }

  @Auth()
  @UseInterceptors(HidePassInterceptor)
  @Put(":id")
  async updateUser(
    @Param("id") id:string,
    @Body() body:UserCreateDto
  ):Promise<User>{
    return this.service.updateUser(id,body);
  }

  @Post("access/:id")
  async updateAccess(
    @Param("id") id:string,
    @Body() body:UpdateAccessDto
  ):Promise<boolean>{
    return this.service.updateAccess(id,body);
  }
}