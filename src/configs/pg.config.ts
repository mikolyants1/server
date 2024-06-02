import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Comment } from '../entity/comment.entity';
import { Friend } from '../entity/friend.entity';
import { Task } from '../entity/task.entity';
import { Invitation } from '../entity/invite.entity';
import { CreateUserMigration } from 'src/migrations/CreateUser.migration';
 
export const PgConfig = ():TypeOrmModuleAsyncOptions => ({
  imports:[ConfigModule],
  inject:[ConfigService],
  useFactory:(service:ConfigService) => ({
    type:"postgres",
    username:service.get<string>("POSTGRES_USER"),
    password:service.get<string>("POSTGRES_PASSWORD"),
    host:service.get<string>("POSTGRES_HOST"),
    port:service.get<number>("POSTGRES_PORT"),
    database:service.get<string>("POSTGRES_DB"),
    entities:[User,Comment,Friend,Task,Invitation],
    migrations:[CreateUserMigration],
    synchronize:true
  })
});