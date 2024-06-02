import { Logger, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgConfig } from './configs/pg.config';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { TaskModule } from './task/task.module';
import { InviteModule } from './invitation/invite.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:[
        "./src/env/.jwt.env",
        "./src/env/.pg.env"
      ],
      isGlobal:true
    }),
    TypeOrmModule.forRootAsync(PgConfig()),
    UserModule,
    FriendModule,
    TaskModule,
    InviteModule,
    CommentModule
  ],
})
export class AppModule implements OnApplicationBootstrap,OnModuleInit {
  private readonly logger:Logger = new Logger(AppModule.name);
  
  onModuleInit() {
    this.logger.log("app module init");
  }
  onApplicationBootstrap() {
    this.logger.log("all modules success init");
  }
}
