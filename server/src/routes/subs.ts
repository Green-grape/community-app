import { Request, Router, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

const router = Router();

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;
  try {
    const token = req.cookies.token;
    if (!token) next();
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOneBy({ username });
    if (!user)
      return res.status(401).json({ username: "등록되지 않은 사용자입니다." });
    
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default router;
