import { UseGuards, applyDecorators } from "@nestjs/common";
import { StrategyGuard } from "./strategy.guard";
import { AuthGuard } from "./auth.guard";

export const Auth = () => applyDecorators(
    UseGuards(StrategyGuard),
    UseGuards(AuthGuard)
)