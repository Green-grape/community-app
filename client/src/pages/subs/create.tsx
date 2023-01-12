import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import InputGroup from "../../components/InputGroup";

function SubCreate() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<any>({});
  const handleSumbmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/subs", { name, title, description });
      router.push(`/r/${res.data.name}`);
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data);
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <h1 className="border-b-2 pb-2 font-medium text-lg">커뮤니티 만들기</h1>
        <form>
          <div className="my-6">
            <h2 className="text-lg font-medium">Name</h2>
            <p className="text-sm text-gray-400 mb-1.5">
              대문자를 포함한 커뮤니티 이름은 변경할 수 없습니다.
            </p>
            <InputGroup value={name} placeholder="이름" setValue={setName}></InputGroup>
          </div>
          <div className="my-6">
            <h2 className="text-lg font-medium">Title</h2>
            <p className="text-sm text-gray-400 mb-1.5">
              커뮤니티 제목은 주제를 나타냅니다. 언제든지 변경할 수 있습니다.
            </p>
            <InputGroup value={title} placeholder="제목" setValue={setTitle}></InputGroup>
          </div>
          <div className="my-6">
            <h2 className="text-lg font-medium">Description</h2>
            <p className="text-sm text-gray-400 mb-1.5">
              새로운 회원이 커뮤니티를 이해하는 방법입니다.
            </p>
            <InputGroup value={description} placeholder="설명" setValue={setDescription}></InputGroup>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 py-1 px-4 rounded text-white font-semibold text-md">
              커뮤니티 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubCreate;
