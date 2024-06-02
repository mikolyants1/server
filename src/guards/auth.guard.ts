import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Request } from "express";
import { User } from "src/entity/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext):boolean {
    try {
      const http:HttpArgumentsHost = ctx.switchToHttp();
      const req:Request = http.getRequest();
      const user = req.user as Pick<User,"id">;
      const id = req.headers["x-user"] as string;
      return user.id == id;
    } catch (e) {
      if (e instanceof Error){
        throw new UnauthorizedException(e.message);
      }
    }
  }
}