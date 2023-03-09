import React from 'react'
import { Post } from '../common/types'
import VoteArrows from "../components/VoteArrows";
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useAuthState } from '../provider/auth';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import { Sub } from '../common/types';


interface postCardProps{
    id?:string;
    post:Post
    mutate?:()=>void
    subMutate?:()=>void
}

function PostCard({post:{createdAt,
    updatedAt,
    identifier,
    title,
    slug,
    body,
    subName,
    username,
    sub,
    url,
    userVote,
    voteScore,
    commentCount},mutate,subMutate,id}:postCardProps) {
        const router=useRouter();
        const {authenticated,user}=useAuthState();
        const vote=async (value:number)=>{
            if(!authenticated) router.push("/login");
            if(value===userVote){ //vote 취소
                value=0;
            }
            try{
                await axios.post(`/votes`,{identifier,slug,value}); 
                if(mutate) mutate();
                if(subMutate) subMutate();
            }catch(error){
                console.error(error);
            }
        };
  return (
    <div className='flex bg-white rounded mb-5' id={id}>
        <VoteArrows voteFunction={vote} userVote={userVote} voteScore={voteScore}></VoteArrows>
        <div className='py-2 pr-2'>
                <header className='flex items-center'>
                    {!subMutate && (
                    <div className='flex items-center'>
                      <Link href={`/r/${subName}`}>
                        <img src={sub?.imageUrl} alt="sub" className='rounded-full cursor-pointer' width={12} height={12}></img>
                      </Link>
                      <Link href={`/r/${subName}`} className="ml-2 text-xs font-bold cursor-pointer">
                        /r/{subName}
                      </Link>
                      <span className='mx-1 text-xs text-gray-400'>·</span>
                    </div>)}
                  <p className='text-xs text-gray-400'>
                    Posted by
                    <Link className='mx-1 hover:underline' href={`/u/${username}`}>
                      /u/{username}
                    </Link>
                    <Link className='mx-1 hover:underline' href={url}>
                      {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                    </Link>
                  </p>
                </header>
                <h1 className='my-1 text-xl font-medium'>
                  <Link href={url}>{title}</Link>
                </h1>
                <p className='my-3 text-sm'>{body}</p>
                <div className='flex'>
                  <button>
                    <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                    <span className='font-bold'>
                      {commentCount}
                    </span>
                  </button>
                </div>
              </div>
    </div>
  )
}

export default PostCard