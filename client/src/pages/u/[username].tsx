import { useRouter } from 'next/router'
import React from 'react'
import useSWR from "swr";
import { OwnerData,Comment } from '../../common/types';
import { Post } from '../../common/types';
import PostCard from '../../components/PostCard';
import Link from 'next/link';
import dayjs from 'dayjs';

function UserPage() {
    const router=useRouter();
    const username=router.query.username;
    const {data,error,mutate}=useSWR(username ? `/users/${username}` :null);
    if(!data) return null;
    return (
        <div className='top flex max-w-5xl px-4 pt-5 mx-auto'>
            {/*유저 포스트 댓글 리스트 */}
            <div className='w-full md:mr-3 md:w-8/12'>
                {data.ownerData.map((ownerData:OwnerData)=>{
                    if(ownerData.type==="post"){
                        const post=ownerData.data as Post;
                        return <PostCard key={post.identifier} post={post} mutate={mutate}/>
                    }else{
                        const comment=ownerData.data as Comment;
                        return (<div key={comment.identifier} className="flex my-4 bg-white rounded">
                            <div className='flex-shrink=0 w-10 py-10 text-center bg-gray-200 rounded-l'>
                                <i className='text-gray-500 fas fa-comment-alt fa-xs'/>
                            </div>
                            <div className='w-full p-2'>
                                <p className='mb-2 text-xs text-gray-500'>
                                    <Link href={`/u/${comment.username}`} className="cursor-pointer hover:underline mr-1">{comment.username}</Link>
                                    <span>commented on</span>
                                    <Link href={`${comment.post?.url}`} className="font-semibold cursor-pointer hover:underline mx-1">{comment.post?.url}</Link>
                                    <span>*</span>
                                    <Link href={`/u/${comment.post?.subName}`} className="text-black cursor-pointer hover:underline ml-1">{comment.post?.subName}</Link>
                                </p>
                                <hr/>
                                <p className='p-1'>{comment.body}</p>
                            </div>
                        </div>)
                    }
                })}
            </div>
            {/*유저 정보 */}
            <div className='hidden ml-3 w-4/12 md:block'>
                <div className='flex items-center p-3 bg-gray-500 rounded-t'>
                    <img src='https://www.gravatar.com/avatar/0000?d=mp&f=y' alt="user profile" className='border border-white rounded-full' width={40} height={40}></img>
                    <p className='pl-3 text-md'>{data.owner.username}</p>
                </div>
                <div className='p-3 bg-gray-100 rounded-b'>
                    <p>{dayjs(data.owner.createdAt).format("YYYY.MM.DD")} 가입</p>
                </div>
            </div>
        </div>
    )
}

export default UserPage