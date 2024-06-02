import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskBodyDto } from "../dto/task.dto";
import { Task } from "../entity/task.entity";
import { User } from "../entity/user.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class TaskService {
    constructor(
      @InjectRepository(Task)
      private readonly tasks:Repository<Task>,
      @InjectRepository(User)
      private readonly users:Repository<User>
    ){}

    async getUserTasks(id:string):Promise<Task[]>{
      const user:User = await this.users.findOneBy({id});
      return this.tasks.findBy({user});
    }

    async getTask(id:string):Promise<Task>{
      return this.tasks.findOneBy({id});
    }

    async deleteUserTasks(taskId:string,userId:string):Promise<number>{
      const task:DeleteResult = await this.tasks.delete({id:taskId});
      const user:User = await this.users.findOneBy({id:userId});
      await this.users.update({id:userId},{
        raiting:user.raiting + 1
      });
      return task.affected;
    }

    async createUserTasks(id:string,title:string):Promise<Task>{
      const user:User = await this.users.findOneBy({id});
      const newTask:Task = this.tasks.create({title,user});
      return this.tasks.save(newTask);
    }

    async updateUserTasks(id:string,{title}:TaskBodyDto):Promise<Task>{
      await this.tasks.update({id},{title});
      return this.tasks.findOneBy({id});
    }
}