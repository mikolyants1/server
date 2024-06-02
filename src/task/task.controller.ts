import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Task } from "../entity/task.entity";
import { TaskBodyDto } from "../dto/task.dto";
import { Auth } from "../guards/apply.guard";

@Controller("task")
export class TaskController {
    constructor(private readonly service:TaskService){}

    @Get(":id")
    async getTask(@Param("id") id:string):Promise<Task>{
      return this.service.getTask(id);
    }
    @Get("user/:id")
    async getUserTasks(@Param("id") id:string):Promise<Task[]>{
      return this.service.getUserTasks(id);
    }
    
    @Auth()
    @Post()
    async createUserTask(
      @Headers("x-user") id:string,
      @Body() body:TaskBodyDto
    ):Promise<Task>{
      return this.service.createUserTasks(id,body.title);
    }

    @Auth()
    @Delete(":id")
    async deleteTask(
      @Param("id") taskId:string,
      @Headers("x-user") userId:string
    ):Promise<number>{
      return this.service.deleteUserTasks(taskId,userId);
    }

    @Auth()
    @Put(":id")
    async updateTask(
      @Param("id") id:string,
      @Body() body:TaskBodyDto
    ):Promise<Task>{
      return this.service.updateUserTasks(id,body);
    }
}