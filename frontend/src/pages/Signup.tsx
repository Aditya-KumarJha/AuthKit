"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Lottie from "lottie-react";
import animation1 from "@/lottie/animation-1.json";
import animation2 from "@/lottie/animation-2.json";
import {
  FaGoogle,
  FaGithub,
  FaFacebook,
  FaDiscord,
  FaLinkedin,
  FaEye,
  FaEyeSlash,
  FaWallet,
} from "react-icons/fa";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const providers = [
    { name: "Google", icon: <FaGoogle /> },
    { name: "GitHub", icon: <FaGithub /> },
    { name: "Facebook", icon: <FaFacebook /> },
    { name: "Discord", icon: <FaDiscord /> },
    { name: "LinkedIn", icon: <FaLinkedin /> },
    { name: "MetaMask", icon: <FaWallet /> },
  ];

  const animations = [animation1, animation2];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton
          variant="gif"
          url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif"
        />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative bg-white dark:bg-black/90 p-10 flex flex-col justify-center items-center text-center text-gray-900 dark:text-gray-100 rounded-l-2xl">
          <h1 className="text-4xl font-bold z-10 mb-4">
            Create your AuthKit account
          </h1>
          <p className="mt-2 max-w-md z-10 text-lg opacity-90 mb-6">
            Plug-and-play authentication with email/password, social logins, and Web3.
          </p>

          <div className="hidden xl:flex gap-6 z-10">
            {animations.map((anim, i) => (
              <motion.div
                key={i}
                initial={{ y: i === 0 ? -30 : 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Tilt
                  tiltMaxAngleX={15}
                  tiltMaxAngleY={15}
                  perspective={1000}
                  scale={1.03}
                  transitionSpeed={4000}
                >
                  <Lottie
                    animationData={anim}
                    loop
                    autoplay
                    className="w-60 h-60 lg:w-72 lg:h-72 rounded-2xl"
                  />
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-10 flex flex-col justify-center text-gray-900 dark:text-white rounded-r-2xl">
          <h2 className="text-2xl font-bold text-center mb-2">Create Your Account</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-8">
            Join AuthKit to power secure, modern authentication.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {providers.map((p) => (
              <button
                key={p.name}
                type="button"
                aria-label={`Sign up with ${p.name}`}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-500 hover:text-white transition rounded-lg py-3 active:scale-95 shadow-sm dark:shadow-md"
              >
                {p.icon} <span className="text-sm font-medium">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              or continue with email
            </span>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition"
              />
              <input
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition"
              />
            </div>

            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-cyan-400 outline-none placeholder-gray-400 dark:placeholder-gray-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-cyan-400 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 rounded-lg transition font-medium active:scale-95 text-white shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-teal-500 dark:text-cyan-400 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
