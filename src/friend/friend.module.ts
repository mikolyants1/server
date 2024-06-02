import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { FriendService } from "./friend.service";
import { FriendController } from "./friend.controller";
import { Friend } from "../entity/friend.entity";
import { Invitation } from "../entity/invite.entity";
import { JwtStrategy } from "../strategy/jwt.strategy";
import { JwtConfig } from "../configs/jwt.config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports:[
    JwtModule.registerAsync(JwtConfig()),
    TypeOrmModule.forFeature([User,Friend,Invitation])
  ],
  controllers:[FriendController],
  providers:[FriendService,JwtStrategy]
})
export class FriendModule implements OnModuleInit {
   onModuleInit() {
     const logger = new Logger(FriendModule.name);
     logger.log("module init");
   }
}