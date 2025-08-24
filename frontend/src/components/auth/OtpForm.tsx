"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function OtpForm() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }
    // TODO: verify OTP with backend
    localStorage.setItem("authToken", "fake-jwt-token");
    router.push("/dashboard");
  };

  return (
    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-10 flex flex-col justify-center text-gray-900 dark:text-white rounded-r-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">Verify OTP</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
        Enter the 6-digit OTP sent to your email
      </p>

      <form className="space-y-4 flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {otp.map((val, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/, "");
                if (!val) return;
                const newOtp = [...otp];
                newOtp[i] = val;
                setOtp(newOtp);
                if (i < 5 && otpRefs.current[i + 1]) {
                  otpRefs.current[i + 1]?.focus();
                }
              }}
              ref={(el) => {
                otpRefs.current[i] = el; 
              }}
              className="w-14 h-14 text-center text-2xl rounded-lg border border-gray-300 dark:border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-cyan-400 bg-gray-100 dark:bg-gray-800 outline-none shadow hover:scale-105 transition active:scale-95"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 rounded-lg transition font-medium active:scale-95 text-white shadow-md hover:shadow-lg"
        >
          Verify & Continue
        </button>
      </form>
    </div>
  );
}
