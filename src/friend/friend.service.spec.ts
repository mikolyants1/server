import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { PgConfig } from "../configs/pg.config";
import { Friend } from "../entity/friend.entity";
import { Invitation } from "../entity/invite.entity";
import { User } from "../entity/user.entity";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";
import { Repository } from "typeorm";

describe('friendService', () => { 
  const array_user_id:string[] = [];
  const array_friend_id:string[] = [];

  let service:FriendService;
  let userSource:Repository<User>;
  let inviteSource:Repository<Invitation>;
  let friendSource:Repository<Friend>;
  
  beforeEach(async () => {
    const module:TestingModule = await Test.createTestingModule({
      imports:[
        TypeOrmModule.forFeature([User,Friend,Invitation]),
        TypeOrmModule.forRootAsync(PgConfig()),
        ConfigModule.forRoot({
          envFilePath:[
            "./src/env/.jwt.env",
            "./src/env/.pg.env"
          ],
          isGlobal:true
        })
      ],
      controllers:[FriendController],
      providers:[FriendService]
    }).compile();

    service = module.get<FriendService>(FriendService);
    userSource = module.get<Repository<User>>(getRepositoryToken(User));
    inviteSource = module.get<Repository<Invitation>>(getRepositoryToken(Invitation));
    friendSource = module.get<Repository<Friend>>(getRepositoryToken(Friend));
  });

  it("service define",() => {
    expect(service).toBeDefined();
  });

  it("add friend",async () => {
    const users =  userSource.create([
        {
          username:"friend_name",
          password:"friend_pass",
          tag:"@friend",
          raiting:0
        },
        {
          username:"friend_name1",
          password:"friend_pass1",
          tag:"@friend1",
          raiting:0
        }
    ]);
    await userSource.save(users);
    array_user_id.push(users[0].id,users[1].id);
    const user = await userSource.findOneBy({id:users[1].id});
    const newInvite = inviteSource.create({
      addresser:users[0].id,
      recipient:users[1].id,
      user
    });
    await inviteSource.save(newInvite);
    const new_friend = await service.addFriend(users[1].id,users[0].id);
    array_friend_id.push(new_friend[0].id,new_friend[1].id);
    expect(new_friend[0].friend_id).toBe(users[0].id);
    expect(new_friend[1].friend_id).toBe(users[1].id);
  });

  it("del friend",async () => {
    const users =  userSource.create([
        {
          username:"friend_name2",
          password:"friend_pass2",
          tag:"@friend2",
          raiting:0
        },
        {
          username:"friend_name3",
          password:"friend_pass3",
          tag:"@friend3",
          raiting:0
        }
    ]);
    await userSource.save(users);
    array_user_id.push(users[0].id,users[1].id);
    const user = await userSource.findOneBy({id:users[1].id});
    const newInvite = inviteSource.create({
      addresser:users[0].id,
      recipient:users[1].id,
      user
    });
    await inviteSource.save(newInvite);
    await service.addFriend(users[1].id,users[0].id);
    await service.delFriend(users[1].id,users[0].id);
    const friend1 = await service.getUserFriends(users[0].id);
    const friend2 = await service.getUserFriends(users[1].id);
    expect(friend1.some(f => f.friend_id == user[1].id)).toBeFalsy();
    expect(friend2.some(f => f.friend_id == user[0].id)).toBeFalsy();
  });

  afterAll(() => {
    for (const id of array_friend_id) {
      friendSource.delete({id});
    }
    for (const id of array_user_id) {
      userSource.delete({id});
    }
  });
});