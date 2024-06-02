import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "../entity/task.entity";
import { Comment } from "../entity/comment.entity";
import { User } from "../entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "../configs/jwt.config";
import { JwtStrategy } from "../strategy/jwt.strategy";

@Module({
  imports:[
    JwtModule.registerAsync(JwtConfig()),
    TypeOrmModule.forFeature([Task,Comment,User])
  ],
  controllers:[CommentController],
  providers:[CommentService,JwtStrategy]
})
export class CommentModule implements OnModuleInit {
  onModuleInit() {
    const logger = new Logger(CommentModule.name);
    logger.log("module init");
  }
}