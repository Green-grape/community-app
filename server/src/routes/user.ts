import { Request, Response, Router } from "express";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import userMiddleware from "../middlewares/user";

interface OwnerData{
    type:string;
    data:Record<string,any>;
};

const getUser=async (req:Request, res:Response)=>{
    const {username}=req.params;
    try{
        const owner=await User.findOneOrFail({
            where:{username},
            select:["username","createdAt"]
        });

        //유저가 쓴 포스트 정보
        const posts=await Post.find({
            where:{username},
            relations:["comments","votes","sub"] //userVote를 위해서 join
        });

        //유저가 쓴 댓글 정보
        const comments=await Comment.find({
            where:{username},
            relations:["post","votes"]
        });

        if(res.locals.user){
            posts.forEach((post)=>post.setUserVote(res.locals.user));
            comments.forEach((comment)=>comment.setUserVote(res.locals.user));
        }

        let ownerData:OwnerData[]=[];
        //인스턴스에서 바로 넣으면 expose가 안들어가므로 toJSON 시용
        posts.forEach((post)=>ownerData.push({type:"post",data:post.toJSON()}));
        comments.forEach((comment)=>ownerData.push({type:"comment",data:comment.toJSON()}));

        ownerData.sort((a,b)=>{
            if(a.data.createdAt<b.data.createdAt) return -1;
            if(a.data.createdAt>b.data.createdAt) return 1;
            return 0;
        })

        return res.json({owner, ownerData});
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"유저 정보를 가져오는데 실패했습니다."});
    }
}

const router=Router();

export default router;

router.get("/:username", userMiddleware, getUser);