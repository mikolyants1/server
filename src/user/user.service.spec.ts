import { Test, TestingModule } from "@nestjs/testing"
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { Comment } from "../entity/comment.entity";
import { User } from "../entity/user.entity";
import { PgConfig } from "../configs/pg.config";
import { ConfigModule } from "@nestjs/config";
import { Repository} from "typeorm";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "../configs/jwt.config";

describe("UserService", () => {
  const array_id:string[] = [];
  
  let service:UserService;
  let userDatabase:Repository<User>;

  beforeEach(async () => {
    const module:TestingModule = await Test.createTestingModule({
      imports:[
        JwtModule.registerAsync(JwtConfig()),
        ConfigModule.forRoot({
          envFilePath:[
            "./src/env/.jwt.env",
            "./src/env/.pg.env"
          ],
          isGlobal:true
        }),
        TypeOrmModule.forRootAsync(PgConfig()),
        TypeOrmModule.forFeature([Comment,User])
      ],
      controllers:[UserController],
      providers:[UserService]
    }).compile();
    service = module.get<UserService>(UserService);
    userDatabase = module.get<Repository<User>>(getRepositoryToken(User));
  });
  
  it("service should be defined", () => {
    expect(service).toBeDefined();
  });

  it("check user",async () => {
    const user = await service.createUser({
      username:"check_name",
      password:"check_password",
      tag:"@check_tag"
    });
    array_id.push(user.id);
    await userDatabase.save(user);
    const check_regist = await service.checkUser({
      username:user.username,
      password:user.password,
      isLogin:false
    });
    expect(check_regist.message).toBe("username should be unique");
  });

  it("create user",async () => {
    const user = await service.createUser({
      username:"test_name",
      password:"test_password",
      tag:"@test_tag"
    });
    array_id.push(user.id);
    await userDatabase.save(user);
    expect(user.username).toBe("test_name");
    expect(user.tag).toBe("@test_tag");
  });

  it("find user",async () => {
    const user = await service.createUser({
      username:"test_name1",
      password:"test_password1",
      tag:"@test_tag1"
    });
    array_id.push(user.id);
    await userDatabase.save(user);
    expect(await service.getUser(user.id)).toBeDefined();
  });

  it("remove user",async () => {
    const user = await service.createUser({
      username:"test_name2",
      password:"test_password2",
      tag:"@test_tag2"
    });
    await userDatabase.save(user)
    const del_res = await service.deleteUser(user.id);
    expect(del_res).toEqual(1);
  });

  it("update user",async () => {
    const user = await service.createUser({
      username:"test_name3",
      password:"test_password3",
      tag:"@test_tag3"
    });
    array_id.push(user.id);
    await userDatabase.save(user);
    const result = await service.updateUser(user.id,{
      username:"new_username1",
      password:"new_password",
      tag:"@new_tag1"
    });
    expect(result.username).toBe("new_username1");
    expect(result.tag).toBe("@new_tag1");
  });

  it("get all users",async () => {
    const user = await service.createUser({
      username:"test_name3",
      password:"test_password3",
      tag:"@test_tag3"
    });
    array_id.push(user.id);
    await userDatabase.save(user);
    jest.spyOn(service,"getUsers")
    .mockImplementation(async () => [user]);
    jest.spyOn(service,"getUserTags")
    .mockImplementation(async () => [user.tag]);
  });
  
  afterAll(async () => {
    for (const id of array_id) {
      userDatabase.delete({id});
    }
  });
})