import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';

export async function UserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;
  if (!token) throw new UnauthorizedException('Unauthenticated');
  const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOneBy({ username });
  if (user == null) throw new UnauthorizedException('Unauthenticated');
  req.body.user = user;
  next();
}
