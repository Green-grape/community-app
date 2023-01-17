import { isEmpty } from "class-validator";
import { Request, Router, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Sub } from "../entities/Sub";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

const router = Router();

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  try {
    let customError: any = {};
    if (isEmpty(name)) customError.name = "이름을 비워둘 수 없습니다.";
    if (isEmpty(title)) customError.title = "제목을 비워둘 수 없습니다.";
    if (!isEmpty(name)) {
      const sub = await AppDataSource.getRepository(Sub)
        .createQueryBuilder("sub")
        .where("lower(sub.name)=:name", { name: name.toLowerCase() })
        .getOne();
      if (sub) customError.name = "서브가 이미 존재합니다.";
    }
    if (Object.keys(customError).length > 0) throw customError;
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }

  try {
    const user: User = res.locals.user;
    const newSub = new Sub();
    newSub.name = name;
    newSub.title = title;
    newSub.description = description;
    newSub.user = user;
    await newSub.save();
    return res.json(newSub);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "db error" });
  }
};

const topSubs = async (req: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE(s.imageUrn , 'https://www.gravatar.com/avatar?d=mp&f=y')`;
    const subs = await AppDataSource.createQueryBuilder(Sub, "s")
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .leftJoin(Post, "p", `s.name = p.subName`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, "DESC")
      .limit(5)
      .execute();
    return res.json(subs);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e);
  }
};

const getSub = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const sub = await Sub.findOneByOrFail({ name });
    return res.json(sub);
  } catch (error) {
    return res.json(404).json({ error: "sub is not found" });
  }
};

//현재 sub가 수정을 요청한 사용자의 것인지 확인
const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneBy({ name: req.params.subname });
    if (sub.username !== user.username)
      return res
        .status(403)
        .json({ error: "이 커뮤니티를 소유하고 있지 않습니다." });
    res.locals.sub = sub;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "DB 내부 에러가 발생했습니다." });
  }
};

//multipart/form-data형식의 이미지를 받기 위한 전처리
const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = uuid();
      callback(null, name + path.extname(file.originalname)); //imageName+.png
    },
  }),
  fileFilter: (_, file, callback) => {
    if (file.mimetype == "imgae/jpeg" || file.mimetype == "image/png")
      callback(null, true);
    else callback(new Error("이미지가 아닙니다."));
  },
});

const uploadSubImage = async (req: Request, res: Response) => {
  const sub = res.locals.sub;
  console.log(req.body);
  try {
    const type = req.body.type;
    if (type !== "image" && type !== "banner") {
      if (!req.file.path) {
        return res.status(400).json({ error: "유효하지 않는 파일입니다." });
      }
      //multer에 의해 캡슐화된 객체는 이미 경로가 존재하므로  삭제
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "잘못된 유형" });
    }

    //이미지 갱신
    let oldImageUrn = "";
    if (type === "image") {
      oldImageUrn = sub.imageUrn || "";
      sub.imageUrn = req.file.filename || "";
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file.filename || "";
    }
    await sub.save();
    //이미지 갱신시 기존이미지 삭제
    if (oldImageUrn !== "") {
      const fullFileName = path.resolve(
        process.cwd(),
        "public",
        "images",
        oldImageUrn
      );
      fs.unlinkSync(fullFileName);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "이미지 업로드 실패" });
  }
};

router.post("/", userMiddleware, authMiddleware, createSub);
router.get("/topsubs", topSubs);
router.get("/:name", getSub);
router.post(
  "/:subname/upload",
  userMiddleware,
  authMiddleware,
  ownSub,
  upload.single("file"),
  uploadSubImage
);

export default router;
