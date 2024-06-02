import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(config:ConfigService){
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:false,
      secretOrKey:config.get<string>("secret")
    });
  }

  async validate(payload:{id:string}){
    if (!payload.id){
      throw new UnauthorizedException();
    }
    return {...payload}
  }
}