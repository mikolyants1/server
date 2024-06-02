import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { Comment } from "../entity/comment.entity";
import { CommBodyDto } from "../dto/comm.dto";
import { Auth } from "../guards/apply.guard";

@Controller("comments")
export class CommentController {
    constructor(private readonly service:CommentService){}

    @Get(":id")
    async getTaskComments(@Param("id") id:string):Promise<Comment[]>{
      return this.service.getTaskComments(id);
    }

    @Auth()
    @Post(":id")
    async createComment(
      @Headers("x-user") userId:string,
      @Param("id") id:string,
      @Body() body:CommBodyDto
    ):Promise<Comment>{
      return this.service.createComment(id,userId,body);
    }

    @Auth()
    @Delete(":id")
    async deleteComment(@Param("id") commId:string):Promise<number>{
      return this.service.deleteTaskComment(commId);
    }

    @Auth()
    @Put(":id")
    async updateComment(
      @Param("id") id:string,
      @Body() body:Omit<CommBodyDto,"author">
    ):Promise<Comment>{
      return this.service.updateComment(id,body.text);
    }

}