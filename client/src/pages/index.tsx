import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import InputGroup from "../components/InputGroup";
import axios from "axios";
import { useRouter } from "next/router";
import { NextPage } from "next";
import useSWR from "swr";
import { Post, Sub } from "../common/types";
import { useAuthState } from "../provider/auth";
import useSWRInfinite from "swr/infinite";
import PostCard from "../components/PostCard";

export default function Home() {
  //현재 로그인 되어있는지 확인
  const { authenticated } = useAuthState();

  //현재 sub가져오기
  const address = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/subs/topsubs`;
  const { data: topsubs } = useSWR<Sub[]>(address);

  //무한 스크롤 구현
  const [observedPost, setObservedPost]=useState("");
  //posts 가져오기
  const getKey=(pageIndex:number, previousPageData:Post[])=>{
    if(previousPageData && !previousPageData.length) return null;
    return `/posts?page=${pageIndex}&limit=3`;
  }
  const {data, size, setSize, mutate, isLoading, isValidating, error}=useSWRInfinite<Post>(getKey);
  console.log("data",data);
  const isInitialLoading=!data && !error;
  const posts:Post[]=data ? ([] as Post[]).concat(...data):[];
  useEffect(()=>{
    //마지막 posts를 observer로 지정
    if(!posts || posts.length==0) return;
    const id=posts[posts.length-1].identifier;
    if(id!==observedPost){
      console.log("id",id, "ob",observedPost);
      setObservedPost(id);
      console.log("doc", document.getElementById(id));
      observeElement(document.getElementById(id));
    }
  },[posts]);
  const observeElement=(ele:HTMLElement | null)=>{
    if(!ele) return;
    const observer=new IntersectionObserver(
      (entries)=>{
        //관찰 대상이 기준 축을 교차하면 재로딩
        console.log("entries[0]",entries[0]);
        if(entries[0].isIntersecting===true){
          console.log("Render Posts");
          setSize(size+1);
          //로딩 끝나면 관찰 X
          observer.unobserve(ele);
        }
      },
      //얼마나 타켓의 가시성이 필요한가?
      {threshold:0.5}
    );
    console.log("ele",ele);
    //다시 관찰
    observer.observe(ele);
  }


  return (
    <div className="top flex justify-center pl-4 mx-auth">
      {/*포스트 리스트*/}
      <div className="max-w-5xl w-full md:mr-3 md:w-8/12">
        {isInitialLoading && <p className="text-lg text-center">Loading...</p>}
        {posts && posts.map((post)=>{
          if(post) return(<PostCard key={post.identifier} id={post.identifier} post={post} mutate={mutate}/>)
          else return <></>;
        })}
        {isValidating && posts.length>0 && (
          <p className="text-lg text-center">Loading More...</p>
        )}
      </div>
      {/*사이드바 */}
      <div className="hidden w-80 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-black text-lg font-semibold text-center">상위 커뮤니티</p>
          </div>
          {/*커뮤니티 리스트 */}
          <div>
            {topsubs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-2 text-xs border-b"
              >
                <Link href={`/r/${sub.name}`}>
                  <img
                    src={sub.imageUrl}
                    className="rounded-full cursor-pointer"
                    alt="Sub"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  className="w-full ml-3 font-bold hover:cursor-pointer"
                  href={`/r/${sub.name}`}
                >
                  /r/{sub.name}
                </Link>
                <p className="ml-auto font-med">
                  {sub.posts == undefined ? 0 : sub.posts.length}
                </p>
              </div>
            ))}
          </div>
          {authenticated && (
            <div className="w-full py-6 text-center">
              <Link
                className="w-full p-2 text-center text-white bg-blue-400 rounded"
                href="/subs/create"
              >
                커뮤니티 만들기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
