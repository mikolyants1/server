import { Test, TestingModule } from "@nestjs/testing";
import { TaskService } from "./task.service";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { PgConfig } from "../configs/pg.config";
import { User } from "../entity/user.entity";
import { Task } from "../entity/task.entity";
import { TaskController } from "./task.controller";
import { Repository } from "typeorm";
import { ConfigModule } from "@nestjs/config";

describe("TaskService",() => {
  const user_array_id:string[] = [];
  const task_array_id:string[] = [];

  let service:TaskService;
  let userSource:Repository<User>;
  let taskSource:Repository<Task>;

  beforeEach(async () => {
   const module:TestingModule = await Test.createTestingModule({
    imports:[
      ConfigModule.forRoot({
        envFilePath:[
          "./src/env/.jwt.env",
          "./src/env/.pg.env"
        ],
        isGlobal:true
      }),
      TypeOrmModule.forRootAsync(PgConfig()),
      TypeOrmModule.forFeature([User,Task])
    ],
    controllers:[TaskController],
    providers:[TaskService]
   }).compile();
   service = module.get<TaskService>(TaskService);
   userSource = module.get<Repository<User>>(getRepositoryToken(User));
   taskSource = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

   it("taskservice is define",() => {
     expect(service).toBeDefined();
   });
   
   it("create user tasks",async () => {
     const user:User = userSource.create({
        username:"task_name",
        password:"task_pass",
        tag:"@task_tag",
        raiting:0
     });
     const create_user:User = await userSource.save(user);
     user_array_id.push(create_user.id);
     const create_task:Task = await service
     .createUserTasks(create_user.id,"test_task1");
     task_array_id.push(create_task.id);
     expect(create_task.title).toBe("test_task1");
   });

   it("update user tasks",async () => {
    const user:User = userSource.create({
       username:"task_name1",
       password:"task_pass1",
       tag:"@task_tag1",
       raiting:0
    });
    const create_user:User = await userSource.save(user);
    user_array_id.push(create_user.id);
    const create_task:Task = await service
    .createUserTasks(create_user.id,"test_task1");
    task_array_id.push(create_task.id);
    const update_task:Task = await service
    .updateUserTasks(create_task.id,{
        title:"update_task1"
    });
    expect(update_task.title).toBe("update_task1");
  });

   it("delete user tasks",async () => {
    const user = userSource.create({
       username:"task_name2",
       password:"task_pass2",
       tag:"@task_tag2",
       raiting:0
    });
    const create_user = await userSource.save(user);
    user_array_id.push(create_user.id);
    const create_task = await service
    .createUserTasks(create_user.id,"test_task2");
    const del_res = await service
    .deleteUserTasks(create_task.id,create_user.id);
    const get_user = await userSource
    .findOneBy({id:create_user.id});
    expect(get_user.raiting).toEqual(user.raiting + 1);
    expect(del_res).toEqual(1);
  });

   afterAll(async () => {
     for (const id of task_array_id) {
        taskSource.delete(id);
     }
     for (const id of user_array_id) {
        userSource.delete(id);
     }
   })
});