import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/entities/user.entity';

//express 의존
export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user: User | undefined = res.locals.user;
  if (!user) throw new UnauthorizedException('Unauthenticated');
  next();
}
