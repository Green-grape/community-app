import { Response, Request, Router } from "express";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";
import { Sub } from "../entities/Sub";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";

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

const getPost=async (req:Request,res:Response)=>{
  const {identifier,slug}=req.params;
  try{
    const post=await Post.findOneOrFail({
      where:{
        identifier, slug
      },
      relations:["sub", "votes"] //left join
    });
    post.votes=post.votes.filter(vote=>vote.commentId===null);
    if(res.locals.user){
      post.setUserVote(res.locals.user);
    }
    return res.json(post);
  }catch(e){
    console.error(e);
    return res.status(500).json({error:"포스트를 가져오는데 실패했습니다."})
  }
}

const createPostComment=async (req:Request, res:Response)=>{
  const {identifier, slug}=req.params;
  const {comment}=req.body;
  try{
    const post=await Post.findOneByOrFail({identifier,slug});
    const newComment=new Comment();
    newComment.body=comment;
    newComment.post=post;
    newComment.user=res.locals.user;
    if(res.locals.user){
      post.setUserVote(res.locals.user);
    }
    await newComment.save();
    return res.json(newComment);
  }
  catch(error){
    console.error(error);
    return res.status(500).json({error:"댓글을 생성하는데 실패했습니다."})
  }
}

const getPostComment=async(req:Request, res:Response)=>{
  const {identifier, slug}=req.params;
  try{
    const post=await Post.findOneByOrFail({identifier,slug});
    const comments=await Comment.find({
      where:{postId:post.id},
      order:{createdAt:"DESC"},
      relations:["votes"]
    })
    if(res.locals.user){
      comments.forEach(comment=>comment.setUserVote(res.locals.user));
    }
    console.log
    return res.json(comments);
  }catch(error){
    console.error(error);
    return res.status(500).json({error:"댓글을 가져오는데 실패했습니다."})
  }
}

export default router;

router.post("/:identifier/:slug/comments", userMiddleware, authMiddleware, createPostComment);
router.get("/:identifier/:slug/comments", userMiddleware, getPostComment);
router.get("/:identifier/:slug", userMiddleware,getPost);
router.post("/", userMiddleware, authMiddleware, createPost);
