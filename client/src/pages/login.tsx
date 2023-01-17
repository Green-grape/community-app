import React, { FormEvent, useState } from "react";
import Link from "next/link";
import InputGroup from "../components/InputGroup";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthDispatch } from "../provider/auth";
import { useAuthState } from "../provider/auth";

function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();
  if (authenticated) router.push("/",undefined, {shallow:true});
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { username, password });
      dispatch("LOGIN", res.data);
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setErrors(error?.response?.data || {});
    }
  };
  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-3 text-lg font-medium font-semibold">Sign In</h1>
          <form onSubmit={handleSubmit}>
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
            <button
              className={`w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded`}
            >
              Sign In
            </button>
          </form>
          <small>
            No Account?
            <Link href="/register" className="ml-1 text-blue-500">
              Sign Up
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
