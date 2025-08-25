"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login"); 
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black p-6">
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          You are successfully logged in with AuthKit.
        </p>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
