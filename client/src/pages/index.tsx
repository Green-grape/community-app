import React, { FormEvent, useState } from "react";
import Link from "next/link";
import InputGroup from "../components/InputGroup";
import axios from "axios";
import { useRouter } from "next/router";
import { NextPage } from "next";
import useSWR from "swr";
import { Sub } from "../common/types";
import { useAuthState } from "../provider/auth";

export default function Home() {
  const { authenticated } = useAuthState();
  const fetcher = async (url: string) =>
    await axios.get(url).then((res) => res.data);
  const address = "http://nicecode.cf:5501/api/subs/topsubs";
  const { data: topsubs } = useSWR<Sub[]>(address, fetcher);
  return (
    <div className="flex max-w-5xl px-4 pt-16 mx-auth">
      {/*포스트 리스트*/}
      <div className="w-full md:mr-3 md:w-8/12"></div>
      {/*사이드바 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
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
  );
}
