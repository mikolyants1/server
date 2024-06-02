import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, catchError, map, throwError } from "rxjs";
import { User } from "../entity/user.entity";

@Injectable()
export class HidePassInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler<any>):Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)){
          const users = data as User[];
          return users.map((u:User) => {
            const {password,...user} = u;
            return user;
          });
        } else {
          const {password,...user} = data as User;
          return user;
        }
      }),
      catchError(throwError)
    );
  }
}