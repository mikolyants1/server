import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { InviteController } from "./invite.controller";
import { InviteService } from "./invite.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invitation } from "../entity/invite.entity";
import { User } from "../entity/user.entity";
import { JwtStrategy } from "src/strategy/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "../configs/jwt.config";

@Module({
  imports:[
    JwtModule.registerAsync(JwtConfig()),
    TypeOrmModule.forFeature([Invitation,User])
  ],
  controllers:[InviteController],
  providers:[InviteService,JwtStrategy]
})
export class InviteModule implements OnModuleInit {
  onModuleInit() {
    const logger = new Logger(InviteModule.name);
    logger.log("module init");
  }
}