"use client";

import React from "react";
import WrapButton from "@/components/ui/wrap-button";
import { CardCarousel } from "@/components/ui/card-carousel";
import { Code, LogIn } from "lucide-react";

export default function HeroSection() {
  const images = [
    { src: "/card/card-1.png", alt: "Dashboard 1" },
    { src: "/card/card-2.png", alt: "Dashboard 2" },
    { src: "/card/card-3.png", alt: "Dashboard 3" },
    { src: "/card/card-4.webp", alt: "Dashboard 4" },
  ];

  return (
    <section className="relative overflow-hidden pt-0 md:pt-10">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 rounded-full filter blur-3xl animate-slowPulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tr from-cyan-400 via-teal-400 to-green-500 opacity-20 rounded-full filter blur-3xl animate-slowPulse"></div>

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-start md:justify-between gap-12 relative z-10">
        <div className="md:w-3/5 mt-42 flex flex-col items-start text-left space-y-4">
          <h1 className="text-5xl md:text-4xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            AuthKit <span className="text-indigo-600 dark:text-indigo-400">— Fast & Secure</span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 max-w-lg">
            Prebuilt authentication for web apps — login, social sign-in, and Web3 wallets in one package.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row mt-4">
            <WrapButton href="/signup">
              <LogIn />
              Get Started
            </WrapButton>
            <WrapButton href="/features">
              <Code />
              View Code
            </WrapButton>
          </div>
        </div>

        <div className="mt-5 md:mt-20 w-full max-w-md md:max-w-lg lg:max-w-md border border-zinc-300 dark:border-zinc-700 rounded-3xl p-6 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md shadow-2xl transition-transform duration-500">
          <CardCarousel
            images={images}
            autoplayDelay={2000}
            showPagination={false}
            showNavigation={true}
          />
        </div>
      </div>
    </section>
  );
}
