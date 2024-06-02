import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Comment } from "../entity/comment.entity";
import { JwtStrategy } from "../strategy/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "../configs/jwt.config";

@Module({
  imports:[
    JwtModule.registerAsync(JwtConfig()),
    TypeOrmModule.forFeature([User,Comment])
  ],
  controllers:[UserController],
  providers:[UserService,JwtStrategy]
})
export class UserModule implements OnModuleInit {
  onModuleInit() {
    const logger = new Logger(UserModule.name);
    logger.log("module init");
  }
}