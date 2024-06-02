import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Task } from "../entity/task.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "../configs/jwt.config";
import { JwtStrategy } from "../strategy/jwt.strategy";

@Module({
  imports:[
    JwtModule.registerAsync(JwtConfig()),
    TypeOrmModule.forFeature([User,Task])
  ],
  controllers:[TaskController],
  providers:[TaskService,JwtStrategy]
})
export class TaskModule implements OnModuleInit {
  onModuleInit() {
    const logger = new Logger(TaskModule.name);
    logger.log("module init");
  }
}