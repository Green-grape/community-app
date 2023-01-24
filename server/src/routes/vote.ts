import { Request, Response, Router } from "express";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";
import { Vote } from "../entities/Vote";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { IsNull } from "typeorm";

const voteValues=[-1,0,1];

const setVote=async (req:Request, res:Response)=>{
    const {identifier,slug, commentIdentifier, value}=req.body;
    if(!voteValues.includes(value)){
        return res.status(500).json({error:"투표값이 잘못되었습니다."})
    }

    let joinedPost:Post;
    try{
        let user:User=res.locals.user;
        let comment:Comment;
        const post:Post=await Post.findOneBy({identifier,slug});
        let vote:Vote;

        if(commentIdentifier){ //댓글 투표
            comment=await Comment.findOneBy({identifier:commentIdentifier});  
            vote=await Vote.findOneBy({username:user.username, commentId:comment.id});
        }else{//글 투표
            vote=await Vote.findOneBy({username:user.username,postId:post.id,commentId:IsNull()});
        }        
        console.log(vote);
        if(!vote && value==0){ //존재할 수 없는 경우
            return res.status(500).json({error:"잘못된 입력입니다."})
        }else if(value===0){
            //vote값이 의미 없어졌으므로 제거한다.
            await vote.remove();
        }else if(!vote){
            //vote 생성
            vote=new Vote();
            vote.user=user;
            vote.value=value;
            vote.post=post;
            if(comment) vote.comment=comment;
            await vote.save();
        }else{
            //vote 값을 갱신
            vote.value=value;
            await vote.save();
        }

        joinedPost=await Post.findOne({
            where:{identifier,slug},
            relations:["votes","comments","comments.votes","sub"]
        });
        joinedPost.setUserVote(user);
        joinedPost.comments.forEach(comment=>comment.setUserVote(user));
    }catch(error){
        console.error(error);
        return res.status(500).json({error:"투표를 하는데 실패했습니다."});
    }
    return res.json(joinedPost);

}

const router=Router();

router.post("/", userMiddleware, authMiddleware,setVote);

export default router;