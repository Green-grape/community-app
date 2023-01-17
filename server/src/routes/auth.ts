import { validate, ValidationError } from "class-validator";
import e, { NextFunction, Request, response, Response, Router } from "express";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { Sub } from "../entities/Sub";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

//To Do: Test
const router = Router();

//현재 유저가 로그인되어 있는지 확인
const check = (_: Request, res: Response) => {
  console.log("check", res.locals.user !== undefined);
  return res.json(res.locals.user);
};

//error를 object로 변환
const mapErrors = (erros: ValidationError[]) => {
  return erros.reduce((prev: any, err: ValidationError) => {
    prev[err.property] = Object.values(err.constraints)[0];
    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password, passwordConfirm } = req.body;
  try {
    let customErrors: any = {};
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    if (emailUser)
      customErrors.email = "이미 해당 이메일 주소가 사용되었습니다.";
    if (usernameUser)
      customErrors.username = "이미 이 사용자 이름이 사용되었습니다.";
    if (password != passwordConfirm)
      customErrors.password = customErrors.passwordConfirm =
        "비밀번호와 비밀번호 확인이 다릅니다.";

    if (Object.keys(customErrors).length > 0) {
      return res.status(400).json(customErrors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    const validationErrors = await validate(user); //entity validation check
    if (validationErrors.length > 0) {
      return res.status(400).json(mapErrors(validationErrors));
    }
    await user.save();
    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB 내부 에러가 발생했습니다." });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOneBy({ username });
    if (user === null)
      return res
        .status(404)
        .json({ username: "사용자 이름이 등록되지 않았습니다." });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ password: "비밀번호가 일치하지 않습니다." });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.set(
      "Set-cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60,
        path: "/",
      })
    );
    return res.json({ user, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB 내부 에러가 발생했습니다." });
  }
};

const logout = async (req: Request, res: Response) => {
  res.set(
    "Set-cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
  );
  return res.status(200).json({ success: true });
};

router.post("/logout", userMiddleware, authMiddleware, logout);
router.get("/check", userMiddleware, authMiddleware, check);
router.post("/register", register);
router.post("/login", login);

export default router;
