import React, { FormEvent, useState } from "react";
import Link from "next/link";
import InputGroup from "../components/InputGroup";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<any>({});
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("click");
    try {
      const res = await axios.post("/auth/register", {
        email,
        username,
        password,
        passwordConfirm,
      });
      console.log(res);
      setErrors({});
      router.push("/");
    } catch (error: any) {
      //To Do:에러 형식 확인
      console.log(error);
      setErrors(error.response.data);
    }
  };
  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-3 text-lg font-medium font-semibold">Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            ></InputGroup>
            <InputGroup
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={errors.username}
            ></InputGroup>
            <InputGroup
              placeholder="password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            ></InputGroup>
            <InputGroup
              placeholder="passwordConfirm"
              value={passwordConfirm}
              setValue={setPasswordConfirm}
              error={errors.setPasswordConfirm}
            ></InputGroup>
            <button
              className={`w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded`}
            >
              Sign Up
            </button>
          </form>
          <small>
            Already Have Account?
            <Link href="/login" className="ml-1 text-blue-500">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
