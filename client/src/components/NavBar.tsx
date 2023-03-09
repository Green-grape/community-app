import React from "react";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "../provider/auth";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

function NavBar() {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  const handleLogout = async () => {
    try {
      const ret = await axios.post("/auth/logout");
      dispatch("LOGOUT");
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="w-full fixed top-0 z-10 flex items-center justify-between h-14 px-5 bg-white">
      <span className="text-xl font-semibold text-gray-400">
        <Link href="/">Community</Link>
      </span>
      <div className="w-full px-5">
        <div className="relative flex items-center bg-gray-100 border-2 rounded hover:border-gray-700 hover:bg-white">
          <FaSearch className="ml-2 fill-gray-400"/>
          <input
            type="text"
            placeholder="Search Reddit "
            className="px-3 py-1 bg-transparent h-7 rounded focus:outline-none"
          />
        </div>
      </div>
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-20 px-2 mr-2 text-center text-sm h-7 text-white bg-gray-400 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                className="w-20 px-2 pt-1 mr-2 text-center text-sm h-7 text-blue-500 border border-blue-500 rounded"
                href="/login"
              >
                Log In
              </Link>
              <Link
                className="w-20 px-2 pt-1 mr-2 text-center text-sm h-7 bg-gray-400 text-white rounded"
                href="/register"
              >
                Sign Up
              </Link>
            </>
          ))}
      </div>
    </div>
  );
}

export default NavBar;
