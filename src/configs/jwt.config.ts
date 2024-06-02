import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";

export const JwtConfig = ():JwtModuleAsyncOptions => ({
   imports:[ConfigModule],
   inject:[ConfigService],
   useFactory:(service:ConfigService)=>({
      secret:service.get("secret"),
      signOptions:{
        expiresIn:"24h"
      }
   })
})