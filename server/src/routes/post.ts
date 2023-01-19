import { Response, Request, Router } from "express";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";
import { Sub } from "../entities/Sub";
import { Post } from "../entities/Post";

const router = Router();

const createPost = async (req: Request, res: Response) => {
  const { title, description, sub } = req.body;
  if (title.trim() === "")
    return res.status(400).json({ title: "제목은 비워둘 수 없습니다." });
  const user = res.locals.user;
  try {
    const subRecord = await Sub.findOneByOrFail({ name: sub });
    const post = new Post();
    post.title = title;
    post.body = description;
    post.sub = subRecord;
    post.user = user;
    await post.save();
    return res.json(post);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "포스트 페이지 생성에 실패했습니다." });
  }
};

export default router;

router.post("/", userMiddleware, authMiddleware, createPost);
