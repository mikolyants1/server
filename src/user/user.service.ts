import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateAccessDto, UserBodyDto, UserCreateDto, UserResDto } from "../dto/user.dto";
import { DeleteResult, Repository } from "typeorm";
import * as bc from 'bcryptjs';
import { User } from "../entity/user.entity";
import { Comment } from "../entity/comment.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService implements OnApplicationShutdown {
    constructor(
      @InjectRepository(User)
      private readonly users:Repository<User>,
      @InjectRepository(Comment)
      private readonly comments:Repository<Comment>,
      private readonly jwt:JwtService
    ){}

    onApplicationShutdown(signal?: string) {
      const logger = new Logger(UserService.name);
      logger.log(signal);
    }

    async getUsers():Promise<User[]>{
      return this.users.find();
    }

    async getUser(id:string):Promise<User|string[]>{
      if (id == 'tags') return this.getUserTags();
      return this.users.findOneBy({id});
    }

    async createUser({password,tag,username}:UserCreateDto):Promise<User>{
      const hash_pass = await bc.hash(password,10);
      const newUser:User = this.users.create({
        username,
        tag,
        password:hash_pass,
        raiting:0,
      });
      return this.users.save(newUser);
    }

    async checkUser({username,password,isLogin}:UserBodyDto):Promise<UserResDto>{
      const user = await this.users.findOneBy({username});
      if (!isLogin){
        const success = !Boolean(user);
        return {
          id:"",
          success,
          message:success ? "" : "username should be unique",
          tag:"",
          token:""
        }
      }
      const user_password = user.password || "";
      const success = await bc.compare(password,user_password);
      const token = success ? this.jwt.sign({id:user.id}) : "";
      const right_user = user && success;
      return {
        id: right_user ? user.id : "",
        token,
        success,
        tag:right_user ? user.tag : "",
        message:success ? "" : "user not found"
      }
    }

    async deleteUser(id:string):Promise<number>{
      const user:DeleteResult = await this.users.delete({id});
      return user.affected;
    }

    async updateAccess(id:string,{check_name,check_pass}:UpdateAccessDto):Promise<boolean>{
      const {username,password}:User = await this.users.findOneBy({id});
      const correctName:boolean = username == check_name;
      const correctPass:boolean = bc.compareSync(check_pass,password);
      return correctName && correctPass;
    }

    async updateUser(id:string,{password,username,tag}:UserCreateDto):Promise<User>{
      const user:User = await this.users.findOneBy({id});
      if (username && username !== user.username){
        await this.comments.update({author:user.username},{
          author:username
        });
      }
       await this.users.update({id},{
        username:username || user.username,
        password:password ? bc.hashSync(password,10) : user.password,
        tag:tag || user.tag
      });
      return this.users.findOneBy({id});
    }

    async getUserTags():Promise<string[]>{
      const users:User[] = await this.users.find();
      return users.map((u:User) => u.tag);
    }
}