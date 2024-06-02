import { AuthGuard } from "@nestjs/passport";

export class StrategyGuard extends AuthGuard("jwt"){}