import { Repository } from "typeorm";
import { CommentService } from "./comment.service";
import { User } from "../entity/user.entity";
import { Task } from "../entity/task.entity";
import { Comment } from "../entity/comment.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { CommentController } from "./comment.controller";
import { PgConfig } from "../configs/pg.config";
import { ConfigModule } from "@nestjs/config";

describe("CommentService",() => {
    const array_user_id:string[] = [];
    const array_task_id:string[] = [];
    const array_comment_id:string[] = [];

    let service:CommentService;
    let userSource:Repository<User>;
    let taskSource:Repository<Task>;
    let commentSource:Repository<Comment>;
    
    beforeEach(async () => {
      const module:TestingModule = await Test.createTestingModule({
        imports:[
          TypeOrmModule.forFeature([Task,Comment,User]),
          TypeOrmModule.forRootAsync(PgConfig()),
          ConfigModule.forRoot({
            envFilePath:[
              "./src/env/.jwt.env",
              "./src/env/.pg.env"
            ],
            isGlobal:true
          }),
        ],
        controllers:[CommentController],
        providers:[CommentService]
      }).compile();

      service = module.get<CommentService>(CommentService);
      userSource = module.get<Repository<User>>(getRepositoryToken(User));
      taskSource = module.get<Repository<Task>>(getRepositoryToken(Task));
      commentSource = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    });

    it("service is defined",() => {
      expect(service).toBeDefined();
    });

    it("create task comment",async () => {
      const user:User = userSource.create({
        username:"comm_name",
        password:"comm_pass",
        tag:"@comm",
        raiting:0
      });
      await userSource.save(user);
      array_user_id.push(user.id);
      const task:Task = taskSource.create({
        title:"task_comment",
        user
      });
      await taskSource.save(task);
      array_task_id.push(task.id);
      const comment = await service
      .createComment(task.id,user.id,{
        author:user.username,
        text:"hello world"
      });
      array_comment_id.push(comment.id);
      expect(comment.author).toBe(user.username);
      expect(comment.author_id).toBe(user.id);
    });

    it("delete task comment",async () => {
        const user:User = userSource.create({
          username:"comm_name1",
          password:"comm_pass1",
          tag:"@comm1",
          raiting:0
        });
        await userSource.save(user);
        array_user_id.push(user.id);
        const task:Task = taskSource.create({
          title:"task_comment",
          user
        });
        await taskSource.save(task);
        array_task_id.push(task.id);
        const comment:Comment = await service
        .createComment(task.id,user.id,{
          author:user.username,
          text:"hello world"
        });
        const del_res = await service
        .deleteTaskComment(comment.id);
        expect(del_res).toEqual(1);
      });

      it("update task comment",async () => {
        const user = userSource.create({
          username:"comm_name2",
          password:"comm_pass2",
          tag:"@comm2",
          raiting:0
        });
        await userSource.save(user);
        array_user_id.push(user.id);
        const task = taskSource.create({
          title:"task_comment",
          user
        });
        await taskSource.save(task);
        array_task_id.push(task.id);
        const comment = await service
        .createComment(task.id,user.id,{
          author:user.username,
          text:"hello world"
        });
        const update_com = await service
        .updateComment(comment.id,"hello again");
        array_comment_id.push(comment.id);
        expect(update_com.text).toBe("hello again");
        expect(update_com.was_update).toBeTruthy();
      });

    afterAll(() => {
      for (const id of array_comment_id) {
        commentSource.delete({id});
      }
      for (const id of array_task_id) {
        taskSource.delete({id});
      }
      for (const id of array_user_id) {
        userSource.delete({id});
      }
    });
});