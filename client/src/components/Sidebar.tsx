import React from "react";
import { useAuthState } from "../provider/auth";
import { Sub } from "../common/types";
import Link from "next/link";
import dayjs from "dayjs";

type Props = {
  sub: Sub;
};

function Sidebar({ sub }: Props) {
  const { authenticated } = useAuthState();
  return (
    <div className="hidden w-4/12 md:block">
      <div className="bg-white border rounded">
        <div className="p-3 bg-gray-400 rounded-t">
          <p className="font-semibold text-white">커뮤니티에 대해서</p>
        </div>
        <div className="p-3">
          <p className="mb-3 text-base">{sub?.description}</p>
          <div className="flex mb-3 text-sm font-medium">
            <div className="w-1/2">
              <p>100</p>
              <p>멤버</p>
            </div>
          </div>
          <p className="my-3">{dayjs(sub?.createdAt).format("MM.DD.YYYY")}</p>
          {authenticated && (
            <div className="mx-0 my-2">
              <Link
                className="w-full p-2 text-sm text-white bg-gray-400 rounded"
                href={`/r/${sub.name}/create`}
              >
                포스트 생성
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
