import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { Post } from "../../../common/types";
import axios from "axios";

function PostCreate() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { sub: subName } = router.query;
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    //제목이 없거나 sub를 통해서 접근한 것이 아닌경우 실행하지 않는다.
    if (title.trim() === "" || !subName) return;
    try {
      const { data: post } = await axios.post<Post>("/posts", {
        title: title.trim(),
        description,
        sub: subName,
      });
      router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">포스트 생성하기</h1>
          <form onSubmit={handleSubmit}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Title"
                maxLength={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="absolute top-2.5 right-5 mb-2 text-sm text-gray-400 select-none">
                {title.trim().length}/20
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded"
                disabled={title.trim().length === 0}
              >
                생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostCreate;
