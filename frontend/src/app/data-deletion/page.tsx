"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

const DataDeletion = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white-50 text-gray-800 dark:bg-black dark:text-gray-100 transition-colors duration-300">
      <header className="w-full flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <ThemeToggleButton
          variant="gif"
          url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif"
        />
      </header>

      <div className="px-10 sm:px-15 py-10 sm:py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight underline decoration-black dark:decoration-white">
          AuthKit – Data Deletion
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8">
          Last updated: 2025-08-28
        </p>

        <section className="space-y-8 leading-relaxed text-base sm:text-lg">
          <p>
            You may request deletion of your account and data anytime. We’ll
            delete or anonymize data unless required to retain it by law.
          </p>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 underline decoration-black dark:decoration-white">
              Option A – In-App
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Sign in to your AuthKit account.</li>
              <li>Go to <strong>Settings → Account → Delete Account</strong>.</li>
              <li>Confirm the request.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 underline decoration-black dark:decoration-white">
              Option B – Email Request
            </h2>
            <p>
              Send an email with subject <em>“Data Deletion Request”</em> to{" "}
              <a
                href="mailto:noreplyauthentickit@gmail.com"
                className="text-blue-600 dark:text-blue-400 underline hover:opacity-80"
              >
                noreplyauthentickit@gmail.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 underline decoration-black dark:decoration-white">
              Facebook Login Users
            </h2>
            <p>
              You can also remove AuthKit from your Facebook settings under{" "}
              <em>Settings &gt; Apps and Websites</em>. This stops future data
              sharing with AuthKit.
            </p>
          </div>
        </section>

        <footer className="mt-12 text-sm sm:text-base text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
          This document is for informational purposes and not legal advice.
        </footer>
      </div>
    </main>
  );
};

export default DataDeletion;
